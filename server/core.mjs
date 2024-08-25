
function _log(...args) {
    console.log(`[${args[0]}] [${new Date().toISOString()}]`,...args.slice(1, args.length))
}

export {
    _log
}