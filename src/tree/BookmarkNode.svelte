<script>
    import {slide} from 'svelte/transition';
    import LeafFolderIcon from './LeafFolderIcon.svelte';
    import {selectedLiElement, selectedLiElementText, selectedLiElementNode} from '../repo.js';
    import {onMount} from "svelte";

    export let initialSelectedNodeTitle;
    export let node;
    export let level = 0;

    let expanded = false;
    let subFolders = [];

    function toggle(e) {
        expanded = !expanded;
        if (expanded) {
            subFolders = [];
            chrome.bookmarks.getSubTree(node.id, function (results) {
                console.log(`subtree of ${node.title} is: %o`, results)
                results[0].children.forEach(n => {
                    if (n.children && !n.url) {
                        subFolders = [...subFolders, n]
                    }
                })
            })
        }
    }

    let liElement;
    let selectedBgCss = "bg-warning"

    function select() {
        if (liElement.classList.contains(selectedBgCss)) {
            liElement.classList.remove(selectedBgCss)
        } else {
            // 1. clear other elements' bg color simultaneously
            if ($selectedLiElement)
                $selectedLiElement.classList.remove(selectedBgCss)
            // 2. init new selected li element
            liElement.classList.add(selectedBgCss)
            $selectedLiElement = liElement;
            $selectedLiElementNode = node;
            $selectedLiElementText = node.title;
        }
    }

    onMount(async () => {
        if(node.title === initialSelectedNodeTitle){
            select()
        }
    })
</script>

<li on:dblclick={toggle} style="padding-left:{level*1}rem" class="cursor-pointer bg-transparent" transition:slide
    on:click={select} bind:this={liElement}>
    <div class="flex text-center justify-center">
        <LeafFolderIcon/>
        <span>{node.title}</span>
    </div>
</li>

{#if expanded && subFolders && subFolders.length}
    {#each subFolders as child}
        <svelte:self node={child} level={level+1}/>
    {/each}
{/if}


<style>
    li {
        border-bottom: solid 1px #eee;
        margin: 0 0;
        padding: 1rem;
        /*background: #fafafa;*/
        display: flex;
    }
</style>