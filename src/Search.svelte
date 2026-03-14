<script>
    import {link} from 'svelte-spa-router';
    import {push} from 'svelte-spa-router';
    import {onMount} from 'svelte';
    import _ from 'lodash';
    import {searchKeyword} from './repo.js';

    let bookmarks = [];

    function search(keyword) {
        if (keyword && keyword.length) {
            console.log(`searching with keyword: ${keyword}`)
            chrome.runtime.sendMessage({
                typ: "so",
                keyword: keyword
            }).then((v) => {
                console.log("receives response at search: %o", v)
                let searchResult = v.bookmarks;
                if (searchResult && Array.isArray(searchResult) && searchResult.length) {
                    bookmarks = [...searchResult];
                } else {
                    bookmarks = [];
                }
            });
        } else {
            bookmarks = [];
        }
    }

    function openInTab(url) {
        chrome.tabs.create({url: url})
    }

    const handleInput = _.debounce(e => {
        $searchKeyword = e.target.value;
    }, 300)

    $: search($searchKeyword)

    let searchInput;
    onMount(() => {
        searchInput.focus();
    })
</script>

<div class="flex flex-col -m-2">
    <div class="sticky top-0 bg-base-100 z-10">
        <div class="text-sm breadcrumbs p-2 my-2">
            <ul>
                <li><a use:link href="/">kBookmarks</a></li>
                <li>Search</li>
            </ul>
        </div>

        <div class="p-2 w-full">
            <input bind:this={searchInput} type="text" placeholder="Search bookmarks..."
                   class="input input-bordered w-full"
                   value={$searchKeyword}
                   on:input={handleInput}>
        </div>
    </div>

    <div class="p-2 w-full space-y-1 overflow-y-auto">
        {#if bookmarks && bookmarks.length}
            {#each bookmarks as bk}
                <div class="card w-full bg-base-100">
                    <div class="card-body cursor-pointer p-3" on:click={openInTab(bk.url)}>
                        <h2 class="card-title text-sm">{bk.title}</h2>
                        <p class="text-xs opacity-70">{bk.comment}</p>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>
