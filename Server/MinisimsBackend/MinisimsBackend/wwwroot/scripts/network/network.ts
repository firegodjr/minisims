import { parseJsonAs } from "../util/jsonutil.js";
import { GameState, GameStateDTO } from "../game/game.js";
import { BoardManager, resetBoard } from "../render/render.js";
import { TileUpdateDTO } from 'dto.js';

const OBJECTS_PATH = "objects/";
const API_PATH = "/api/values";
const SERVER_URL = "";

interface Manifest
{
    paths: string[];
}

export enum DTOTypes
{
    GAMESTATE
}

export enum PostActions
{
    SAVE_FILE,
    SEND_TO_CLIENTS
}

interface GenericDTO
{
    id: string,
    type: DTOTypes,
    action: PostActions,
    options: string[],
    data: string
}

/**
 * Returns a promise for a parsed JSON object, loaded from the provided path
 * @param path 
 */
function loadJson<T>(path: string): Promise<T>
{
    let promise = makeRequest(OBJECTS_PATH + path).then((req: XMLHttpRequest) => 
    {
        return parseJsonAs<T>(req.responseText);
    });

    return promise;
}

/**
 * Returns a promise for a string, loaded from the provided path
 * @param path 
 */
function loadText(path: string): Promise<string>
{
    let promise = makeRequest(OBJECTS_PATH + path).then((req: XMLHttpRequest) => 
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
async function loadFromManifest<T>(path: string, callback?: ThenFunction<T>, names?: string[])
{
    let man = await loadJson<Manifest>(path + "manifest.json");
    
    let obj_arr: Promise<T>[] = [];
    for(let i = 0; i < man.paths.length; ++i)
    {
        if((names && names.includes(man.paths[i])) || !names)
        {
            obj_arr.push(loadJson(path + man.paths[i]).then(callback? callback : (v: T) => { return v }));
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
function makeRequest(url: string, method?: string, data?: string, contentType?: string): Promise<XMLHttpRequest>
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

let clientStateID = -1;
function requestID(): Promise<XMLHttpRequest>
{
    return makeRequest("/api/gamesync/id", "GET");
}

function requestState(): Promise<XMLHttpRequest>
{
    return makeRequest("/api/gamesync/state", "GET");
}

function requestUpdates(id: number): Promise<XMLHttpRequest>
{
    return makeRequest(`api/gamesync/updates/${id}/`, "GET");
}

function requestUpdate(game: GameState)
{
    requestID().then((req) => {
        let serverStateID = parseInt(req.responseText);
        if(serverStateID > clientStateID)
        {
            requestUpdates(clientStateID).then((req) => {
                if(req.responseText && req.responseText != "")
                {
                    clientStateID = serverStateID;
                    let updates = parseJsonAs<TileUpdateDTO[]>(req.responseText);
                    for(let i = 0; i < updates.length; ++i)
                    {
                        game.updateTile(updates[i].x, updates[i].y, updates[i].type);
                    }
                }
            });
        }
    });
}

function requestFullState(game: GameState) : Promise<void[]>
{
    let promises: Array<Promise<void>> = [];
    promises.push(requestID().then((req) => {
        clientStateID = parseInt(req.responseText);
    }));
    promises.push(requestState().then((req) => {
        if(req.responseText && req.responseText != "")
        {
            let state = parseJsonAs<GameStateDTO>(req.responseText);
            game.deserialize(state);
        }
    }));

    return Promise.all(promises);
}

function startRepeatUpdateRequests(game: GameState)
{
    setInterval(() => {
        requestUpdate(game);
    }, 2000);
}

/**
 * Posts the given string data to the server
 * @param data data to send
 * @param id id to use
 * @param type the type of data being sent
 * @param action action to perform on post
 * @param options post action options
 */
function postToServer(data: string, id: string, type: DTOTypes, action: PostActions = PostActions.SAVE_FILE, options?: string[], contentType?: string): void
{
    let dtf: GenericDTO = 
    {
        id: id,
        type: type,
        action: action,
        options: options,
        data: data
    }

    makeRequest(SERVER_URL + API_PATH, "POST", JSON.stringify(dtf), contentType);
}

export { Manifest, loadJson, loadText, makeRequest, requestID, postToServer, requestFullState, requestUpdate, startRepeatUpdateRequests };