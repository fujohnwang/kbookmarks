<script>
    export let bookmarks = [];
</script>

<ul>

    {#each bookmarks as bk}
        <li>
            {bk.title} - {bk.comment}
        </li>
    {:else}
        <!-- this block renders when photos.length === 0 -->
        <p>Nothing Found...</p>
    {/each}

</ul>

