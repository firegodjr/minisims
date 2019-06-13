import { Table, make_pair } from "../util/table.js";
import { load_json } from "../network.js";
import { Zdog } from "../zDog/zdog.js";
declare var Zdog: Zdog;

const MODELS_PATH = "models/";
const MANIFEST_PATH = MODELS_PATH + "manifest.json";

/**
 * Represents a parsed manifest file, containing paths to other files
 */
interface ModelManifest extends Object
{
    paths: Array<string>;
}

/**
 * Represents a parsed JSON Zdog model
 */
interface JSONModel extends Object
{
    name?: string;
    [key: string]: any; // any = Zdog.Anchor
}

/**
 * Represents an option bag of parameters for initializing Zdog objects
 */
interface ZdogParams
{
    [key: string]: any;
}

/**
 * Manages loading and storage of Zdog models
 */
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
                model_arr.push(load_json(MODELS_PATH + man.paths[i]).then(function(model: JSONModel)
                {
                    console.log("Loaded model " + man.paths[i]);
                    let zdog_model = json_to_zdog(model);
                    this.models.set(model.name, json_to_zdog(zdog_model));
                    return zdog_model;
                }.bind(this)));
            }
        }

        return await Promise.all(model_arr);
    }

    /**
     * 
     * @param name Name of the model
     * @param options Overrides for the model's default options
     */
    get(name: string, options: Object = {})
    {
        return this.models.get(name).copyGraph(options);
    }

    constructor()
    {
        this.models = new Table<JSONModel>([]);
    }
}

/**
 * Instantiates a Zdog class given a key and option bag
 * @param key Name of Zdog class to instantiate
 * @param params Option bag of params for Zdog class
 */
function anchor_from_key(key: string, params: Object)
{
    let anchor = new Zdog[key](params);
    anchor.rotate.x *= Zdog.TAU / 360;
    anchor.rotate.y *= Zdog.TAU / 360;
    anchor.rotate.z *= Zdog.TAU / 360;
    return anchor;
}

/**
 * Recursively converts a parsed JSONModel into properly instantiated Zdog classes
 * @param obj Parsed JSONModel
 * @param root_key Fallback classname to use for the root element of the model, if none is provided
 */
function json_to_zdog(obj: JSONModel, root_key: string = "Group")
{
    let children: JSONModel[] = [];
    let params: ZdogParams = {};

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