import { useEffect } from "react";
import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil";
import { cacheDB } from "../cache-db";
import { filterTodoListState, forceUpdateState } from "../store";

import NewTodoItem from "./NewTodoItem";
import TodoItemEditor from "./TodoItemEditor";
import TodoListFilters from "./TodoListFilters";

let foo = new Array<string>();

const updateState = atom({
  key: 'updateState',
  default: 0
});

const simpleListState = selector({
  key: 'test',
  get: ({ get} ) => {
    get(updateState);
    return foo;
  }
});

export default function TodoList() {
  const filterTodoList = useRecoilValue(filterTodoListState);
  const simpleList = useRecoilValue(simpleListState);
  const setForce = useSetRecoilState(forceUpdateState);

  useEffect(() => {
    console.log('useEffect');
  
    const intId = window.setInterval(() => {
      // const rand = Math.random().toString();
      // console.log('list length', otherList.length, 'random', rand);
      // console.log('foo length', foo.length , 'update: ', update)
      // foo = [...foo, 'S' + rand];
      // setUpdate(old => old + 1);
      // setOtherList(oldList => [...oldList, rand] );
    }, 1000);

    cacheDB.refreshItems().then(() => {
      setForce(old => old + 1);
    });

    const cleanup = () => {
      window.clearInterval(intId);
    }
    return cleanup;
  }, []);

  const refresh = async () => {
    await cacheDB.refreshItems();
    setForce(old => old + 1);
  }

  const save = async () => {
    await cacheDB.saveAllUnsavedItems();
    setForce(old => old + 1);
  }

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      <button onClick={save}>Save</button>
      <NewTodoItem />
      <TodoListFilters />
      <ul>
        {filterTodoList.map((ias) => (
          <li key={ias.item.id}>
            <TodoItemEditor ias={ias} /> {ias.state}
          </li>
        ))}
      </ul>

      {/* <ul>
        {otherList.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul> */}

      <ul>
        {simpleList.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
