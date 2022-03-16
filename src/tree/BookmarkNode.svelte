<script>
    import {slide} from 'svelte/transition';
    import ParentFolderIcon from './ParentFolderIcon.svelte';
    import LeafFolderIcon from './LeafFolderIcon.svelte';

    export let node;
    export let level = 0;

    let expanded = false;

    function toggle() {
        expanded = !expanded;
        if(expanded) {
            chrome.bookmarks.getSubTree(node.id, function (results){
                console.log(`subtree of ${node.title} is: %o`, results)
            })
        }
    }
</script>

<li on:click={toggle} style="padding-left:{level*1}rem" class="cursor-pointer" transition:slide>
    <div class="flex bg-gray-100 text-center justify-center">
            {#if node.children && node.children.length }
                <ParentFolderIcon/>
            {:else}
                <LeafFolderIcon/>
            {/if}
            <span>{node.title}</span>
    </div>
</li>

<!--{#if node.children && expanded}-->
<!--    {#each node.children as child}-->
<!--        <svelte:self node={child} level={level+1}/>-->
<!--    {/each}-->
<!--{/if}-->

<style>
    li {
        border-bottom: solid 1px #eee;
        margin: 0 0;
        padding: 1rem;
        background: #fafafa;
        display: flex;
    }
</style>