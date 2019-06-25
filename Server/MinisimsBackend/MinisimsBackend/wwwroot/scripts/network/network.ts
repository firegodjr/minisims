import { parse_JSON_as } from "../util/jsonutil.js";

const OBJECTS_PATH = "objects/";
const API_PATH = "/api/values";
const SERVER_URL = "";

interface Manifest
{
    paths: string[];
}

export enum DTFTypes
{
    GAMESTATE
}

export enum PostActions
{
    SAVE_FILE,
    SEND_TO_CLIENTS
}

interface GenericDTF
{
    id: string,
    type: DTFTypes,
    action: PostActions,
    options: string[],
    data: string
}

/**
 * Returns a promise for a parsed JSON object, loaded from the provided path
 * @param path 
 */
function load_json<T>(path: string): Promise<T>
{
    let promise = make_request(OBJECTS_PATH + path).then((req: XMLHttpRequest) => 
    {
        return parse_JSON_as<T>(req.responseText);
    });

    return promise;
}

/**
 * Returns a promise for a string, loaded from the provided path
 * @param path 
 */
function load_text(path: string): Promise<string>
{
    let promise = make_request(OBJECTS_PATH + path).then((req: XMLHttpRequest) => 
    {
        return req.responseText;
    });

    return promise;
}

/**
 * A function usable in a promise.then() callback
 */
interface ThenFunction<T>
{
    (value: Object): T | PromiseLike<T>
}

/**
 * Generic function for loading files from a manifest
 * @param path Manifest path
 * @param callback Callback that runs on every object as it is loaded
 * @param names Whitelist of paths to use from the manifest. Paths not found in the manifest are ignored.
 * @returns Promise of an array containing either T or whatever the given callback returns
 */
async function load_from_manifest<T>(path: string, callback?: ThenFunction<T>, names?: string[])
{
    let man = await load_json<Manifest>(path + "manifest.json");
    
    let obj_arr: Promise<T>[] = [];
    for(let i = 0; i < man.paths.length; ++i)
    {
        if((names && names.includes(man.paths[i])) || !names)
        {
            obj_arr.push(load_json(path + man.paths[i]).then(callback? callback : (v: T) => { return v }));
        }
    }

    return await Promise.all(obj_arr);
}

/**
 * Creates a promise for a successful XMLHttpRequest
 * Borrowed from https://gomakethings.com/promise-based-xhr/
 * @param url 
 * @param method 
 * @param data data to send if method is "POST"
 */
function make_request(url: string, method?: string, data?: string, contentType?: string): Promise<XMLHttpRequest>
{
    let request = new XMLHttpRequest();
    return new Promise((resolve, reject) => 
    {
        request.onreadystatechange = () =>
        {
            //Don't do anything if the request isn't ready yet
            if(request.readyState !== 4) return;

            // If successful
            if(request.status >= 200 && request.status < 300)
            {
                // Return our request
                resolve(request);
            }
            else
            {
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
            }
        }
        request.open(method || "GET", url, true);

        if(data && !contentType)
        {
            contentType = "text/plain";
        }

        if(contentType)
        {
            request.setRequestHeader("Content-Type", contentType);
        }

        request.send(data);
    });
}

function request_update(): Promise<XMLHttpRequest>
{
    return make_request(API_PATH, "GET")
}

function request_from_server(): Promise<XMLHttpRequest>
{
    return make_request("/api/values", "GET");
}

/**
 * Posts the given string data to the server
 * @param data data to send
 * @param id id to use
 * @param type the type of data being sent
 * @param action action to perform on post
 * @param options post action options
 */
function post_to_server(data: string, id: string, type: DTFTypes, action: PostActions = PostActions.SAVE_FILE, options?: string[], contentType?: string): void
{
    let dtf: GenericDTF = 
    {
        id: id,
        type: type,
        action: action,
        options: options,
        data: data
    }

    make_request(SERVER_URL + API_PATH, "POST", JSON.stringify(dtf), contentType);
}

export { Manifest, load_json, load_text, make_request, request_from_server, post_to_server };