<script>
    import {onMount} from 'svelte';
    import {themeChange} from 'theme-change'
    import {key} from "localforage";
    import _ from 'lodash';

    import ResultList from "./ResultList.svelte";

    let id = "";
    let title = "";
    let url = "";
    let comment = "";

    let searchResult = [];

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

    function search(keyword) {
        console.log(`searching with keyword: ${keyword}`)
        chrome.runtime.sendMessage({
            typ: "so",
            keyword: keyword
        }).then((v) => {
            console.log("receives response at search: %o", v)

            let bookmarks = v.bookmarks;
            console.log("bookmarks value: " + bookmarks)
            if (bookmarks && Array.isArray(bookmarks) && bookmarks.length) {
                // TODO swap <svelte:component>
                searchResult = [...bookmarks];
            }
        });
    }

    const handleInput = _.debounce(e => {
        search(e.target.value);
    }, 300)

    const onEnter = e => {
        if (e.charCode === 13) {
            search(e.target.value);
        }
    }

    onMount(async () => {
        themeChange(false)

        updateViewAtPopup()
    })

</script>

<section class="text-gray-600 body-font relative">
    <div class="container px-5 py-5 mx-auto">
        <div class="navbar bg-base-100">
            <div class="flex-1">
                <h1 class="text-3xl font-extrabold text-primary">kBookmarks</h1>
            </div>
            <div class="form-control">
                <input type="text" placeholder="Search" class="input input-bordered"
                       on:input={handleInput}
                       on:keypress={onEnter}>
            </div>
            <div class="flex-none">
                <label for="theme-select" class="font-bold input-group">
                    <!--                    <span>Choose Theme</span>-->
                    <select id="theme-select" data-choose-theme class="select">
                        <option value="Business">Default</option>
                        <option value="dark">Dark</option>
                        <option value="dracula">Dracula</option>
                        <option value="luxury">luxury</option>
                        <option value="Coffee">Coffee</option>
                    </select>
                </label>
            </div>
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
                <div class="p-2 w-full inline-flex items-baseline">
                    <button class="btn btn-block" on:click={save}>Save</button>
                </div>
            </div>
        </div>

        <ResultList bind:bookmarks={searchResult}/>
    </div>
</section>


<style lang="postcss" global>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>