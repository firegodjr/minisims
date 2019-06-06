import { Tiles } from "../constants.js";
import { createTable } from "../util/util.js";

const TILE_SIZE = 40;
const GRASS_THRESHOLD = 0.5;

const colorTable = createTable(
    [Tiles.GRASS, Tiles.WHEAT, Tiles.WHEAT_RIPE, Tiles.STONE, Tiles.ORE, Tiles.ORE_RIPE, Tiles.WATER], 
    [[35, 135, 43], [100, 75, 45], [210, 155, 94], [150, 150, 150, 5], [80, 80, 80, 5], [80, 80, 80, 5], [110, 210, 190, 0]]
);

function add_detail(x, y, half_board, anchor, color, stroke = 4, density = 20, height = 20, height_variation = 1, height_offset_x = 0, height_offset_z = 0, random_variation = false, optimize = true)
{
    var root_pos = get_tile_pos(x, y, half_board);
    root_pos.x -= TILE_SIZE/2;
    root_pos.z -= TILE_SIZE/2;
    var path = [];
    for(var i = 0; i < density; ++i)
    {
        for(var j = 0; j < density; ++j)
        {
            if(optimize && !random_variation && (j > 1 && j < density - 2) && (i > 1 && i < density - 2))
            {
                continue;
            }

            var x_variation = Math.random() * 0.5 * TILE_SIZE / density;
            var z_variation = Math.random() * 0.5 * TILE_SIZE / density;
            var pos_x;
            var pos_y = -stroke/2;
            var pos_z;

            if(random_variation)
            {
                pos_x = Zdog.lerp(stroke, TILE_SIZE - stroke, Math.random());
                pos_z = Zdog.lerp(stroke, TILE_SIZE - stroke, Math.random());
            }
            else
            {
                pos_x = x_variation + Zdog.lerp(0, TILE_SIZE, i/density);
                pos_z = z_variation + Zdog.lerp(0, TILE_SIZE, j/density);
            }

            path.push({
                move: {
                    x: pos_x,
                    y: pos_y,
                    z: pos_z
                }
            },
            {
                line: {
                    x: pos_x + height_offset_x,
                    y: pos_y + Math.random() * height_variation * height - height,
                    z: pos_z + height_offset_z
                }
            });
        }
    }

    var grass_container = new Zdog.Group({
        addTo: anchor,
        translate: {x: root_pos.x, z: root_pos.z }
    })
            
    var grass_shape = new Zdog.Shape({
        addTo: grass_container,
        stroke: stroke,
        color: color,
        path: path
    });

    return grass_container;
}

function add_grass(x, y, half_board, anchor, color, density = 20, height = 20, variation = 1, optimize = true)
{
    return add_detail(x, y, half_board, anchor, color, 4, density, height, variation, 0, 0, false, optimize);
}

function add_mineral(x, y, half_board, anchor, color, density)
{
    return add_detail(x, y, half_board, anchor, color, 8, density, 0, 0, 1, 0, true);
}

function get_tile_pos(x, y, half_board)
{
    return {x: x * TILE_SIZE - half_board, z: y * TILE_SIZE - half_board};
}

function semi_random_color(r, g, b, variation=10)
{
    return `rgb(${Zdog.lerp(r-variation, r+variation, Math.random())}, ${Zdog.lerp(g-variation, g+variation, Math.random())}, ${Zdog.lerp(b-variation, b+variation, Math.random())}`;
}

function create_tile(color, x, y, half_board, anchor, tileType = -1, fill = true, stroke = 1)
{
    var tile_surface = new Zdog.Rect({
        tileType: tileType,
        addTo: anchor,
        color: color,
        width: TILE_SIZE,
        height: TILE_SIZE,
        stroke: stroke,
        fill: fill,
        translate: get_tile_pos(x, y, half_board),
        rotate: { x: Zdog.TAU / 4 }
    });

    return tile_surface;
}

