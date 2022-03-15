# TODO

- [X] remove redundancy of bookmark items
    - update instead of add when same title & same url
- [X] enrich metadata to bookmark with indexedDB
    - [X] load existing comment when popup
- [X] add theme change
- [X] enable notification on done successfully
- [X] add override page to allow users to search and access enriched bookmarks
    - `bookmarks` and `newTab` can be overridden, we choose `bookmarks` as the target. ❎
    - [X] enable search bookmarks by keywords in comment
    - [X] iterate on cursor of indexedDB may have potential bug, dive into it later on
        - checked,  no such potential bug ✅
            - refer to : <https://stackoverflow.com/questions/68331241/how-does-the-cursor-inside-if-statment-can-loop-using-idbcursor-continue-in-ja>
- [X] add flip link to options/settings view on click the kBookmarks header instead of option page standalone
- [X] we may introduce router-based layout instead of the current list-based in one view.
  ![](images/64061647225093_.pic.jpg)
- [X] [package](https://developer.chrome.com/docs/extensions/mv3/linux_hosting/#packaging) and [submit to play store](https://developer.chrome.com/docs/webstore/publish/)
    - > Extensions and themes are served as .crx files. When uploading through the Chrome Developer Dashboard, the dashboard creates the crx file automatically. If published on a personal server, the crx file will need to be created locally or downloaded from the Chrome Web Store.
- [X] replace raw IndexedDB with [jsStore](https://jsstore.net/)
    - since currently the search and open/close issues are still buggy with raw IndexedDB
    - No need anymore, we have fix bug on search with IndexedDB.
