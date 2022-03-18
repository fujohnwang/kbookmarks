<script>
    import Node from "./BookmarkNode.svelte";

    export let initialSelectedNodeTitle = '';
    export let nodes = [];
</script>

<ul class="m-1 p-1">
    {#each nodes as node}
        <Node bind:node={node} bind:initialSelectedNodeTitle/>
    {/each}
</ul>
