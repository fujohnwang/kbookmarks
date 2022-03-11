# Intro

chrome bookmark extension from keevol.com

![](public/icon.jpg)

## how it looks 

The original (v0.0.1)
![](images/63541646913106_.pic.jpg)


The v0.1.1 
![](images/63741647000861_.pic.jpg)


# quick start

1. clone this repo to local: `git clone git@github.com:fujohnwang/kbookmark.git`
2. open chrome extensions settings: `chrome://extensions` and swith on "Developer Mode" 
![](images/63621646919261_.pic.jpg)
3. open **`public`** folder by clicking "Load unpacked" button 
![](images/63631646919286_.pic.jpg)
4. You can enjoy this extension now.


# TODO

- [X] remove redundancy of bookmark items
    - update instead of add when same title & same url
- [X] enrich metadata to bookmark with indexedDB
  - [X] load existing comment when popup
- [X] add theme change
- [X] enable notification on done successfully
- [ ] add override page to allow users to search and access enriched bookmarks
  - `bookmarks` and `newTab` can be overridden, we choose `bookmarks` as the target.
  - [ ] enable search bookmarks by keywords in comment






# Ref

- https://www.javascripttutorial.net/web-apis/javascript-indexeddb/
- https://developers.google.com/web/ilt/pwa/working-with-indexeddb
- https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- https://dev.to/alexeagleson/how-to-use-indexeddb-to-store-data-for-your-web-application-in-the-browser-1o90
- https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- https://w3c.github.io/IndexedDB/
- https://dev.to/anobjectisa/local-database-and-chrome-extensions-indexeddb-36n