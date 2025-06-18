import { useState, useRef, useMemo } from 'react';
import { fetchCharacterStats } from '../store/thunks/character/fetchCharacterStats';
import { skillsEnum } from '../types/skillsResponse';
import { useAppDispatch } from '../store/store';
import { remainingXPToTarget, xpToLevel } from '../utils/xpCalculations';
import { Link } from 'react-router-dom';
import styles from './MaxingGuide.module.css';
import CustomSelect from './CustomSelect';
import { formatTime } from '../utils/timeFormatting';
import { useCharacterStats } from '../hooks/useCharacterStats';
import { usePlanEstimations } from '../hooks/usePlanEstimations';
import { useSkillPlans } from '../hooks/useSkillPlans';

// Header component with username input and fetch button
const GuideHeader = ({ 
  inputValue, 
  setInputValue, 
  loading, 
  error, 
  handleFetchStats, 
  filteredSuggestions, 
  showSuggestions, 
  setShowSuggestions, 
  handleSuggestionClick, 
  handleInputFocus, 
  handleKeyPress, 
  usernameRef, 
  suggestionsRef 
}) => (
  <header className={styles.guideHeader}>
    <h1>OSRS Maxing Guide</h1>
    <div className={styles.importContainer}>
      <div className={styles.autocompleteContainer}>
        <input
          ref={usernameRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={handleInputFocus}
          onKeyPress={handleKeyPress}
          placeholder="Enter RuneScape username"
          className={styles.usernameInput}
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div ref={suggestionsRef} className={styles.suggestionsList}>
            {filteredSuggestions.map((username) => (
              <div 
                key={username} 
                className={styles.suggestionItem}
                onClick={() => handleSuggestionClick(username)}
              >
                {username}
              </div>
            ))}
          </div>
        )}
      </div>
      <button 
        disabled={loading || !inputValue.trim()}
        onClick={() => handleFetchStats(inputValue)}
        className={`${styles.snapshotButton} ${loading ? styles.loading : ''}`}
      >
        {loading ? (
          <span className={styles.loadingContainer}>
            <span className={styles.loadingSpinner}></span>
            <span>Loading...</span>
          </span>
        ) : (
          <>Fetch</>
        )}
      </button>
    </div>
    {error && <div className={styles.errorMessage}>{error}</div>}
  </header>
);

// Progress bar component
const ProgressBar = ({ progress }) => (
  <div className={styles.overallProgress}>
    <h2>Overall Progress</h2>
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div 
          className={styles.progress} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className={styles.progressText}>
        {progress}%
      </div>
    </div>
  </div>
);

// Overall row component
const OverallRow = ({ totalLevel, totalXP, overallStats }) => (
  <tr className={styles.overallRow}>
    <td>
      <div className={styles.overallNameCell}>
        <span>Overall</span>
      </div>
    </td>
    <td className={styles.levelCell}>{totalLevel}</td>
    <td className={styles.xpCell}>{totalXP.toLocaleString('en-au', { notation: 'compact' })}</td>
    <td className={styles.remainingXpCell}>
      {overallStats.totalRemainingXP.toLocaleString('en-au', { notation: 'compact' })}
    </td>
    <td>-</td>
    <td className={`${styles.estCostCell} ${styles.overallCostCell}`}>
      {overallStats.totalEstimatedCost !== 0 ? (
        <span className={overallStats.totalEstimatedCost > 0 ? styles.costNegative : styles.costPositive}>
          {overallStats.totalEstimatedCost > 0 ? '-' : ''}
          {Math.abs(overallStats.totalEstimatedCost).toLocaleString('en-au', { notation: 'compact' })}
        </span>
      ) : '-'}
    </td>
    <td className={styles.overallTimeCell}>
      {overallStats.totalEstimatedTime > 0 ? formatTime(overallStats.totalEstimatedTime) : '-'}
    </td>
    <td>-</td>
  </tr>
);

