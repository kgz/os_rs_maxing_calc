import { useState, useRef, useMemo, useEffect } from 'react';
import { useAppDispatch } from '../store/store';
import { fetchCharacterStats } from '../store/thunks/character/fetchCharacterStats';
import { useCharacterStats } from './useCharacterStats';
import { usePlanEstimations } from './usePlanEstimations';
import { useSkillPlans } from './useSkillPlans';
import { skillsEnum } from '../types/skillsResponse';

export const useMaxingGuide = () => {
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
  useEffect(() => {
    if (lastCharacter?.username) {
      setInputValue(lastCharacter.username);
      setHasTyped(false);
    }
  }, [lastCharacter]);

  // Handle click outside suggestions
  useEffect(() => {
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
        .catch((error) => {
          console.error('Failed to fetch character stats:', error);
          setError('Failed to fetch character stats');
        })
        .finally(() => setLoading(false));
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

  // Get sorted skills data for rendering
  const getSkillsData = () => {
    return Object.keys(skillsEnum)
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
        
        return {
          skillName,
          currentLevel,
          currentSkill,
          isMaxed,
          remainingXP,
          planOptions,
          selectedPlanOption,
          estimatedCost,
          estimatedTime
        };
      });
  };

  return {
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
    handleInputChange,
    handleSuggestionClick,
    handleFetchStats,
    handleKeyPress,
    handleInputFocus,
    handlePlanChange,
    getSkillsData,
    usernameRef,
    suggestionsRef
  };
};