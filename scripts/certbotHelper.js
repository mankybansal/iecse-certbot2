function debuggable(status, callback) {
    if (myApp.debug) {
        console.log("--------- DEBUGGER ---------");
        console.log("STATUS: " + status);
        callback && callback();
        console.log("----------------------------");
    }
}