function create_drone(x, y, anchor)
{
    var stroke = TILE_SIZE / 2;
    var drone_group = new Zdog.Group({
        addTo: anchor
    });
    new Zdog.Cone({
        addTo: drone_group,
        color: "#493a04",
        diameter: TILE_SIZE / 2,
        length: 30,
        stroke: false,
        fill: true,
        rotate: {x: Zdog.TAU / 4}
    });
    new Zdog.Hemisphere({
        addTo: drone_group,
        color: "#493a04",
        diameter: TILE_SIZE / 2,
        length: 15,
        stroke: false,
        fill: true,
        rotate: {x: Zdog.TAU / 4, y: Zdog.TAU / 2},
        translate: {y: -18}
    })
    new Zdog.Shape({
        addTo: drone_group,
        color: "#d8ceab",
        translate: {y: -30},
        stroke: stroke
    });
    new Zdog.Shape({
        addTo: drone_group,
        visible: false,
        translate: {y: -90}
    })

    return drone_group;
}

function init_tile(game, x, y, half_board, tile, anchor)
{
    return create_tile(semi_random_color(...colorTable[tile]), x, y, half_board, anchor, tile);
}

export function BoardManager(game)
{
    function BoardCoords(x, y)
    {
        var self = this;
        self.x = x;
        self.y = y;

        return self;
    }

    self = this;
    self.rot_offset = -Zdog.TAU / 8;
    self.rot_buf = 0;
    self.pitch_offset = -Zdog.TAU / 12;
    self.pitch_offset_buf = 0;
    self.selected_tile = new BoardCoords(-1, -1);

    self.dragStart = function(pointer)
    {

    }

    self.dragMove = function(pointer, moveX, moveY)
    {
        game.m_pitch = Math.max(
            -Zdog.TAU / 4, Math.min(
                -Zdog.TAU / 20, -Zdog.TAU * moveY / 2000 + self.pitch_offset
                ));
        self.pitch_buf = game.m_pitch;

        game.m_rotation = -Zdog.TAU * moveX / 1000 + self.rot_offset;
        self.rot_buf = game.m_rotation;
    }

    self.dragEnd = function()
    {
        self.rot_offset = self.rot_buf;
        self.pitch_offset = self.pitch_buf;
    }

    self.selectTile = function(x, y)
    {
        self.selected_tile = new BoardCoords(x, y);
    }

    return self;
}

