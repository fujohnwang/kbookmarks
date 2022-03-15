<script>

    import {onMount} from "svelte";

    export let so = "";

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
                console.log("bookmarks value: " + searchResult)
                if (searchResult && Array.isArray(searchResult) && searchResult.length) {
                    bookmarks = [...searchResult];
                }
            });
        } else {
            bookmarks = []
        }
    }

    function openInTab(url) {
        console.log(`open ${url} in tab...`)
        chrome.tabs.create({url: url})
    }

    onMount(async () => {
        search(so);
    })

</script>

<div class="overflow-x-auto">
    {#if bookmarks && bookmarks.length}
        {#each bookmarks as bk}
            <div class="card w-96 bg-base-100 shadow-xl">
                <div class="card-body cursor-pointer" on:click={openInTab(bk.url)}>
                    <h2 class="card-title">{bk.title}</h2>
                    <p>{bk.comment}</p>
                </div>
            </div>
        {/each}
    {/if}
</div>

