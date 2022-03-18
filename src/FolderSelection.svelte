<script>
    import BookmarkFolderTree from "./tree/BookmarkFolderTree.svelte";
    import {onMount} from "svelte";
    import {pop} from "svelte-spa-router";
    import {saveFolder, selectedLiElement, selectedLiElementText, selectedLiElementNode} from './repo.js';

    let nodes = [];
    let folderName = '';

    function updateSaveFolder() {
        if ($selectedLiElement) {
            if ($selectedLiElementText)
                $saveFolder = $selectedLiElementText;
        }
        pop()
    }

    function createNewBookmarkFolder() {
        if (!folderName) return;

        let createDetail = {
            title: folderName
        }
        if ($selectedLiElementNode) {
            createDetail = {
                parentId: $selectedLiElementNode.id,
                ...createDetail
            }
        }
        chrome.bookmarks.create(createDetail, function (resultNode) {
            console.log("new folder created: %o", resultNode);
            loadBookmarkNodes();
        })

    }

    function loadBookmarkNodes() {
        chrome.bookmarks.getTree(function (results) {
            console.log("populate tree with resuts: %o", results)
            nodes = [...results[0].children]
        });
    }

    onMount(async () => {
        loadBookmarkNodes()
    })

</script>


<div class="flex flex-wrap -m-2">
    <div class="p-2 w-full overflow-auto">
        <BookmarkFolderTree bind:nodes={nodes} bind:initialSelectedNodeTitle={folderName}/>
    </div>

    <div class="flex justify-between items-center p-2 mx-2 space-x-2 w-full">
        <div class="flex-none">
            <label for="my-modal" class="btn modal-button">New Folder</label>
            <!--            <button class="btn btn-primary" on:click={createNewBookmarkFolder}>New Folder</button>-->
        </div>
        <div class="grow">
            &nbsp;
        </div>
        <div class="flex-none">
            <div class="flex justify-end items-center space-x-2">
                <button class="btn btn-primary" on:click={()=> pop()}>Cancel</button>
                <button class="btn btn-primary" on:click={updateSaveFolder}>Choose</button>
            </div>
        </div>
    </div>

</div>

<!-- Add New Folder Popup-->

<input type="checkbox" id="my-modal" class="modal-toggle">
<label for="my-modal" class="modal cursor-pointer">
    <label class="modal-box relative" for="">
        <h3 class="font-bold text-lg">Add New Bookmark Folder</h3>
        <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" bind:value={folderName}>
        <div class="modal-action">
            <label for="my-modal" class="btn" on:click={createNewBookmarkFolder}>Add</label>
        </div>
    </label>
</label>


