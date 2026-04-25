<script>
    import {link} from 'svelte-spa-router';
    import {push, pop, replace} from 'svelte-spa-router';
    import LeafFolderIcon from "./tree/LeafFolderIcon.svelte";
    import {onMount, onDestroy} from 'svelte';

    import {showSaveFolder, saveFolder, refreshBookmarkCount} from "./repo";

    $: disableDefaultSaveFolder = !$showSaveFolder;

    let loading = false;
    let showSuccess = false;

    let syncEnabled = false;
    let syncEndpoint = '';
    let syncToken = '';
    let syncSaving = false;
    let syncTesting = false;
    let syncTestResult = ''; // 'ok' | 'fail' | ''
    let syncResyncing = false;
    let syncNowRunning = false;
    let syncStatusText = '';
    let statusPollTimer;

    function pollSyncStatus() {
        chrome.runtime.sendMessage({typ: 'sync-status'}).then(r => {
            syncStatusText = statusDisplayText(r.status);
            if (r.status && !r.status.startsWith('push_incomplete:')) {
                statusPollTimer = setTimeout(pollSyncStatus, 300);
            } else {
                syncNowRunning = false;
                syncResyncing = false;
            }
        }).catch(() => {});
    }

    function statusDisplayText(status) {
        if (!status) return '';
        if (status === 'pulling') return 'Pulling bookmarks from server';
        if (status.startsWith('push_incomplete:')) {
            let parts = status.split(':')[1].split('/');
            return 'Push incomplete (' + parts[0] + '/' + parts[1] + ') - click Full Resync to retry';
        }
        if (status.startsWith('pushing:')) {
            let parts = status.split(':')[1].split('/');
            return 'Pushing bookmarks to server (' + parts[0] + '/' + parts[1] + ')';
        }
        return '';
    }

    function flashSuccess() {
        showSuccess = true;
        setTimeout(() => showSuccess = false, 2000);
    }

    function loadSyncConfig() {
        chrome.storage.local.get(['sync.enabled', 'sync.endpoint', 'sync.token'], function (result) {
            syncEnabled = result['sync.enabled'] || false;
            syncEndpoint = result['sync.endpoint'] || '';
            syncToken = result['sync.token'] || '';
        });
    }

    function saveSyncConfig() {
        syncSaving = true;
        chrome.storage.local.set({
            'sync.enabled': syncEnabled,
            'sync.endpoint': syncEndpoint,
            'sync.token': syncToken
        }, function () {
            console.log('sync config saved');
            // 通知 background 开启/关闭同步
            chrome.runtime.sendMessage({
                typ: 'sync-config',
                enabled: syncEnabled,
                endpoint: syncEndpoint,
                token: syncToken
            }).then(() => {
                syncSaving = false;
                flashSuccess();
                if (syncEnabled) {
                    syncResyncing = true;
                    pollSyncStatus();
                }
            }).catch(() => {
                syncSaving = false;
            });
        });
    }

    async function testSyncConnection() {
        if (!syncEndpoint || !syncToken) return;
        syncTesting = true;
        syncTestResult = '';
        try {
            let url = syncEndpoint.replace(/\/$/, '') + '/ping';
            let resp = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({token: syncToken})
            });
            syncTestResult = resp.ok ? 'ok' : 'fail';
        } catch (e) {
            console.error('sync test failed:', e);
            syncTestResult = 'fail';
        }
        syncTesting = false;
        setTimeout(() => syncTestResult = '', 3000);
    }

    async function resyncFull() {
        syncResyncing = true;
        try {
            await chrome.runtime.sendMessage({
                typ: 'sync-force-push',
            });
            pollSyncStatus();
        } catch (e) {
            console.error('resync failed:', e);
            syncResyncing = false;
        }
    }

    async function syncNow() {
        syncNowRunning = true;
        try {
            await chrome.runtime.sendMessage({
                typ: 'sync-now',
            });
            pollSyncStatus();
        } catch (e) {
            console.error('sync now failed:', e);
            syncNowRunning = false;
        }
    }

    function onSyncToggle() {
        if (!syncEnabled) {
            // 关闭同步时直接保存
            saveSyncConfig();
        }
    }

    async function importBookmarks() {
        const [fileHandle] = await window.showOpenFilePicker({
            types: [
                {
                    description: 'kBookmark Persistent Files',
                    accept: {
                        'application/json': ['.json'],
                    },
                },
            ]
        });
        const file = await fileHandle.getFile();
        const contents = await file.text();
        const bookmarks = JSON.parse(contents);
        if (!Array.isArray(bookmarks) || bookmarks.length === 0) {
            chrome.notifications.create('kBookmarkNotification', {
                title: "FAILED!",
                message: "Invalid or empty bookmark file.",
                iconUrl: "icon.jpg",
                type: 'basic',
                priority: 2
            });
            return;
        }
        loading = true;
        chrome.runtime.sendMessage({
            typ: "import",
            bookmarks: bookmarks
        }).then(response => {
            loading = false;
            console.log("import response: %o", response);
            if (response.status === 'OK') {
                flashSuccess();
                refreshBookmarkCount();
                chrome.notifications.create('kBookmarkNotification', {
                    title: "Success",
                    message: `Import done: ${response.added} added, ${response.updated} updated.`,
                    iconUrl: "icon.jpg",
                    type: 'basic',
                    priority: 2
                });
            } else {
                chrome.notifications.create('kBookmarkNotification', {
                    title: "FAILED!",
                    message: "Something went wrong when importing bookmarks, retry or contact the developer.",
                    iconUrl: "icon.jpg",
                    type: 'basic',
                    priority: 2
                });
            }
        });
    }

    async function exportBookmarks() {
        const fileHandle = await window.showSaveFilePicker({
            suggestedName: `kbookmarks-${new Date().toISOString().slice(0, 10)}.json`,
            startIn: 'desktop',
            types: [
                {
                    description: 'kBookmark Persistent Files',
                    accept: {
                        'application/json': ['.json'],
                    },
                },
            ]
        });
        const writable = await fileHandle.createWritable();
        console.log("request all bookmarks from bg worker...")
        loading = true;
        chrome.runtime.sendMessage({
            typ: "export"
        }).then(response => {
            console.log("receives load response: %o", response)
            if (response.status === 'OK') {
                writable.write(JSON.stringify(response.value)).then(() => {
                    console.log('close writable handle when write is done.');
                    writable.close()
                    loading = false;
                    flashSuccess();
                    chrome.notifications.create('kBookmarkNotification', {
                        title: "Success",
                        message: "kBookmarks Export Successfully.",
                        iconUrl: "icon.jpg",
                        type: 'basic',
                        priority: 2
                    }, function (id) {
                        // callback if necessary
                    })
                })
            } else {
                loading = false;
                chrome.notifications.create('kBookmarkNotification', {
                    title: "FAILED!",
                    message: "something goes wrong when exporting bookmarks, retry or contact the developer.",
                    iconUrl: "icon.jpg",
                    type: 'basic',
                    priority: 2
                }, function (id) {
                    // callback if necessary
                })
            }
        })
    }

    onMount(async () => {
        loadSyncConfig();
        // 检测是否有中断的同步操作，仅展示状态，不自动重启
        try {
            let r = await chrome.runtime.sendMessage({typ: 'sync-status'});
            if (r.status) {
                if (r.status.startsWith('pushing:')) {
                    syncResyncing = true;
                    pollSyncStatus();
                } else if (r.status.startsWith('push_incomplete:')) {
                    syncStatusText = statusDisplayText(r.status);
                } else if (r.status === 'pulling') {
                    syncNowRunning = true;
                    pollSyncStatus();
                }
            }
        } catch (e) {}
    })

    onDestroy(() => {
        if (statusPollTimer) clearTimeout(statusPollTimer);
    })

