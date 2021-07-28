import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { v4 } from "uuid";
import { cacheDB } from "../cache-db";
import { FakeDB } from "../fakeDB";
import { forceUpdateState } from "../store";

export default function NewTodoItem() {
  // const setTodoList = useSetRecoilState(todoListState);
  const [inputValue, setInputValue] = useState("");
  const setForceUpdate = useSetRecoilState(forceUpdateState);

  const onChange = (evt: any) => {
    setInputValue(evt.target.value);
  };

  const addItem = async () => {
    await cacheDB.addItem({
      id: v4(),
      text: inputValue,
      isComplete: false,
    });

    setForceUpdate(old => old + 1);
    setInputValue("");
  };

  return (
    <div>
      <input autoFocus type="text" value={inputValue} onChange={onChange} />
      <button onClick={addItem}>Add Item</button>
    </div>
  );
}
