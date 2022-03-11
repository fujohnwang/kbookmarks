<script>
    import {onMount} from 'svelte';

    let id = "";
    let title = "";
    let url = "";
    let comment = "";

    function save() {
        // save bookmark and then
        chrome.runtime.sendMessage({
            typ: "save",
            title: title,
            comment: comment
        }).then((v) => {
            console.log("receives response when saved: %o", v)
            window.close();

            // chrome.notifications.create('kBookmarkNotification', {
            //     title: "Success",
            //     message: "bookmark added successfully.",
            //     iconUrl: "favicon.png",
            //     type: 'basic',
            //     priority: 2
            // }, function (id) {
            //
            // })
        });
    }


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

    onMount(async () => {
        updateViewAtPopup()
    })

</script>

<section class="text-gray-600 body-font relative">
    <div class="container px-5 py-5 mx-auto">
        <div class="flex flex-col text-center w-full">
            <h1 class="text-3xl font-extrabold text-primary">Save Bookmark</h1>
        </div>
        <div class="lg:w-1/2 md:w-2/3 mx-auto">
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
                <div class="p-2 w-full">
                    <button class="btn btn-block" on:click={save}>Save</button>
                </div>
            </div>
        </div>
    </div>
</section>


<style lang="postcss" global>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>