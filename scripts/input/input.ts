import { Table } from "../util/util.js";

class InputManager
{
    m_keys: Array<Number>;
    m_keystates: Table<boolean>;

    constructor(keys: Array<number> = [])
    {
        this.m_keys = keys;
        this.m_keystates = new Table(["SHIFT", "CTRL"], [ false, false ]);

        if(keys.length > 0)
        {
            for(let i = 0; i < keys.length; ++i)
            {
                this.m_keystates.set(keys[i], false);
            }
        }
    }
}

class InputManagerf
{
    set_keys(im: InputManager, keys: Array<number>)
    {
        im.m_keys = keys;
        for(var i = 0; i < keys.length; ++i)
        {
            im.m_keystates.set(keys[i], false);
        }
    }
}

export { InputManager, InputManagerf as InputManagerHelper };