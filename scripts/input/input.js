export function InputManager(keys = [])
{
    var self = this;
    self.m_keys = keys;
    self.m_keystates = {};
    
    self.m_keystates["SHIFT"] = false;
    self.m_keystates["CTRL"] = false;

    if(keys.length > 0)
    {
        for(var i = 0; i < keys.length; ++i)
        {
            m_keystates[keys[i]] = false;
        }
    }

    return self;
}

export function InputManagerf(im)
{
    var self = this;
    self.set_keys = function(keys)
    {
        im.m_keys = keys;
        for(var i = 0; i < keys.length; ++i)
        {
            im.m_keystates[keys[i]] = false;
        }
    }

    return self;
}