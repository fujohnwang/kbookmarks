<script>
    import BookmarkFolderTree from "./tree/BookmarkFolderTree.svelte";
    import {onMount} from "svelte";

    let nodes = [];

    onMount(async () => {
        chrome.bookmarks.getTree(function (results) {
            console.log("populate tree with resuts: %o", results)
            nodes = [...results[0].children]
        });
    })

</script>


<div class="flex flex-wrap -m-2">
    <div class="p-2 w-full">
        <BookmarkFolderTree bind:nodes={nodes}/>
    </div>

    <div class="flex justify-between items-center p-2 mx-2 space-x-2 w-full">
        <div class="flex-none">
            <button class="btn btn-primary">New Folder</button>
        </div>
        <div class="grow">
            &nbsp;
        </div>
        <div class="flex-none">
            <div class="flex justify-end items-center space-x-2">
                <button class="btn btn-primary">Cancel</button>
                <button class="btn btn-primary">Choose</button>
            </div>
        </div>
    </div>

</div>



