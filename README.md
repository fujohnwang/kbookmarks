![](public/icon.jpg)

# Intro to kBookmarks

[![MadeWithSvelte.com shield](https://madewithsvelte.com/storage/repo-shields/3902-shield.svg)](https://madewithsvelte.com/p/kbookmarks/shield-link)


**mark and recall bookmarks at will**

kBookmarks is a Chrome bookmark extension from [KEEVOL](https://keevol.com)

The critical philosophy of this extension is "**For long-tail less-used bookmarks, we can tag them and comment them at save and recall them later on by searching with tags or comment we have left before**".

For bookmarks we use in daily, Folder-based management is OK, so kBookmarks still keep the original bookmark manager functionalities untouched.

书签的管理可以采用`固定目录+长尾标注`的组合方式:

- 经常用的，放到固定目录以及Bookmarks Bar上，
- 不常用的，就不分结构扁平化一股脑放到一个位置， 但追加标注或者标签。

需要的时候，根据自身对标注或者标签的印象去搜索就可以直达了，这就是要打造kBookmarks这个chrome extension的初衷。


## How it looks

![](images/v1.1.0.png)

if you are interested in [the evolution path](docs/evolution_path.md)

# How to install

go to [Chrome web store](https://chrome.google.com/webstore/detail/kbookmarks/kbbmclcpemnmajbpdachdbogddcigglp) and [Add to Chrome].

# How to install manually 

If you would love to: 

<https://github.com/fujohnwang/kbookmark/wiki#how-to-install>

# How to build by yourself?

1. clone this repo to local: `git clone git@github.com:fujohnwang/kbookmark.git`
2. run `npm run build` and then everything is ready in `public` folder.
3. open chrome extensions settings: `chrome://extensions` and swith on "Developer Mode"
   ![](images/63621646919261_.pic.jpg)
4. open **`public`** folder by clicking "Load unpacked" button
   ![](images/63631646919286_.pic.jpg)
5. You can enjoy this extension now.


# Buy Me A Coffee

<https://ko-fi.com/fubao>

# LICENSE

MIT


# Ref

- https://www.javascripttutorial.net/web-apis/javascript-indexeddb/
- https://developers.google.com/web/ilt/pwa/working-with-indexeddb
- https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- https://dev.to/alexeagleson/how-to-use-indexeddb-to-store-data-for-your-web-application-in-the-browser-1o90
- https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- https://w3c.github.io/IndexedDB/
- https://dev.to/anobjectisa/local-database-and-chrome-extensions-indexeddb-36n

