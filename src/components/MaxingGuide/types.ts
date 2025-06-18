import { skillsEnum } from '../../types/skillsResponse';

export interface GuideHeaderProps {
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

export interface ProgressBarProps {
  progress: number;
}

export interface OverallRowProps {
  totalLevel: number;
  totalXP: number;
  overallStats: {
    totalRemainingXP: number;
    totalEstimatedCost: number;
    totalEstimatedTime: number;
  };
}

export interface PlanOption {
  id: string;
  label: string;
  plan: any;
  isTemplate: boolean;
}

export interface SkillRowProps {
  skillName: string;
  currentLevel: number;
  currentSkill: number;
  isMaxed: boolean;
  remainingXP: number;
  planOptions: PlanOption[];
  selectedPlanOption: PlanOption | null;
  handlePlanChange: (skillId: string, option: any) => void;
  estimatedCost: number | null;
  estimatedTime: number | null;
}