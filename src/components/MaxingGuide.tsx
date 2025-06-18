import React from 'react';
import styles from './MaxingGuide.module.css';
import { useMaxingGuide } from '../hooks/useMaxingGuide';
import GuideHeader from './MaxingGuide/GuideHeader';
import ProgressBar from './MaxingGuide/ProgressBar';
import OverallRow from './MaxingGuide/OverallRow';
import SkillRow from './MaxingGuide/SkillRow';

// Main component
const MaxingGuide: React.FC = () => {
  const {
    loading,
    error,
    showSuggestions,
    setShowSuggestions,
    inputValue,
    setInputValue,
    filteredSuggestions,
    lastCharacter,
    overallProgress,
    overallStats,
    getTotalLevel,
    getTotalXP,
    handleSuggestionClick,
    handleFetchStats,
    handleKeyPress,
    handleInputFocus,
    handlePlanChange,
    getSkillsData,
    usernameRef,
    suggestionsRef
  } = useMaxingGuide();

  const skillsData = getSkillsData();

  return (
    <div className={styles.maxingGuide}>
      <GuideHeader 
        inputValue={inputValue} 
        setInputValue={setInputValue} 
        loading={loading} 
        error={error} 
        handleFetchStats={handleFetchStats} 
        filteredSuggestions={filteredSuggestions} 
        showSuggestions={showSuggestions} 
        setShowSuggestions={setShowSuggestions} 
        handleSuggestionClick={handleSuggestionClick} 
        handleInputFocus={handleInputFocus} 
        handleKeyPress={handleKeyPress} 
        usernameRef={usernameRef} 
        suggestionsRef={suggestionsRef} 
      />
      <ProgressBar progress={overallProgress} />
      {!lastCharacter && (
        <div className={styles.noCharacterMessage}>
          No character data found. Please enter a valid RuneScape username.
        </div>
      )}
      {lastCharacter && (
        <div className={styles.skillsTableContainer}>
          <table className={styles.skillsTable}>
            <thead>
              <tr>
                <th>Skill</th>
                <th>Level</th>
                <th>XP</th>
                <th>Remaining XP</th>
                <th>Current Plan</th>
                <th>Est. Cost</th>
                <th>Est. Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <OverallRow 
                totalLevel={getTotalLevel()} 
                totalXP={getTotalXP()} 
                overallStats={overallStats} 
              />
              {skillsData.map(({
                skillName,
                currentLevel,
                currentSkill,
                isMaxed,
                remainingXP,
                planOptions,
                selectedPlanOption,
                estimatedCost,
                estimatedTime
              }) => (
                <SkillRow 
                  key={skillName} 
                  skillName={skillName} 
                  currentLevel={currentLevel} 
                  currentSkill={currentSkill} 
                  isMaxed={isMaxed} 
                  remainingXP={remainingXP} 
                  planOptions={planOptions} 
                  selectedPlanOption={selectedPlanOption} 
                  handlePlanChange={handlePlanChange} 
                  estimatedCost={estimatedCost} 
                  estimatedTime={estimatedTime} 
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MaxingGuide;