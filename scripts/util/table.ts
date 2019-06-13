/**
 * Key/Value pair to be stored in a table
 */
interface ITablePair<V>
{
    key: string | number;
    value: V;
}

/**
 * Semantically creates a Key/Value pair of specified type
 * @param k Key
 * @param v Value
 */
function make_pair<V>(k: string | number, v: V): ITablePair<V>
{
    return { key: k, value: v };
}

/**
 * A sort of dictionary that exclusively uses strings and numbers as keys, for easy mapping of enums and constants to values
 */
class Table<V>
{
    m_data: { [key: string]: V };

    /**
     * @returns Array of all keys in the dictionary
     */
    keys(): Array<string>
    {
        return Object.keys(this.m_data);
    }

    /** Gets the value stored at the given key location. */
    get(key: string | number) : V
    {
        return this.m_data[key + ""];
    }

    /** Sets the given key to the given value */
    set(key: string | number, value: V) : void
    {
        this.m_data[key] = value;
    }

    constructor(pairs?: Array<ITablePair<V>>)
    {
        this.m_data = {};

        if(pairs)
        {
            for(var i = 0; i < pairs.length; ++i)
            {
                this.set(pairs[i].key, pairs[i].value);
            }
        }
    }
}

export { Table, make_pair };