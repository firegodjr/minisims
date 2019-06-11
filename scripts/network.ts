
const OBJECTS_PATH = "objects/";

/**
 * Returns a promise for a parsed JSON object, loaded from the provided path
 * @param path 
 */
function load_json(path: string): Promise<Object>
{
    let promise = make_request(OBJECTS_PATH + path).then((req: XMLHttpRequest) => 
    {
        return JSON.parse(req.responseText)
    });

    return promise;
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

export { load_json };