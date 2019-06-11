
interface ITablePair<V>
{
    key: string | number;
    value: V;
}

function make_pair<V>(k: string | number, v: V): ITablePair<V>
{
    return { key: k, value: v };
}

class Table<V>
{
    m_data: { [key: string]: V };

    keys(): Array<string>
    {
        return Object.keys(this.m_data);
    }

    add(key: string | number, val: V) : void
    {
        this.m_data[key + ""] = val;
    }

    get(key: string | number) : V
    {
        return this.m_data[key + ""];
    }

    set(key: string | number, value: V) : void
    {
        this.m_data[key] = value;
    }

    constructor(pairs: Array<ITablePair<V>>)
    {
        this.m_data = {};

        for(var i = 0; i < pairs.length; ++i)
        {
            this.add(pairs[i].key, pairs[i].value);
        }
    }
}

export { Table, make_pair };