<script>
    let title = "";
    let comment = "";

    function save() {
        // save bookmark and then
        chrome.runtime.sendMessage({"title": title, "comment": comment}).then((v) => window.close());
    }

    function setTitle(e) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            let tab = tabs[0];
            title = tab.title;
        });
    }

</script>

<section class="text-gray-600 body-font relative">
    <div class="container px-5 py-5 mx-auto">
        <div class="flex flex-col text-center w-full">
            <h1 class="text-3xl font-extrabold text-accent">Save Bookmark</h1>
        </div>
        <div class="lg:w-1/2 md:w-2/3 mx-auto">
            <div class="flex flex-wrap -m-2">
                <div class="p-2 w-full">
                    <div class="form-control w-full">
                        <label class="label" for="title">
                            <span class="label-text">Title</span>
                        </label>
                        <input id="title" type="text" placeholder="Type here" class="input w-full" bind:value={title}
                               use:setTitle>
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
                <div class="mt-3 space-x-3 p-2">
                    <button class="btn w-24" on:click={save}>Save</button>
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