import { Table } from "../util/table.js";

class InputManager
{
    keys: Array<Number>;
    keystates: Table<boolean>;

    constructor(keys: Array<number> = [])
    {
        this.keys = keys;
        this.keystates = new Table([
            { key: "SHIFT", value: false }, 
            { key: "CTRL", value: false }
        ]);

        if(keys.length > 0)
        {
            for(let i = 0; i < keys.length; ++i)
            {
                this.keystates.set(keys[i], false);
            }
        }
    }
}

class InputManagerf
{
    set_keys(im: InputManager, keys: Array<number>)
    {
        im.keys = keys;
        for(var i = 0; i < keys.length; ++i)
        {
            im.keystates.set(keys[i], false);
        }
    }
}

export { InputManager, InputManagerf as InputManagerHelper };