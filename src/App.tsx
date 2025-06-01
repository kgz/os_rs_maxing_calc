import { useEffect } from 'react'
import { Provider } from 'react-redux';
import MaxingGuide from './components/MaxingGuide';
import './App.css'
import { store } from '.';
import { fetchCharacterStats, setUsername } from './store/skillsSlice';

function AppContent() {
  useEffect(() => {
    const lastUsername = localStorage.getItem('lastUsername');
    if (lastUsername) {
      store.dispatch(setUsername(lastUsername));
      store.dispatch(fetchCharacterStats(lastUsername));
    }
  }, []);

  return (
    <div className="app">
      <MaxingGuide />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App