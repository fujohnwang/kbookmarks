// ------------------------------------------------------------------
// since chrome.storage.sync's get and set is easy to get confused with the key
// we offer such utilities to ease the pain.
// ------------------------------------------------------------------

export function set(key, value) {
    chrome.storage.sync.set({[key]: value}, function () {
        console.log(`store value: ${value} with key:${key} successfully.`)
    })
}

// since it's async, so load is a proper func name to use.
export function load(key, callback) {
    chrome.storage.sync.get([key], function (result) {
        console.log(`get raw result: %o with key:${key}`, result)
        let value = result[key]
        console.log(`get value: ${value} with key:${key}`)
        if (value) {
            callback(value)
        }
    })
}

// just alias for load function.
export function get(key, callback) {
    load(key, callback)
}