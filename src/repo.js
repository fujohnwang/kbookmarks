import {writable} from "svelte/store";

export const searchKeyword = writable('');

export const showSaveFolder = writable(false);
export const saveFolder = writable('kBookmarks');
