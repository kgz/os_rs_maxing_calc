import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import MaxingGuide from './components/MaxingGuide';
import SkillPlanPage from './components/SkillPlanPage';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';

const HomePage = () => (
  <div className="home-page">
    <h1>OSRS Maxing Guide</h1>
    <p>Welcome to the Old School RuneScape Maxing Guide. Select a skill from the sidebar to get started.</p>
  </div>
);

function AppContent() {
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