import { makeRequest } from "./network.js";
import { TileUpdateDTF } from './dtf';

const SYNC_PATH = "api/gamesync/";

let latest_update_ID = -1;

export function push_updates(tileUpdateDTFArr: TileUpdateDTF[])
{
    let data = JSON.stringify(tileUpdateDTFArr);
    let req = makeRequest(SYNC_PATH, "POST", data, "application/json");
    // req.then((req) => 
    // { 
    //     let new_ID = parseInt(req.responseText);
    //     if(new_ID != -1)
    //     {
    //         latest_update_ID = new_ID;
    //     }
    // });
}