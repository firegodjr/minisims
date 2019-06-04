

/* Allows creating a goal table more intuitively, rather than using hard code */
export function createTable(inputs, outputs)
{
    var table = {};
    for(var i = 0; i < inputs.length; ++i)
    {
        table[inputs[i]] = outputs[i];
    }

    return table;
}