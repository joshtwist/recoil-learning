import { TodoItem } from "./types";
import { FakeDB } from "./fakeDB";
import { v4 } from "uuid";
import { removeItemAtIndex, replaceItemAtIndex } from "./utils";

export type ItemAndState = {
  item: TodoItem;
  state: FileState;
};

export type FileState = "new" | "modified" | "unmodified";

class CacheDBWrapper {
  private items: ItemAndState[] = [];

  getItems = () => {
    return this.items;
  };

  updateItem = (item: TodoItem) => {
    const index = this.items.findIndex((i) => i.item.id === item.id);

    if (index === -1) {
      console.error("not found", item, "in", this.items);
      throw new Error(`No item with id '${item.id}' found.`);
    }

    this.items = [...this.items];
    this.items[index] = {
      item: item,
      state: this.items[index].state === "new" ? "new" : "modified",
    };
  };

 
  deleteItem = (item: TodoItem) => {
    const index = this.items.findIndex(i => item.id === i.item.id);
    if (index === -1) {
      console.warn(`No item with id '${item.id}' was found to delete. Odd, but OK.`)
      return; // nothing to do, it's gone
    }
    this.items = removeItemAtIndex(this.items, index);
    // Delete item is instant!
    FakeDB.deleteItem(item);
  }

  addItem = (item: TodoItem) => {
    if (!item.id) {
      item.id = v4();
    }
    this.items = [
      ...this.items,
      {
        item: item,
        state: "new",
      },
    ];
  };

  refreshItems = async () => {
    const reloadedItems = await FakeDB.getItems();

    const mappedItems = reloadedItems.map((ni) => {
      const ias = this.items.find((i) => i.item.id === ni.id);
      if (!ias || ias.state === "unmodified") {
        // new file found on server
        return {
          item: ni,
          state: "unmodified" as FileState,
        };
      }
      return ias; // return the modified file that hasn't been saved yet
    });

    const localNewItems = this.items.filter((i) => i.state === "new" );

    // TODO 
    // we should also look for modified local items that are not present on the server. They may have 
    // been deleted on the server but modified locally. In this case it is safer to restore 
    // the file and save it as new - something like:
    // const localModifiedOnly = this.items.filter(i => i.state === "modified" && !mappedItems.find(m => m.item.id === i.item.id));
    // We need to turn these into 'new' files now

    this.items = [...mappedItems, ...localNewItems];
    return this.getItems();
  };

  saveAllUnsavedItems = async () => {
    const unsavedItems = this.items.filter((i) => i.state !== "unmodified");
    await this.internalSaveItems(unsavedItems);
  };

  private internalSaveItems = async (items: ItemAndState[]) => {
    const promises = items.map((ias) => {
      const saveFunctions = {
        "modified": () => {
          return FakeDB.updateItem(ias.item);
        },
        "new": () => {
          return FakeDB.addItem(ias.item);
        },
        "unmodified": () => {
          throw new Error('Was asked to save an unmodified item');
        }
      }

      return saveFunctions[ias.state]().then(() => {
          const index = this.items.findIndex((i) => i.item.id === ias.item.id);
          this.items = replaceItemAtIndex(this.items, index, {
            item: ias.item,
            state: "unmodified",
          });
        });

    });

    await Promise.all(promises);
  };

  saveItems = async (items: TodoItem[]) => {
    const withStates = items.map((item) => {
      const withState = this.items.find((ias) => ias.item.id === item.id);
      return withState as ItemAndState; // force it, should be no nulls
    });
    await this.internalSaveItems(withStates);
  };
}

const cacheDB = new CacheDBWrapper();

export { cacheDB };
