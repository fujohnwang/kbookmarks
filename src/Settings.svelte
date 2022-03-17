<script>
    import {link} from 'svelte-spa-router';
    import {push, pop, replace} from 'svelte-spa-router';
    import LeafFolderIcon from "./tree/LeafFolderIcon.svelte";
    import {onMount} from 'svelte';

    import {showSaveFolder, saveFolder} from "./repo";

    $: disableDefaultSaveFolder = !$showSaveFolder;

    onMount(async () => {

    })

</script>


<div class="flex flex-wrap -m-2">
    <div class="text-sm breadcrumbs p-2 my-2">
        <ul>
            <li><a use:link href="/">kBookmarks</a></li>
            <li>Settings</li>
        </ul>
    </div>

    <div class="flex justify-between items-center p-2 space-x-2 w-full mb-6">
        <div class="flex-none">
            <button class="btn btn-sm btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"/>
                    <path d="M9 13h2v5a1 1 0 11-2 0v-5z"/>
                </svg>
                Sync
            </button>

        </div>
        <div class="flex-grow">

        </div>
        <div class="flex-none">
            <button class="btn btn-sm  btn-outline">Import</button>
            <button class="btn btn-sm  btn-outline">Export</button>
        </div>
    </div>


    <div class="p-2 w-full">
        <div class="form-control">
            <span class="label-text">Show Save Folder At Save Bookmark</span>
            <div id="swap" class="input-group">
                <label class="swap swap-rotate" for="showFolder">
                    <input id="showFolder" type="checkbox" bind:checked={$showSaveFolder}/>
                    <div class="swap-on inline-flex">
                        <span>ON</span>
                        <svg class="fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
                        </svg>

                    </div>
                    <div class="swap-off inline-flex">
                        <span>OFF</span>
                        <svg class="fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
                        </svg>
                    </div>
                </label>
            </div>
        </div>
    </div>
    <div class="p-2 w-full">
        <div class="form-control w-full">
            <span class="label-text">Default Save Folder</span>
            <label class="input-group input-group-sm">
                <span class="cursor-pointer" on:click={()=> push('/folders')}><LeafFolderIcon/></span>
                <input id="saveFolderInput" type="text"
                       class="input input-bordered bg-transparent w-full"
                       disabled={disableDefaultSaveFolder}
                       value={$saveFolder} readonly/>
            </label>
        </div>
    </div>

    <div class="flex justify-between items-center p-2 mx-2 space-x-2 w-full">
        <div class="flex-none">

        </div>
        <div class="grow">

        </div>
        <div class="flex-none">
            <button class="btn btn-sm" on:click={()=> pop()}>OK</button>
<!--            <button class="btn">Apply</button>-->
        </div>
    </div>
</div>