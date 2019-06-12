import { Table, make_pair } from "../util/table.js";
import { load_json } from "../network.js";
declare var Zdog: any;

const MODELS_PATH = "models/";
const MANIFEST_PATH = MODELS_PATH + "manifest.json";

enum Models
{
    DRONE = "drone",
}

interface ModelManifest extends Object
{
    paths: Array<string>;
}

interface JSONModel extends Object
{
    name: string;
    [key: string]: any; // any = Zdog.Anchor
}

class ModelStore
{
    models: Table<any>;
    
    /**
     * Loads specified zdog models into memory. If none specified, loads all in manifest.
     */
    async load_models(names?: string[])
    {
        let man = await load_json(MANIFEST_PATH) as ModelManifest;
        
        let model_arr: Promise<JSONModel>[] = [];
        for(let i = 0; i < man.paths.length; ++i)
        {
            if((names && names.includes(man.paths[i])) || !names)
            {
                model_arr.push(load_json(MODELS_PATH + man.paths[i]).then(function(model: JSONModel){
                    console.log("Loaded model " + man.paths[i]);
                    this.models.add(model.name, json_to_zdog(model));
                }.bind(this)) as Promise<JSONModel>);
            }
        }

        return await Promise.all(model_arr);
    }

    get(name: string, options: Object = {})
    {
        return this.models.get(name).copyGraph(options);
    }

    constructor()
    {
        this.models = new Table<JSONModel>([]);
    }
}

interface ZdogVector
{
    x: number,
    y: number,
    z: number
}

interface ZdogAnchorParams
{
    translate: ZdogVector,
    rotate: ZdogVector
}

interface ZdogGroupParams extends ZdogAnchorParams
{
    color?: string,
    updateSort?: boolean,
}

function anchor_from_key(key: string, params: Object)
{
    let anchor = new Zdog[key](params);
    anchor.rotate.x *= Zdog.TAU / 360;
    anchor.rotate.y *= Zdog.TAU / 360;
    anchor.rotate.z *= Zdog.TAU / 360;
    return anchor;
}

function json_to_zdog(obj: Object, root_key: string = "Group")
{
    let children: any[] = [];
    let params = {};

    Object.keys(obj).forEach(key => 
    {
        if(typeof obj[key] === "object" && key != "translate" && key != "rotate" && key != "scale")
        {
            children.push(json_to_zdog(obj[key], key));
        }
        else if(key != "name")
        {
            params[key] = obj[key];
        }
    });

    if(Object.keys(params).includes("type"))
    {
        root_key = params["type"];
    }
    let anchor = anchor_from_key(root_key, params);
    children.forEach((child: any) => anchor.addChild(child));

    return anchor;
}

export { ModelStore, json_to_zdog };