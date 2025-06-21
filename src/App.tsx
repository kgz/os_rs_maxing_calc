import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MaxingGuide from './components/MaxingGuide';
import SkillPlanPage from './components/SkillPlanPage';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import { useAppDispatch } from './store/store';
import { fetchItemMapping } from './store/thunks/items/fetchItemMapping';
import { fetchLatestPrices } from './store/thunks/items/fetchLatestPrices';
import { useValidateUserPlans } from './utils/validatePlans';

function AppContent() {
	useValidateUserPlans()
  useEffect(() => {
    const lastUsername = localStorage.getItem('lastUsername');
    if (lastUsername) {
      // store.dispatch(setUsername(lastUsername));
      // store.dispatch(fetchCharacterStats(lastUsername));
    }
  }, []);

  return (
    <div className="app">
      <MaxingGuide />
    </div>
  );
}

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    // Fetch item mapping and latest prices when the app loads
    void dispatch(fetchItemMapping());
    void dispatch(fetchLatestPrices());
    
    // Set up an interval to refresh prices every 5 minutes
    const intervalId = setInterval(() => {
      void dispatch(fetchLatestPrices());
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<AppContent />} />
            <Route path="/skill-plan/:skillId" element={<SkillPlanPage />} />
            <Route path="/skill/:skillId" element={<SkillPlanPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;