import { v4 } from "uuid";
import { TodoItem } from "./types";

const LS_KEY = "TodoDB.localStorage";
const DEFAULT_VALUE = [
    {
        id: 'guid1',
        text: 'Your first item',
        isComplete: false,
    },
    {
        id: 'guid2',
        text: 'Your second item',
        isComplete: false,
    },
];

class TodoDB {

    constructor() {
        let json = window.localStorage.getItem(LS_KEY);
        if (!json){
            json = JSON.stringify(DEFAULT_VALUE);
            window.localStorage.setItem(LS_KEY, json);
        }

        this.items = JSON.parse(json);
    }

    private writeToDisk() {
        const json = JSON.stringify(this.items);
        window.localStorage.setItem(LS_KEY, json);
    }

    private readFromDisk() {
        const json = window.localStorage.getItem(LS_KEY);
        this.items = JSON.parse(json as string);
    }

    items: TodoItem[];

    getItems = async() => {
        const promise = new Promise<TodoItem[]>((resolve, reject) => {
            window.setTimeout(() => {
                this.readFromDisk();
                resolve(this.items);
            }, 500);
        })

        return promise;
    }

    updateItem = async(item: TodoItem) => {
        const promise = new Promise<void>((resolve, reject) => {
            window.setTimeout(() => {
                this.readFromDisk();
                const index = this.items.findIndex(i => i.id === item.id)
                if (index === -1) {
                    reject(`No such item with id '${item.id}' found.`)
                } 
                this.items[index] = item;
                this.writeToDisk();
                resolve();
            })
        });

        return promise;

    }

    addItem = async(item: TodoItem) => {
        const promise = new Promise<void>((resolve, reject) => {
            window.setTimeout(() => {
                this.readFromDisk();
                if (!item.id) {
                    item.id = v4();
                }
                this.items = [...this.items, item];
                this.writeToDisk();
                resolve();
            }, 250)
        });

        return promise;
    }

    deleteItem = async(item: TodoItem) => {
        const promise = new Promise<void>((resolve) => {
            window.setTimeout(() => {
                this.readFromDisk();
                const index = this.items.findIndex(i=> i.id === item.id);
                this.items.splice(index, 1);
                this.writeToDisk();
                resolve();
            }, 250)
        });
        return promise;
    }
}

const DB = new TodoDB();

export { DB as FakeDB };