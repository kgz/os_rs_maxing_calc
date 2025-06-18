import React from 'react';
import styles from '../MaxingGuide.module.css';

// Define types for component props
interface GuideHeaderProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  loading: boolean;
  error: string | null;
  handleFetchStats: (username: string) => void;
  filteredSuggestions: string[];
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  handleSuggestionClick: (username: string) => void;
  handleInputFocus: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  usernameRef: React.RefObject<HTMLInputElement>;
  suggestionsRef: React.RefObject<HTMLDivElement>;
}


const GuideHeader: React.FC<GuideHeaderProps> = ({ 
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

export default GuideHeader;