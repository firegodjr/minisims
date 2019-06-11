
function init_log()
{
    let console = document.getElementById("console") as HTMLTextAreaElement;
    console.value = "";
}

function log(str: string)
{
    var console = document.getElementById("console") as HTMLTextAreaElement;
    var date = new Date();

    // add a newline if anything is in the console already
    if(console.value != "")
    {
        console.value += "\n";
    }

    var hrs = (date.getHours()+"").padStart(2, "0");
    var mins = (date.getMinutes()+"").padStart(2, "0");
    var secs = (date.getSeconds()+"").padStart(2, "0");

    console.value += ("[" + hrs + ":" + mins + ":" + secs + "] " + str);
    console.scrollTop = console.scrollHeight;
}

export { log, init_log };