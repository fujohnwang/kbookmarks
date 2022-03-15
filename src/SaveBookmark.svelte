<script>
    import {onMount} from "svelte";

    let title = "";
    let url = "";
    let comment = "";

    function updateViewAtPopup() {
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
            <input id="title" type="text" placeholder="Type here" class="input w-full" bind:value={title}/>
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
                      class="textarea h-36 " bind:value={comment} autofocus/>
        </div>
    </div>
    <div class="p-2 w-full inline-flex items-baseline">
        <button class="btn btn-block" on:click={save}>Save</button>
    </div>
</div>