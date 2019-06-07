
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
        if(key >= 0 && key < this.keys().length)
        {
            return this.m_data[key + ""];
        }
        else return null;
    }

    set(key: string | number, value: V) : boolean
    {
        if(key >= 0 && key < this.keys().length)
        {
            this.m_data[key] = value;
            return true;
        }
        else return false;
    }

    constructor(inputs?: Array<string | number>, outputs?: Array<V>)
    {
        if(!inputs || !outputs) return;

        for(var i = 0; i < inputs.length; ++i)
        {
            this.add(inputs[i], outputs[i]);
        }
    }
}

export { Table };