const kBookmarkFolderName = "kBookmarks"
const kBookmarkFolderIdSyncKey = "com.keevol.kbookmarks.folder.id"
const kBookmarkIndexedDBName = "kbookmarksIdb"
const kBookmarkIdbStoreName = "kbookmarksMetaStore"

function itemExists(results) {
    return results && Array.isArray(results) && results.length;
}

chrome.runtime.onInstalled.addListener(e => {
    chrome.bookmarks.search({title: kBookmarkFolderName}, function (results) {
        if (itemExists(results)) {
            console.log(`bookmark folder: ${kBookmarkFolderName} exists, ignore to avoid recreating it.`)
            let id = results[0].id;
            chrome.storage.sync.set({[kBookmarkFolderIdSyncKey]: id}, function () {
                if (chrome.runtime.lastError) {
                    console.log(`ERROR: chrome.runtime.error, fails to sync bookmark folder id to storage.`)
                } else {
                    console.log(`set ${id} as value of ${kBookmarkFolderIdSyncKey} to chrome.storage.sync`);
                }
            });
        } else {
            console.log(`create bookmark folder: ${kBookmarkFolderName} at extension installation.`)
            chrome.bookmarks.create(
                {'title': kBookmarkFolderName},
                function (newFolder) {
                    console.log(`create bookmark folder [${kBookmarkFolderName}] for kBookmark extension with id=${newFolder.id}`)

                    chrome.storage.sync.set({[kBookmarkFolderIdSyncKey]: newFolder.id}, function () {
                        if (chrome.runtime.lastError) {
                            console.log(`ERROR: chrome.runtime.error, fails to sync bookmark folder id to storage.`)
                        } else {
                            console.log(`set ${newFolder.id} as value of ${kBookmarkFolderIdSyncKey} to chrome.storage.sync`);
                        }
                    });
                }
            );
        }
    });

    console.log(`init indexedDB: ${kBookmarkIndexedDBName}  for kbookmark...`)  // <<<<<
    const request = indexedDB.open(kBookmarkIndexedDBName, 1);// <<<<<
    request.onerror = (event) => {
        console.error("Database error at open: %o", event.target);
    };
    request.onupgradeneeded = (event) => {
        let db = event.target.result;

        if (!db.objectStoreNames.contains(kBookmarkIdbStoreName)) {
            console.log(`create object store: ${kBookmarkIdbStoreName} with auto-increment id...`)
            let store = db.createObjectStore(kBookmarkIdbStoreName, {
                keyPath: 'id'
            });
            console.log("create 'title' index..")
            store.createIndex('titleIdx', 'title', {
                unique: false
            });
            console.log("create 'comment' index...")
            store.createIndex('commentIdx', 'comment', {
                unique: false
            });
        }
    };
})

function appendMeta(bookmark) {
    doWith(function (store) {
        let query = store.add(bookmark);
        query.onsuccess = function (event) {
            console.log(event);
        };
        query.onerror = function (event) {
            console.log(event.target.errorCode);
        }
    })
}

function updateMeta(bookmark) {
    doWith(function (store) {
        let query = store.put(bookmark);
        query.onsuccess = function (event) {
            console.log(event);
        };
        query.onerror = function (event) {
            console.log(event.target.errorCode);
        }
    })
}

function doWith(callback) {
    const request = indexedDB.open(kBookmarkIndexedDBName, 1);
    request.onerror = (event) => {
        console.error(`Database error at open: ${event.target.errorCode}`);
    };
    request.onsuccess = (event) => {
        const db = event.target.result;
        const txn = db.transaction(kBookmarkIdbStoreName, 'readwrite');
        const store = txn.objectStore(kBookmarkIdbStoreName);
        callback(store)
        txn.oncomplete = function () {
            db.close();
        };
    };
}


