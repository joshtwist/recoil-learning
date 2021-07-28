import { atomFamily, useSetRecoilState } from "recoil";
import { cacheDB, ItemAndState } from "../cache-db";
import { forceUpdateState } from "../store";

export default function TodoItemEditor({ ias }: { ias: ItemAndState }) {

  const setForce = useSetRecoilState(forceUpdateState);

  const editItemText = (evt: any) => {
    const updatedItem = {
      ...ias.item,
      text: evt.target.value,
    };

    cacheDB.updateItem(updatedItem);
    setForce(old => old + 1);
  };

  const toggleItemCompletion = (evt: any) => {
    const updatedItem = {
        ...ias.item,
        isComplete: !ias.item.isComplete,
      };

      cacheDB.updateItem(updatedItem);
      setForce(old => old + 1);
  };

  const deleteItem = () => {
    cacheDB.deleteItem(ias.item);
    setForce(old => old + 1);
  };

  return (
    <div>
      <input value={ias.item.text} type="text" onChange={editItemText} />
      <input
        type="checkbox"
        checked={ias.item.isComplete}
        onChange={toggleItemCompletion}
      />
      <button onClick={deleteItem}>Delete</button>
    </div>
  );
}
