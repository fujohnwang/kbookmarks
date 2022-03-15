// import { Connection } from 'jsstore';
// import {writable} from "svelte/store";
//
// const getWorkerPath = () => {
//     if (process.env.NODE_ENV === 'development') {
//         return require("file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.js");
//     }
//     else {
//         return require("file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.min.js");
//     }
// };
//
// // This will ensure that we are using only one instance.
// // Otherwise due to multiple instance multiple worker will be created.
// const workerPath = getWorkerPath().default
// export const idb = new Connection(new Worker(workerPath));
// export const repo = writable(idb)
// export const dbName = 'kbookmarksIdb';
// export const tableName = "kbookmarksMetaStore";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
