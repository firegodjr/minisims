
const OBJECTS_PATH = "objects/";

interface Manifest
{
    paths: string[];
}

/**
 * Returns a promise for a parsed JSON object, loaded from the provided path
 * @param path 
 */
function load_json(path: string): Promise<Object>
{
    let promise = make_request(OBJECTS_PATH + path).then((req: XMLHttpRequest) => 
    {
        return JSON.parse(req.responseText);
    });

    return promise;
}

/**
 * Returns a promise for a string, loaded from the provided path
 * @param path 
 */
function load_text(path: string): Promise<Object>
{
    let promise = make_request(OBJECTS_PATH + path).then((req: XMLHttpRequest) => 
    {
        return req.responseText;
    });

    return promise;
}    

async function load_from_manifest(path: string, callback: Function, names?: string[])
{
    let man = await load_json(path + "manifest.json") as Manifest;
    
    let obj_arr: Promise<Object>[] = [];
    for(let i = 0; i < man.paths.length; ++i)
    {
        if((names && names.includes(man.paths[i])) || !names)
        {
            obj_arr.push(load_json(path + man.paths[i]));
        }
    }

    return await Promise.all(obj_arr);
}

/**
 * Creates a promise for a successful XMLHttpRequest
 * Borrowed from https://gomakethings.com/promise-based-xhr/
 * @param url 
 * @param method 
 */
function make_request(url: string, method?: string): Promise<XMLHttpRequest>
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
        request.send();
    });
}

export { Manifest, load_json, load_text };