function bookmarkExists(t, i, f) {
    chrome.bookmarks.search({
        title: t, url: i
    }, f);
}


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        let title = request.title;
        let comment = request.comment;

        if (request.typ === "save") {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                let tab = tabs[0];
                console.log(`receives message: ${title}, ${tab.url}, message=${comment}`)

                bookmarkExists(title, tab.url, (items) => {
                    if (itemExists(items)) {
                        let existingBookmark = items[0]
                        console.log("update the bookmark: %o", existingBookmark)
                        chrome.bookmarks.update(existingBookmark.id, {
                            title: title, url: tab.url
                        }, function (result) {
                            console.log(`update bookmark: ${existingBookmark.id} with title=${title} and url = ${tab.url}`)
                        });

                        let wrapBookmark = {
                            ...existingBookmark,
                            comment: comment
                        }
                        console.log("update bookmark with enhanced comment: %o", wrapBookmark)
                        updateMeta(wrapBookmark)

                        chrome.notifications.create('kBookmarkNotification', {
                            title: "Success",
                            message: "bookmark updated successfully.",
                            iconUrl: "icon.jpg",
                            type: 'basic',
                            priority: 2
                        }, function (id) {
                            // callback if necessary
                        })

                    } else {
                        chrome.storage.sync.get([kBookmarkFolderIdSyncKey], function (result) {
                            if (chrome.runtime.lastError) {
                                console.log(`ERROR: fails to get folder id from storage.sync with result=${result}`)
                            } else {
                                const parentFolderId = result[kBookmarkFolderIdSyncKey];
                                console.log("1. create raw bookmark of chrome into folder with id=" + parentFolderId)
                                chrome.bookmarks.create({
                                    'parentId': parentFolderId,
                                    'title': title,
                                    'url': tab.url
                                }, function (result) {
                                    // 2. add comment and bookmark to indexedDB
                                    const enhancedBookmark = {
                                        ...result,
                                        comment: comment
                                    }
                                    console.log("add enhanced bookmark to indexed db: %o", enhancedBookmark)
                                    appendMeta(enhancedBookmark)

                                    chrome.notifications.create('kBookmarkNotification', {
                                        title: "Success",
                                        message: "bookmark added successfully.",
                                        iconUrl: "icon.jpg",
                                        type: 'basic',
                                        priority: 2
                                    }, function (id) {
                                        // callback if necessary
                                    })
                                })
                            }
                        });
                    }
                    sendResponse({message: "done!"});
                });
            });
            return true;
        }
        if (request.typ === "load") {
            bookmarkExists(title, comment, function (items) {
                if (itemExists(items)) {
                    let existingBookmark = items[0]
                    doWith(function (store) {
                        let query = store.get(existingBookmark.id)
                        query.onerror = (event) => {
                            console.log(event.target.errorCode);
                        }
                        query.onsuccess = (event) => {
                            if (!event.target.result) {
                                console.log(`The contact with ${existingBookmark.id} not found`);
                                sendResponse({
                                    comment: ""
                                })
                            } else {
                                console.log("send back load result: %o", event.target.result)

                                sendResponse({
                                    ...event.target.result
                                })
                            }
                        };
                    })
                } else {
                    sendResponse({
                        comment: ""
                    })
                }
            })
            return true;
        }

        if (request.typ === "so") {
            let keyword = request.keyword;
            console.log("start searching with keyword: " + keyword)
            doWith(function (store) {
                let titleSearchPromise = new Promise((resolve, reject) => {
                    let bookmarks = [];
                    store.index("titleIdx").openCursor(null, 'prev').onsuccess = function (e) {
                        let cursor = e.target.result;

                        if (cursor) {
                            if (cursor.value.title.includes(keyword)) {
                                console.log(`found keyword: ${keyword} in title index, add it to result list...`)
                                bookmarks.push( {
                                    id: cursor.value.id,
                                    title: cursor.value.title,
                                    url: cursor.value.url,
                                    comment: cursor.value.comment,
                                    ts: cursor.value.dateAdded
                                })
                            } else {
                                cursor.continue();
                            }
                        }
                        resolve(bookmarks)
                    }
                })
                let commentSearchPromise = new Promise((resolve, reject) => {
                    let bookmarks = [];
                    store.index("commentIdx").openCursor(null, 'prev').onsuccess = function (e) {
                        let cursor = e.target.result;
                        if (cursor) {
                            if (cursor.value.comment.includes(keyword)) {
                                console.log(`found keyword: ${keyword} in comment index, add it to result list...`)
                                bookmarks.push({
                                    id: cursor.value.id,
                                    title: cursor.value.title,
                                    url: cursor.value.url,
                                    comment: cursor.value.comment,
                                    ts: cursor.value.dateAdded
                                })
                            } else {
                                cursor.continue();
                            }
                        }
                        resolve(bookmarks)
                    }
                })

                Promise.all([titleSearchPromise, commentSearchPromise]).then(values => {
                    let bookmarks = values.flat();

                    console.log("search results: %o", bookmarks)
                    console.log("after toJson: " + JSON.stringify(bookmarks))
                    sendResponse({
                        bookmarks: bookmarks
                    })
                })
            })
            return true;
        }
        return true;  // indicate for async process in background to continue
    }
);