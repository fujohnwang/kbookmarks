# Intro

chrome bookmark extension from keevol.com

# TODO

- [X] remove redundancy of bookmark items
    - update instead of add when same title & same url
- [ ] enrich metadata to bookmark with indexedDB
- [ ] add override page to allow users to search and access enriched bookmarks

# code snippets

```js
chrome.notifications.create('kBookmarkNotification', {
    title: "Success",
    message: "bookmark added successfully.",
    iconUrl: "favicon.png",
    type: 'basic',
    priority: 2
}, function (id) {
    sendResponse({farewell: "goodbye"});
})


// chrome.bookmarks.onCreated.addListener(function (id, bookmark) {
//     console.log("bookmark created: %o", bookmark)
//     chrome.bookmarks.get(bookmark.id, function (results) {
//         if (itemExists(results)) {
//
//         }else{
//
//         }
//     });
// });
```







