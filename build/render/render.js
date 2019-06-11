import { Coords } from "../game/game.js";
var TILE_SIZE = 40;
var GRASS_THRESHOLD = 0.5;
var GrassColorType;
(function (GrassColorType) {
    GrassColorType[GrassColorType["Inherit"] = 0] = "Inherit";
    GrassColorType[GrassColorType["Custom"] = 1] = "Custom";
})(GrassColorType || (GrassColorType = {}));
function add_detail(x, y, half_board, anchor, color, stroke, density, height, height_variation, height_offset_x, height_offset_z, random_variation, optimize) {
    if (stroke === void 0) { stroke = 4; }
    if (density === void 0) { density = 20; }
    if (height === void 0) { height = 20; }
    if (height_variation === void 0) { height_variation = 1; }
    if (height_offset_x === void 0) { height_offset_x = 0; }
    if (height_offset_z === void 0) { height_offset_z = 0; }
    if (random_variation === void 0) { random_variation = false; }
    if (optimize === void 0) { optimize = true; }
    var root_pos = get_tile_pos(x, y, half_board);
    root_pos.x -= TILE_SIZE / 2;
    root_pos.z -= TILE_SIZE / 2;
    var path = [];
    for (var i = 0; i < density; ++i) {
        for (var j = 0; j < density; ++j) {
            if (optimize && !random_variation && (j > 1 && j < density - 2) && (i > 1 && i < density - 2)) {
                continue;
            }
            var x_variation = Math.random() * 0.5 * TILE_SIZE / density;
            var z_variation = Math.random() * 0.5 * TILE_SIZE / density;
            var pos_x;
            var pos_y = -stroke / 2;
            var pos_z;
            if (random_variation) {
                pos_x = Zdog.lerp(stroke, TILE_SIZE - stroke, Math.random());
                pos_z = Zdog.lerp(stroke, TILE_SIZE - stroke, Math.random());
            }
            else {
                pos_x = x_variation + Zdog.lerp(0, TILE_SIZE, i / density);
                pos_z = z_variation + Zdog.lerp(0, TILE_SIZE, j / density);
            }
            path.push({
                move: {
                    x: pos_x,
                    y: pos_y,
                    z: pos_z
                }
            }, {
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
        translate: { x: root_pos.x, z: root_pos.z }
    });
    new Zdog.Shape({
        addTo: grass_container,
        stroke: stroke,
        color: color,
        visible: path.length == 0 ? false : true,
        path: path.length == 0 ? [{ move: { x: 0, y: 0, z: 0 } }] : path
    });
    return grass_container;
}
function add_grass(x, y, half_board, anchor, color, density, height, variation, optimize) {
    if (density === void 0) { density = 20; }
    if (height === void 0) { height = 20; }
    if (variation === void 0) { variation = 1; }
    if (optimize === void 0) { optimize = true; }
    return add_detail(x, y, half_board, anchor, color, 4, density, height, variation, 0, 0, false, optimize);
}
function add_mineral(x, y, half_board, anchor, color, density) {
    return add_detail(x, y, half_board, anchor, color, 8, density, 0, 0, 1, 0, true);
}
function get_tile_pos(x, y, half_board) {
    return { x: x * TILE_SIZE - half_board, z: y * TILE_SIZE - half_board };
}
function create_tile_from_object(tile, x, y, half_board, anchor) {
    return create_tile(tile.get_color(), x, y, half_board, anchor, tile.type, true, 1, false);
}
function create_grass_from_tile(tile, x, y, half_board, anchor) {
    return add_grass(x, y, half_board, anchor, tile.grass_color, tile.grass_density, tile.grass_height, tile.grass_height_variation, tile.optimize_grass);
}
function create_tile(color, x, y, half_board, anchor, tileType, fill, stroke, box) {
    if (tileType === void 0) { tileType = -1; }
    if (fill === void 0) { fill = true; }
    if (stroke === void 0) { stroke = 1; }
    if (box === void 0) { box = false; }
    var tile_surface;
    if (box) {
        var box_translation = { x: 0, y: 0, z: 0 };
        var tile_location = get_tile_pos(x, y, half_board);
        box_translation.x = tile_location.x;
        box_translation.z = tile_location.z;
        box_translation.y += TILE_SIZE / 4;
        tile_surface = new Zdog.Box({
            tileType: tileType,
            addTo: anchor,
            color: color,
            topFace: color,
            width: TILE_SIZE,
            height: TILE_SIZE,
            depth: TILE_SIZE / 2,
            stroke: stroke,
            fill: fill,
            translate: box_translation,
            rotate: { x: Zdog.TAU / 4 }
        });
    }
    else {
        tile_surface = new Zdog.Rect({
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
    }
    return tile_surface;
}
function create_drone(x, y, anchor) {
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
        rotate: { x: Zdog.TAU / 4 }
    });
    new Zdog.Hemisphere({
        addTo: drone_group,
        color: "#493a04",
        diameter: TILE_SIZE / 2,
        length: 15,
        stroke: false,
        fill: true,
        rotate: { x: Zdog.TAU / 4, y: Zdog.TAU / 2 },
        translate: { y: -18 }
    });
    new Zdog.Shape({
        addTo: drone_group,
        color: "#d8ceab",
        translate: { y: -30 },
        stroke: stroke
    });
    new Zdog.Shape({
        addTo: drone_group,
        visible: false,
        translate: { y: -90 }
    });
    return drone_group;
}
var BoardManager = /** @class */ (function () {
    function BoardManager(game) {
        this.pitch_offset = -Zdog.TAU / 12;
        this.pitch_buf = 0;
        this.rot_offset = -Zdog.TAU / 8;
        this.rot_buf = 0;
        this.pitch_offset = -Zdog.TAU / 12;
        this.pitch_buf = 0;
        this.selected_tile = new Coords(-1, -1);
        this.game = game;
    }
    BoardManager.prototype.dragStart = function (pointer) {
    };
    BoardManager.prototype.dragMove = function (pointer, moveX, moveY) {
        this.game.m_pitch = Math.max(-Zdog.TAU / 4, Math.min(-Zdog.TAU / 20, -Zdog.TAU * moveY / 2000 + this.pitch_offset));
        this.pitch_buf = this.game.m_pitch;
        this.game.m_rotation = -Zdog.TAU * moveX / 1000 + this.rot_offset;
        this.rot_buf = this.game.m_rotation;
    };
    BoardManager.prototype.dragEnd = function () {
        this.rot_offset = this.rot_buf;
        this.pitch_offset = this.pitch_buf;
    };
    BoardManager.prototype.selectTile = function (x, y) {
        this.selected_tile = new Coords(x, y);
    };
    return BoardManager;
}());
export function draw_board(game, board_mgr) {
    var canvas = document.getElementById("cvs_viewport");
    var ctx = canvas.getContext("2d");
    var half_board = ((game.m_tiles.length - 1) * TILE_SIZE / 2);
    var full_board = game.m_tiles.length * TILE_SIZE;
    var board = new Zdog.Illustration({
        element: "#cvs_viewport",
        color: "rgb(110, 210, 190)",
        resize: true,
        dragRotate: true,
        onDragStart: function (p) { return board_mgr.dragStart(p); },
        onDragMove: function (p, mx, my) { return board_mgr.dragMove(p, mx, my); },
        onDragEnd: function () { return board_mgr.dragEnd(); },
        rotate: { x: -Zdog.TAU / 12, y: -Zdog.TAU / 8 }
    });
    var root = new Zdog.Group({
        addTo: board
    });
    var tiles = new Zdog.Group({
        addTo: root,
        updateSort: true
    });
    var grass = new Zdog.Group({
        addTo: root,
        updateSort: true
    });
    var highlights = new Zdog.Group({
        addTo: root
    });
    // Keeps track of all tiles for later changes
    var tileArr = [];
    var highlightArr = [];
    var grassArr = [];
    var droneArr = [];
    for (var i = 0; i < game.m_tiles.length; ++i) {
        var TILE_HEIGHT_AMNT = TILE_SIZE * 0;
        tileArr.push([]);
        highlightArr.push([]);
        grassArr.push([]);
        for (var j = 0; j < game.m_tiles[i].length; ++j) {
            var tile = game.m_tiles[i][j];
            var tile_surface = create_tile_from_object(game.m_tiles[i][j], i, j, half_board, tiles);
            tile_surface.translate.y -= tile.height * TILE_HEIGHT_AMNT;
            var tile_highlight = create_tile("rgba(255, 0, 0, 0.8)", i, j, half_board, highlights, -1, false, 4); // magic numbers ree
            tile_highlight.translate.y -= tile.height * TILE_HEIGHT_AMNT;
            tile_highlight.visible = false;
            tileArr[i].push(tile_surface);
            highlightArr[i].push(tile_highlight);
            var tile_grass = add_grass(i, j, half_board, tiles, tile_surface.color, tile.grass_density, tile.grass_height, tile.grass_height_variation, tile.optimize_grass);
            tile_grass.translate.y -= tile.height * TILE_HEIGHT_AMNT;
            grassArr[i].push(tile_grass);
        }
    }
    var last_timestamp = 0;
    function draw(timestamp) {
        var delta = timestamp - last_timestamp;
        if (game.m_zoom < GRASS_THRESHOLD) {
            grass.visible = false;
        }
        else {
            grass.visible = true;
        }
        // Update drones
        var refreshed = false;
        while (droneArr.length < game.m_drones.length) {
            var new_index = droneArr.length;
            var new_x = game.m_drones[new_index].m_pos_x;
            var new_y = game.m_drones[new_index].m_pos_y;
            var new_drone = create_drone(new_x, new_y, grassArr[new_x][new_y]);
            new_drone.translate = { x: TILE_SIZE / 2, z: TILE_SIZE / 2 };
            droneArr.push(new_drone);
            grassArr[new_x][new_y].updateGraph();
            refreshed = true;
        }
        for (var i = 0; i < game.m_drones.length; ++i) {
            if (game.m_drones[i].m_moved) {
                droneArr[i].remove();
                var x = game.m_drones[i].m_pos_x;
                var y = game.m_drones[i].m_pos_y;
                grassArr[x][y].addChild(droneArr[i]);
                grassArr[x][y].updateGraph();
                refreshed = true;
            }
        }
        if (refreshed) {
            grass.updateGraph();
        }
        // Update dirty tiles
        for (var i = 0; i < game.m_dirty_tiles.length; ++i) {
            var pair = game.m_dirty_tiles[i];
            tileArr[pair.x][pair.y].remove();
            tileArr[pair.x][pair.y].visible = false;
            grassArr[pair.x][pair.y].remove();
            grassArr[pair.x][pair.y].visible = false;
            var newTile = create_tile_from_object(game.m_tiles[pair.x][pair.y], pair.x, pair.y, half_board, tiles);
            tileArr[pair.x][pair.y] = newTile;
            grassArr[pair.x][pair.y] = add_grass(i, j, half_board, grass, newTile.color, tile.grass_density, tile.grass_height, tile.grass_height_variation, tile.optimize_grass);
        }
        if (game.m_dirty_tiles.length > 0) {
            tiles.updateGraph();
            grass.updateGraph();
        }
        game.m_dirty_tiles = [];
        // Update selections
        highlightArr.map(function (arr) {
            arr.map(function (tile) {
                tile.visible = false;
            });
        });
        if (board_mgr.selected_tile.x != -1 && board_mgr.selected_tile.y != -1) {
            highlightArr[board_mgr.selected_tile.x][board_mgr.selected_tile.y].visible = true;
        }
        // Do drawing
        board.zoom = game.m_zoom;
        board.rotate.x = game.m_pitch;
        board.rotate.y = game.m_rotation;
        board.updateRenderGraph();
        ctx.fillText("FPS: " + 1000 / delta, 50, 50);
        //document.dispatchEvent(new event(game, delta));
        last_timestamp = timestamp;
        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
}
export { BoardManager };
