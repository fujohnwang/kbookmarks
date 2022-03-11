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
            // TODO but we need to query for the folder id to get it used later

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
    const request = indexedDB.open(kBookmarkIndexedDBName, 1);
    request.onerror = (event) => {
        console.error(`Database error at open: ${event.target.errorCode}`);
    };
    request.onsuccess = (event) => {
        const db = event.target.result;
        console.log(`add bookmark into db: ${kBookmarkIndexedDBName} with store: ${kBookmarkIdbStoreName}...`)
        // let request = db.transaction([kBookmarkIndexedDBName], 'readwrite').objectStore([kBookmarkIdbStoreName]).add(bookmark);
        // request.onsuccess = function (event) {
        //     console.log('数据写入成功');
        // };
        // request.onerror = function (event) {
        //     console.log('数据写入失败');
        // }

        const txn = db.transaction(kBookmarkIdbStoreName, 'readwrite');
        const store = txn.objectStore(kBookmarkIdbStoreName);
        let query = store.add(bookmark);
        query.onsuccess = function (event) {
            console.log(event);
        };
        query.onerror = function (event) {
            console.log(event.target.errorCode);
        }
        txn.oncomplete = function () {
            db.close();
        };
    };
}

// function getContactById(db, id) {
//     const txn = db.transaction('Contacts', 'readonly');
//     const store = txn.objectStore('Contacts');
//
//     let query = store.get(id);
//
//     query.onsuccess = (event) => {
//         if (!event.target.result) {
//             console.log(`The contact with ${id} not found`);
//         } else {
//             console.table(event.target.result);
//         }
//     };
//
//     query.onerror = (event) => {
//         console.log(event.target.errorCode);
//     }
//
//     txn.oncomplete = function () {
//         db.close();
//     };
// };

function bookmarkExists(t, i, f) {
    chrome.bookmarks.search({
        title: t, url: i
    }, f);
}


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            let tab = tabs[0];
            let title = request.title;
            let comment = request.comment;
            console.log(`receives message: ${title}, ${tab.url}, message=${comment}`)

            bookmarkExists(title, tab.url, (items) => {
                if (itemExists(items)) {
                    console.log("TODO: we should update the bookmark")
                    let existingBookmark = items[0]
                    chrome.bookmarks.update(existingBookmark.id, {
                        title: title, url: tab.url
                    }, function (result) {
                        console.log(`update bookmark: ${existingBookmark.id} with title=${title} and url = ${tab.url}`)
                    });

                    // TODO update meta if necessary

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
                            })
                        }
                    });
                }
                sendResponse({message: "done!"});
            });
        });
        return true;  // indicate for async process in background to continue
    }
);