<script>
    import {onMount} from 'svelte';

    function save() {
        // save bookmark and then
        chrome.runtime.sendMessage({}).then((v) => window.close());
    }

    // let titleF;
    //
    // onMount(()=> {
    //     titleF.value = document.title;
    // })

    function setTitle(e) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            let tab = tabs[0];
            e.value = tab.title;
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
                        <input id="title" type="text" placeholder="Type here" class="input border-accent w-full"
                               use:setTitle>
                    </div>
                </div>
                <div class="p-2 w-full">
                    <div class="form-control w-full">
                        <label class="label" for="comment">
                            <span class="label-text">Comment</span>
                        </label>
                        <textarea id="comment" placeholder="Type here" class="textarea h-36 border-accent"/>
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