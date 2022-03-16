<script>
    import {onMount} from "svelte";
    import {push, pop, replace} from 'svelte-spa-router';
    import {saveFolder} from "./repo";

    let title = "";
    let url = "";
    let comment = "";

    function updateViewAtPopup() {
        // TODO load default folder or latest folder
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
        chrome.runtime.sendMessage({
            typ: "save",
            title: title,
            comment: comment
        }).then((v) => {
            console.log("receives response when saved: %o", v)
            window.close();
        });
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

    <div class="p-2 w-full">
        <div class="form-control w-full">
            <label class="label" for="title">
                <span class="label-text">Save To Folder</span>
            </label>
            <div class="inline-flex space-x-2">
                <input id="saveFolderInput" type="text" placeholder="Type here" class="input input-bordered input-sm bg-transparent w-4/5"
                       bind:value={$saveFolder} readonly/>
                <button class="btn btn-sm btn-ghost w-1/5 bg-transparent text-accent"
                        on:click={()=> push('/folders')}>
                    More
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                    </svg>
                </button>
            </div>

        </div>
    </div>

    <div class="p-2 w-full inline-flex items-baseline">
        <button class="btn btn-block" on:click={save}>Save</button>
    </div>
</div>