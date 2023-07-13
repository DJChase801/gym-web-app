import { useState} from 'react';
import TopBar from './Components/TopBar/topBar';
import View from './Components/View/view';
import './App.css';

function App() {

  const [page, setPage] = useState('buy');
  return (
    <div className="App">
      <TopBar setPage={setPage} />
      <View page={page} />
    </div>
  );
}

export default App;