// Skill row component
const SkillRow = ({ 
  skillName, 
  currentLevel, 
  currentSkill, 
  isMaxed, 
  remainingXP, 
  planOptions, 
  selectedPlanOption, 
  handlePlanChange, 
  estimatedCost, 
  estimatedTime 
}) => (
  <tr className={isMaxed ? styles.maxedSkill : ''}>
    <td>
      <div className={styles.skillNameCell}>
        <img 
          src={`/images/skills/${skillsEnum[skillName].toLowerCase()}.png`}
          alt={skillName}
          className={styles.skillIcon}
        />
        <span className={styles.skillName}>{skillName}</span>
      </div>
    </td>
    <td className={styles.levelCell}>{currentLevel}</td>
    <td className={styles.xpCell}>{currentSkill.toLocaleString('en-au', { notation: 'compact' })}</td>
    <td className={styles.remainingXpCell}>
      {isMaxed ? '-' : remainingXP.toLocaleString('en-au', { notation: 'compact' })}
    </td>
    <td className={styles.planSelectorCell}>
      {!isMaxed && (
        <div className={styles.planSelectorWrapper}>
          <CustomSelect
            options={planOptions}
            value={selectedPlanOption}
            onChange={(option) => handlePlanChange(skillName, option)}
            getOptionLabel={(option) => option?.label ?? ''}
            getOptionValue={(option) => option?.id ?? ''}
            placeholder="Select plan..."
            renderSelectedValue={(option) => (
              <span className={styles.selectedPlanLabel}>{option?.label || "Select plan..."}</span>
            )}
            renderOption={(option) => (
              <span>{option?.label}</span>
            )}
          />
        </div>
      )}
      {isMaxed && (
        <span className={styles.maxedText}>Maxed</span>
      )}
    </td>
    <td className={styles.estCostCell}>
      {estimatedCost !== null ? (
        <span className={estimatedCost > 0 ? styles.costNegative : styles.costPositive}>
          {estimatedCost > 0 ? '-' : ''}
          {Math.abs(estimatedCost).toLocaleString('en-au', { notation: 'compact' })}
        </span>
      ) : '-'}
    </td>
    <td className={styles.estTimeCell}>
      {estimatedTime !== null ? formatTime(estimatedTime) : '-'}
    </td>
    <td className={styles.actionsCell}>
      {!isMaxed && (
        <Link to={`/skill/${skillName}`}>
          <button className={styles.planButton}>View Plan</button>
        </Link>
      )}
    </td>
  </tr>
);

// Main component
const MaxingGuide = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hasTyped, setHasTyped] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  // Use our custom hooks
  const { 
    lastCharacter, 
    overallProgress, 
    characterUsernames, 
    getSkillLevel, 
    getSkillXP, 
    getRemainingXP, 
    isSkillMaxed,
    getTotalLevel,
    getTotalXP
  } = useCharacterStats();
  
  const { estimatePlanCost, estimatePlanTime, calculateOverallStats } = usePlanEstimations();
  const { selectedPlans, getPlanOptionsForSkill, handlePlanChange } = useSkillPlans();

  // Calculate overall stats
  const overallStats = useMemo(() => calculateOverallStats(), [calculateOverallStats]);
  
  // Filter suggestions based on input
  const filteredSuggestions = useMemo(() => {
    if (!hasTyped) return characterUsernames;
    if (!inputValue) return characterUsernames;
    return characterUsernames.filter(username => 
      username.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [characterUsernames, inputValue, hasTyped]);

  // Set input value when last character changes
  useMemo(() => {
    if (lastCharacter?.username) {
      setInputValue(lastCharacter.username);
      setHasTyped(false);
    }
  }, [lastCharacter]);

  // Handle click outside suggestions
  useMemo(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) && 
          usernameRef.current && !usernameRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
    setHasTyped(true);
  };

  // Handle suggestion click
  const handleSuggestionClick = (username: string) => {
    setInputValue(username);
    setShowSuggestions(false);
    setHasTyped(false);
    if (usernameRef.current) {
      usernameRef.current.value = username;
    }
    handleFetchStats(username);
  };

  // Handle fetch stats
  const handleFetchStats = (val: string) => {
    const username = val.trim();
    if (username) {
      setLoading(true);
      setHasTyped(false);
      dispatch(fetchCharacterStats(username))
        .then(() => setError(null))
        .finally(() => setLoading(false))
        .catch((error) => {
          console.error('Failed to fetch character stats:', error);
          setError('Failed to fetch character stats');
        });
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFetchStats(inputValue);
      setShowSuggestions(false);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (characterUsernames.length > 0) {
      setShowSuggestions(true);
      setHasTyped(false);
    }
  };

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
              {Object.keys(skillsEnum)
                .sort((a, b) => {
                  const isMaxedA = isSkillMaxed(a);
                  const isMaxedB = isSkillMaxed(b);
                  if (isMaxedA !== isMaxedB) {
                    return isMaxedA ? 1 : -1;
                  }
                  return a.localeCompare(b);
                })
                .map((skillId) => {
                  const skillName = skillId as keyof typeof skillsEnum;
                  const currentLevel = getSkillLevel(skillName);
                  const currentSkill = getSkillXP(skillName);
                  const remainingXP = getRemainingXP(skillName);
                  const isMaxed = isSkillMaxed(skillName);
                  const planOptions = getPlanOptionsForSkill(skillName);
                  const selectedPlanOption = planOptions.find(option => option.id === selectedPlans[skillName]) || null;
                  const estimatedCost = !isMaxed ? estimatePlanCost(skillName, remainingXP, currentLevel) : null;
                  const estimatedTime = !isMaxed ? estimatePlanTime(skillName, remainingXP, currentLevel) : null;
                  return (
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
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MaxingGuide;