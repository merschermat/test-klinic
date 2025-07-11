import './App.css';
import ToDoList from './components/ToDoList';
import { AppProvider } from './contexts/AppContext';

function App() {
  return (
    <div className="App">
      <AppProvider>
        <ToDoList />
      </AppProvider>
    </div>
  );
}

export default App;
