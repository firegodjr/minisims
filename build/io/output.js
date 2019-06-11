function init_log() {
    var console = document.getElementById("console");
    console.value = "";
}
function log(str) {
    var console = document.getElementById("console");
    var date = new Date();
    // add a newline if anything is in the console already
    if (console.value != "") {
        console.value += "\n";
    }
    var hrs = (date.getHours() + "").padStart(2, "0");
    var mins = (date.getMinutes() + "").padStart(2, "0");
    var secs = (date.getSeconds() + "").padStart(2, "0");
    console.value += ("[" + hrs + ":" + mins + ":" + secs + "] " + str);
    console.scrollTop = console.scrollHeight;
}
export { log, init_log };
