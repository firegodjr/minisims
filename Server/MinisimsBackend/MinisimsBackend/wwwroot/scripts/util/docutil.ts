
/**
 * Gets an element by id and returns it as the given HTMLElement type
 * @param document 
 * @param str 
 */
function getElement<T extends HTMLElement>(document: Document, id: string): T
{
    return document.getElementById(id) as T;
}

export { getElement }