
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import TodoList from './components/TodoList';


function App() {
  return (
    <RecoilRoot>
      <Suspense fallback={(<div>Loading</div>)}>
     <div className="App">
       
        <TodoList />
      </div>
      </Suspense>
    </RecoilRoot>

  );
}

export default App;
