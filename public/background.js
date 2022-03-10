const kBookmarkFolderName = "kBookmarks"
const kBookmarkFolderIdSyncKey = "kBookmarks.folder.id"

chrome.runtime.onInstalled.addListener(e => {
    chrome.bookmarks.search({title: kBookmarkFolderName}, function (results) {
        if (results && Array.isArray(results) && results.length) {
            console.log(`bookmark folder: ${kBookmarkFolderName} exists, ignore to avoid recreating it.`)
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
})


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            let tab = tabs[0];
            let title = request.title;
            let comment = request.comment;
            console.log(`receives message: ${title}, ${tab.url}, message=${comment}`)

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
                    })
                    // 2. add comment and bookmark to indexedDB

                    // 3. request to close foreground page
                    sendResponse({farewell: "goodbye"});
                }

            });
        });
        return true;  // indicate for async process in background to continue
    }
);