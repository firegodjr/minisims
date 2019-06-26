import { makeRequest } from "./network.js";
import { TileUpdateDTO } from 'dto.js';

const SYNC_PATH = "api/gamesync/";

export function pushUpdates(tileUpdateDTOArr: TileUpdateDTO[])
{
    let data = JSON.stringify(tileUpdateDTOArr);
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