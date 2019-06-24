/**
 * Semantically parses JSON and returns it as an instance of the given type
 * @param str 
 */
function parse_JSON_as<T extends Object>(str: string): T
{
    return JSON.parse(str) as T;
}

export { parse_JSON_as }