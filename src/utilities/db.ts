import { resolve } from "path";

export function getFileDB(): Promise<IDBDatabase> {

	const request = indexedDB.open('filedb');
	let db: IDBDatabase;

	request.onupgradeneeded = function () {
		const db = request.result;
		const store = db.createObjectStore("files", { keyPath: 'file_name' });

		const titleIndex = store.createIndex('by_file_name', 'file_name', { unique: true });
	};

	return new Promise((resolve, reject) => {
		request.onsuccess = function () {
			db = request.result;
			resolve(db);
		};
		request.onblocked = function (ev) {
			reject('blocked');
		};
		request.onerror = function () {
			reject('error');
		};
	})
}

export async function populateOneFile(fileName: string, content: Blob) {
	const db = await getFileDB();
	const tx = db.transaction("files", 'readwrite');
	const store = tx.objectStore("files");

	store.put({ file_name: fileName, content: content });

	tx.oncomplete = function () {
		db.close()
	};
}

export async function findOneFile(name: string): Promise<Blob> {
	const db = await getFileDB();
	const tx = db.transaction("files", "readonly");
	const store = tx.objectStore("files");
	const index = store.index('by_file_name');
	const request = index.get(name);
	return new Promise((resolve, reject) => {
		request.onsuccess = function () {
			const matching = request.result;
			if (matching != undefined) {
				resolve(matching['content'])
			} else {
				reject('failed')
			}
		};
	})
}