export function drawBoard(game, board_mgr, event)
{
    var canvas = document.getElementById("cvs_viewport");
    var ctx = canvas.getContext("2d");
    var half_board = ((game.m_tiles.length - 1) * TILE_SIZE / 2);
    var full_board = game.m_tiles.length * TILE_SIZE;

    var board = new Zdog.Illustration({
        element: "#cvs_viewport",
        color: "rgb(110, 210, 190)",
        resize: true,
        dragRotate: true,
        onDragStart: board_mgr.dragStart,
        onDragMove: board_mgr.dragMove,
        onDragEnd: board_mgr.dragEnd,
        rotate: { x: -Zdog.TAU / 12, y: -Zdog.TAU /8}
    });

    var root = new Zdog.Group({
        addTo: board
    });

    var tiles = new Zdog.Group({
        addTo: root
    });

    var grass = new Zdog.Group({
        addTo: root,
        updateSort: true
    });

    var highlights = new Zdog.Group({
        addTo: root
    });

    var drones = new Zdog.Group({
        addTo: root,
        updateSort: true
    });

    // Keeps track of all tiles for later changes
    var tileArr = [];
    var highlightArr = [];
    var grassArr = [];
    var droneArr = [];

    for(var i = 0; i < game.m_tiles.length; ++i)
    {
        tileArr.push([]);
        highlightArr.push([]);
        grassArr.push([]);
        for(var j = 0; j < game.m_tiles[i].length; ++j)
        {
            var tile = game.m_tiles[i][j];
            var tile_surface = init_tile(game, i, j, half_board, tile, tiles);
            var tile_highlight = create_tile("rgba(255, 0, 0, 0.8)", i, j, half_board, highlights, -1, false, 4);
            tile_highlight.visible = false;

            tileArr[i].push(tile_surface);
            highlightArr[i].push(tile_highlight);

            switch(tile)
            {
                case Tiles.WHEAT_RIPE:
                    grassArr[i].push(add_grass(i, j, half_board, grass, tile_surface.color, 5, 20, 0.2, false));
                    break;
                case Tiles.GRASS:
                    grassArr[i].push(add_grass(i, j, half_board, grass, tile_surface.color, 8, 10));
                    break;
                case Tiles.ORE_RIPE:
                    grassArr[i].push(add_mineral(i, j, half_board, grass, "#930", 2));
                    break;
                default:
                    grassArr[i].push(new Zdog.Shape({ visible: false }));
                    break;
            }
        }
    }

    function draw(delta)
    {
        if(game.m_zoom < GRASS_THRESHOLD)
        {
            grass.visible = false;
        }
        else
        {
            grass.visible = true;
        }

        // Update drones
        var refreshed = false;
        while(droneArr.length < game.m_drones.length)
        {
            droneArr.push(create_drone(0, 0, grass));
            refreshed = true;
        }

        for(var i = 0; i < game.m_drones.length; ++i)
        {
            droneArr[i].remove(); 
            var x = game.m_drones[i].m_pos_x;
            var y = game.m_drones[i].m_pos_y;

            droneArr[i].translate = {x: TILE_SIZE / 2, z: TILE_SIZE / 2}
            grassArr[x][y].addChild(droneArr[i]);
            grassArr[x][y].updateGraph();
        }

        if(refreshed)
        {
            grass.updateGraph();
        }

        // Update dirty tiles
        for(var i = 0; i < game.m_dirty_tiles.length; ++i)
        {
            var pair = game.m_dirty_tiles[i];
            tileArr[pair.x][pair.y].remove();
            tileArr[pair.x][pair.y].visible = false;
            grassArr[pair.x][pair.y].remove();
            grassArr[pair.x][pair.y].visible = false;

            tileArr[pair.x][pair.y] = init_tile(game, pair.x, pair.y, half_board, game.m_tiles[pair.x][pair.y], tiles);
            
            switch(game.m_tiles[pair.x][pair.y])
            {
                case Tiles.WHEAT_RIPE:
                    grassArr[pair.x][pair.y] = add_grass(pair.x, pair.y, half_board, grass, tileArr[pair.x][pair.y].color, 5, 20, 0.2);
                    break;
                case Tiles.GRASS:
                    grassArr[pair.x][pair.y] = add_grass(pair.x, pair.y, half_board, grass, tileArr[pair.x][pair.y].color, 8, 10);
                    break;
                case Tiles.ORE_RIPE:
                    grassArr[pair.x][pair.y] = add_mineral(pair.x, pair.y, half_board, grass, "#930", 2);
                    break;
                default:
                    grassArr[pair.x][pair.y] = new Zdog.Shape({ visible: false });
                    break;
            }
            tiles.updateGraph();
            grass.updateGraph();
        }
        game.m_dirty_tiles = [];

        // Update selections
        highlightArr.map((arr) =>
        {
            arr.map((tile) => 
            {
                tile.visible = false;
            });
        });

        if(board_mgr.selected_tile.x != -1 && board_mgr.selected_tile.y != -1)
        {
            highlightArr[board_mgr.selected_tile.x][board_mgr.selected_tile.y].visible = true;
        }

        // Do drawing
        ctx.fillRect(0, 0, ctx.width, ctx.height);
        board.zoom = game.m_zoom;
        board.rotate.x = game.m_pitch;
        board.rotate.y = game.m_rotation;
        board.updateRenderGraph();
        //document.dispatchEvent(new event(game, delta));
        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}