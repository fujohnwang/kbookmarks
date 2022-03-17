<script>
    import {onMount} from "svelte";
    import LeafFolderIcon from './tree/LeafFolderIcon.svelte';
    import {push, pop, replace} from 'svelte-spa-router';
    import {showSaveFolder, saveFolder, getBookmarkIdByTitle} from "./repo";

    let title = "";
    let url = "";
    let comment = "";

    function updateViewAtPopup() {
        // TODO load default folder or latest folder???
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            let tab = tabs[0];
            title = tab.title;
            url = tab.url;
            chrome.runtime.sendMessage({
                typ: "load",
                title: title,
                url: url
            }).then(response => {
                console.log("receives load response: %o", response)
                comment = response.comment;
            })
        });
    }


    function save() {
        // save bookmark and then
        getBookmarkIdByTitle($saveFolder, function (id) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                let tab = tabs[0];
                let payload = {
                    typ: "save",
                    parentFolderId: id,
                    title: title,
                    comment: comment,
                    url: tab.url
                }
                console.log(`send save request with payload: %o`, payload)
                chrome.runtime.sendMessage(payload).then((v) => {
                    console.log("receives response when saved: %o", v)
                    window.close();
                });
            })
        })
    }

    onMount(async () => {
        updateViewAtPopup();
    })

</script>

<div class="flex flex-wrap -m-2">
    <div class="p-2 w-full">
        <div class="form-control w-full">
            <label class="label" for="title">
                <span class="label-text">Title</span>
            </label>
            <input id="title" type="text" placeholder="Type here" class="input input-bordered input-sm w-full"
                   bind:value={title}/>
        </div>
    </div>

    <div class="p-2 w-full">
        <div class="form-control w-full">
            <label class="label" for="comment">
                <span class="label-text">Comment</span>
            </label>
            <!-- svelte-ignore a11y-autofocus -->
            <textarea id="comment"
                      placeholder="add keywords or anything seperated by space you would like to recall in your memory"
                      class="textarea textarea-bordered h-36 " bind:value={comment} autofocus/>
        </div>
    </div>

    <div class="p-2 w-full inline-flex items-baseline">
        <button class="btn btn-block" on:click={save}>Save</button>
    </div>

    {#if $showSaveFolder}
        <div class="p-2 w-full">
            <div class="form-control w-full">
                <label class="label" for="title">
                    <span class="label-text">Save To Folder</span>
                </label>
                <div class="inline-flex space-x-2">
                    <div class="form-control w-full">
                        <label class="input-group input-group-sm">
                            <span class="cursor-pointer" on:click={()=> push('/folders')}><LeafFolderIcon/></span>
                            <input id="saveFolderInput" type="text" placeholder="Type here"
                                   class="input input-bordered input-sm bg-transparent w-full"
                                   bind:value={$saveFolder} readonly/>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    {/if}

</div>