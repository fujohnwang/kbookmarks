import {writable} from "svelte/store";

export const showSaveFolderStorageKey = 'show.save.folder'
export const saveFolderStorageKey = 'save.folder.name'

/**
 * A persistence store with primitive values only!
 */
export const persistStore = (key, initial) => {
    // since chrome.storage.sync is asynchronous essential, we have to set it value onMount externally.
    // refer to App.svelte's onMount() for more information.
    const {subscribe, set} = writable(initial)

    return {
        subscribe,
        set: value => {
            set(value)
            chrome.storage.sync.set({[key]: value}, function () {
                console.log(`store value: ${value} with key:${key} successfully.`)
            })
        }
    }
}

export const searchKeyword = writable('');

export const showSaveFolder = persistStore(showSaveFolderStorageKey, false)

export const saveFolder = persistStore(saveFolderStorageKey, 'kBookmarks');


export function itemExists(results) {
    return results && Array.isArray(results) && results.length;
}

export function getBookmarkIdByTitle(title, callback) {
    chrome.bookmarks.search({
        title: title
    }, function (result) {
        if (itemExists(result)) {
            callback(result[0].id)
        } else {
            callback('')
        }
    });
}
