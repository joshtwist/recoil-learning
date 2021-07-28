import { atom, selector } from "recoil";
import { cacheDB, ItemAndState } from "./cache-db";


const forceUpdateState = atom({
    key: 'forceUpdateState',
    default: 0
});

const todoListState = selector({
    key: 'todoListState',
    get: ({ get }) => {
        get(forceUpdateState);
        return cacheDB.getItems();
    }
});

// const getItemForceUpdate = (id:string) => {
//     return atom({
//         key: `itemForceUpdate-${id}`,
//         default: 0
//     })
// }

// const getTodoListItemState = (id:string) => {
//     return selector({
//         key: `todoListItem-${id}`,
//         get: ({ get }) => {
//             get(getItemForceUpdate(id));
//             return cacheDB.getItems().find(i => i.item.id === id) as ItemAndState;
//         }
//     })
// }

const todoListFilterState = atom({
    key: "todoListFilterState",
    default: "Show All"
});

const filterTodoListState = selector({
    key: 'filteredTodoListState',
    get: ({ get }) => {
        const filter = get(todoListFilterState);
        const list = get(todoListState);

        switch (filter) {
            case 'Show Completed' :
                return list.filter(ias => ias.item.isComplete === true);
            case 'Show Uncompleted':
                return list.filter(ias => ias.item.isComplete === false);
            default:
                return list;
        }
    }
});

const otherListState = atom({
    key: 'otherListState',
    default: [] as string[],
});

export { todoListState, todoListFilterState, filterTodoListState, forceUpdateState, otherListState }

