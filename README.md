# Intro

chrome bookmark extension from keevol.com

# quick start

1. clone this repo to local;
2. open chrome extensions settings: `chrome://extensions` and swith on "Developer Mode" 
![](images/63621646919261_.pic.jpg)
3. open `public` folder by clicking "Load unpacked" button 
![](images/63631646919286_.pic.jpg)
4. You can enjoy this extension now.


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







