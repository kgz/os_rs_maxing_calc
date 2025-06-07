import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import MaxingGuide from './components/MaxingGuide';
import SkillPlanPage from './components/SkillPlanPage';
import './App.css';
// import { fetchCharacterStats, setUsername } from './store/slices/skillsSlice';

function AppContent() {
  useEffect(() => {
    const lastUsername = localStorage.getItem('lastUsername');
    if (lastUsername) {
    //   store.dispatch(setUsername(lastUsername));
    //   store.dispatch(fetchCharacterStats(lastUsername));
    }
  }, []);

  return (
    <div className="app">
      <MaxingGuide />
    </div>
  );
}

const App: React.FC = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/skill-plan/:skillId" element={<SkillPlanPage />} />
        </Routes>
      </Router>
  );
};

export default App;