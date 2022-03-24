<script>
    import {onMount} from 'svelte';
    import {themeChange} from 'theme-change'
    import _ from 'lodash';
    import Router from 'svelte-spa-router';
    import {link} from 'svelte-spa-router';
    import {push, pop, replace} from 'svelte-spa-router';
    import Default from './SaveBookmark.svelte';
    import Settings from './Settings.svelte';
    import ResultList from "./ResultList.svelte";
    import FolderSelection from "./FolderSelection.svelte";

    import {searchKeyword, showSaveFolderStorageKey, saveFolderStorageKey, showSaveFolder, saveFolder} from './repo.js';

    const routes = {
        '/': Default,
        '/settings': Settings,
        '/results': ResultList,
        '/folders': FolderSelection,
        '*': Default
    }

    function search(keyword) {
        if (keyword) {
            $searchKeyword = keyword;
            push('/results')
        } else {
            push('/')
        }
    }

    const handleInput = _.debounce(e => {
        search(e.target.value);
    }, 300)

    const onEnter = e => {
        if (e.charCode === 13) {
            console.log("search entered with value=" + e.target.value);
            search(e.target.value);
        }
    }

    function goSettings() {
        push("/settings");
    }

    onMount(async () => {
        themeChange(false)

        // load settings
        chrome.storage.sync.get([showSaveFolderStorageKey], function (result) {
            console.log(`showSaveFolderStorageKey: %o`, result)
            let value = result[showSaveFolderStorageKey]
            if (value) {
                console.log(`load and set showSaveFolder store value: ${value} `)
                $showSaveFolder = value;
            }
        })

        chrome.storage.sync.get([saveFolderStorageKey], function (result) {
            console.log(`saveFolderStorageKey: %o`, result)
            let value = result[saveFolderStorageKey]
            if (value) {
                console.log(`load and set saveFolder store value: ${value} `)
                $saveFolder = value;
            }
        })


    })

</script>

<section class="text-gray-600 body-font relative">
    <div class="container px-5 py-5 mx-auto">
        <div class="navbar bg-base-100 w-full">
            <div class="flex-1">
                <h1 class="text-3xl font-extrabold text-primary"><a href="/" use:link>kBookmarks</a></h1>
            </div>
            <div class="form-control w-full flex-auto ml-4 -mr-2">
                <input type="text" placeholder="Search..." class="input input-bordered"
                       on:keypress={onEnter}>
                <!--                on:input={handleInput}-->
            </div>
        </div>
        <div class="lg:w-1/2 md:w-2/3 mx-auto">
            <Router {routes}/>
        </div>


        <div class="flex justify-between items-center mt-3 space-x-2 w-auto">
            <div class="flex-none">
                <div class="flex items-center">
                    <a href="https://keevol.cn/">
                        <svg xmlns="http://www.w3.org/2000/svg"
                             width="30.000000pt" height="30.000000pt" viewBox="0 0 450.000000 414.000000"
                             preserveAspectRatio="xMidYMid meet">
                            <g transform="translate(0.000000,414.000000) scale(0.100000,-0.100000)"
                               fill="red" stroke="none">
                                <path d="M2050 3963 c-200 -25 -423 -92 -612 -181 -642 -304 -1065 -950 -1095
-1672 -14 -343 65 -679 235 -1000 88 -166 257 -381 395 -502 40 -35 74 -66 77
-69 12 -14 160 -118 219 -155 72 -44 304 -155 310 -148 6 6 -137 218 -207 305
-76 96 -130 142 -229 193 -46 24 -79 48 -81 59 -6 33 160 91 398 137 189 37
304 109 580 363 237 219 412 416 493 555 92 158 121 260 121 432 1 156 0 156
-171 319 l-126 120 95 44 c52 24 99 50 103 58 16 25 -148 163 -364 306 -314
207 -340 219 -510 233 -143 11 -270 -2 -333 -34 -73 -38 -162 -109 -269 -216
-129 -128 -166 -186 -184 -286 -22 -123 -19 -256 8 -335 52 -153 217 -370 321
-424 50 -25 72 -30 155 -33 115 -5 194 13 295 66 84 44 155 111 192 183 26 49
29 63 29 159 0 94 -3 111 -29 167 -15 34 -38 71 -50 82 -32 30 -223 101 -271
101 -44 0 -104 -25 -177 -71 -57 -37 -92 -36 -96 3 -3 21 7 39 42 76 132 141
352 156 582 39 213 -108 268 -287 159 -524 -55 -120 -189 -282 -283 -341 -93
-59 -137 -67 -352 -67 -177 0 -201 2 -260 23 -174 60 -337 253 -386 457 -20
84 -23 291 -5 410 31 204 83 305 240 468 225 234 485 357 753 357 110 0 201
-22 353 -86 177 -73 321 -155 581 -326 272 -180 382 -245 665 -394 249 -130
299 -161 379 -233 l55 -50 -68 -132 c-43 -81 -69 -143 -69 -163 0 -17 10 -63
22 -103 12 -39 20 -88 18 -109 -3 -38 -4 -39 -43 -42 -49 -4 -87 23 -155 106
-119 147 -140 160 -140 95 1 -53 26 -104 126 -254 141 -211 174 -331 119 -425
-14 -24 -45 -103 -69 -176 -24 -73 -63 -181 -85 -240 -23 -59 -52 -154 -66
-210 -21 -91 -75 -421 -75 -463 0 -32 180 106 320 245 190 189 293 332 398
557 126 268 182 521 182 822 0 644 -306 1224 -842 1598 -112 79 -357 199 -490
242 -207 65 -321 83 -568 86 -124 2 -241 1 -260 -2z"/>
                                <path d="M2996 961 c-36 -24 -80 -79 -154 -191 -31 -47 -111 -153 -177 -235
-142 -178 -197 -261 -235 -352 l-27 -68 35 -3 c74 -7 354 53 500 107 127 47
254 112 248 127 -17 43 -28 113 -51 302 -26 225 -39 298 -57 319 -15 19 -48
16 -82 -6z"/>
                            </g>
                        </svg>
                    </a>
                </div>
            </div>
            <div class="item">
                <div class="tooltip tooltip-right" data-tip="change theme">
                    <label for="theme-select">
                        <!--                        <span class="bg-transparent text-secondary">Change Theme</span>-->
                        <select id="theme-select" data-choose-theme class="select text-accent">
                            <option value="Business">DEFAULT</option>
                            <option value="dark">DARK</option>
                            <option value="dracula">Dracula</option>
                            <option value="luxury">LUXURY</option>
                            <option value="Coffee">COFFEE</option>
                        </select>
                    </label>
                </div>
            </div>
            <div class="item">
                <div class="flex justify-between items-center space-x-0.5">
                    <button class="btn btn-ghost gap-2 bg-transparent text-accent" on:click={goSettings}>
                        Settings
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>


</section>


<style lang="postcss" global>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>