</script>


<div class="flex flex-wrap -m-2">
    <div class="text-sm breadcrumbs p-2 my-2">
        <ul>
            <li><a use:link href="/">kBookmarks</a></li>
            <li>Settings</li>
        </ul>
    </div>

    <div class="flex items-center p-2 space-x-2 w-full mb-6" class:cursor-wait={loading}>
        <div class="flex-none flex items-center space-x-2">
            <button class="btn btn-sm btn-outline" disabled={loading}
                    on:click={importBookmarks}>Import
            </button>
            <button class="btn btn-sm btn-outline" disabled={loading}
                    on:click={exportBookmarks}>Export
            </button>
            {#if loading}
                <svg class="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
            {:else if showSuccess}
                <svg class="h-5 w-5 text-success" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 13l4 4L19 7" class="check-draw"/>
                </svg>
            {/if}
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

    <div class="divider p-2 w-full"></div>

    <div class="p-2 w-full">
        <div class="form-control">
            <label class="label cursor-pointer justify-start space-x-2">
                <span class="label-text">Sync</span>
                <input type="checkbox" class="toggle toggle-sm" bind:checked={syncEnabled}
                       on:change={onSyncToggle}/>
            </label>
        </div>
        {#if syncEnabled}
            <div class="space-y-2 mt-2">
                <div class="form-control w-full">
                    <label class="label" for="syncEndpoint">
                        <span class="label-text text-xs">Server URL</span>
                    </label>
                    <input id="syncEndpoint" type="text" placeholder="https://your-server.com/api"
                           class="input input-bordered input-sm w-full"
                           bind:value={syncEndpoint}/>
                </div>
                <div class="form-control w-full">
                    <label class="label" for="syncToken">
                        <span class="label-text text-xs">Token</span>
                    </label>
                    <input id="syncToken" type="password" placeholder="your sync token"
                           class="input input-bordered input-sm w-full"
                           bind:value={syncToken}/>
                </div>
                <div class="flex justify-between items-center mt-2">
                    <div class="flex items-center space-x-2">
                        <button class="btn btn-sm btn-outline" disabled={syncSaving || !syncEndpoint || !syncToken}
                                on:click={saveSyncConfig}>
                            {#if syncSaving}Saving...{:else}Save{/if}
                        </button>
                        <button class="btn btn-sm btn-outline" disabled={syncTesting || !syncEndpoint || !syncToken}
                                on:click={testSyncConnection}>
                            {#if syncTesting}Testing...{:else}Test Connection{/if}
                        </button>
                        {#if syncTestResult === 'ok'}
                            <svg class="h-5 w-5 text-success" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5 13l4 4L19 7" class="check-draw"/>
                            </svg>
                        {:else if syncTestResult === 'fail'}
                            <svg class="h-5 w-5 text-error" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        {/if}
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="btn btn-sm btn-outline" disabled={syncResyncing}
                                on:click={resyncFull}>
                            {#if syncResyncing}Resyncing...{:else}Full Resync{/if}
                        </button>
                        <button class="btn btn-sm btn-outline" disabled={syncNowRunning}
                                on:click={syncNow}>
                            {#if syncNowRunning}Syncing...{:else}Sync Now{/if}
                        </button>
                    </div>
                </div>
                {#if syncStatusText}
                    <div class="text-xs text-info mt-1">
                        {syncStatusText}<span class="animate-dots">...</span>
                    </div>
                {/if}
            </div>
        {/if}
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

<style>
    .check-draw {
        stroke-dasharray: 24;
        stroke-dashoffset: 24;
        animation: draw 0.4s ease forwards;
    }
    @keyframes draw {
        to {
            stroke-dashoffset: 0;
        }
    }
    .animate-dots {
        display: inline-block;
        overflow: hidden;
        vertical-align: bottom;
        max-width: 0;
        animation: dot-cycle 1.5s steps(4, end) infinite;
    }
    @keyframes dot-cycle {
        0% { max-width: 0; }
        25% { max-width: 1ch; }
        50% { max-width: 2ch; }
        75% { max-width: 3ch; }
        100% { max-width: 0; }
    }
</style>
