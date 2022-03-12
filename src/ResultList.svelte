<script>
    export let bookmarks = [];

    function openInTab(url) {
        console.log(`open ${url} in tab...`)
        chrome.tabs.create({url: url})
    }

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

