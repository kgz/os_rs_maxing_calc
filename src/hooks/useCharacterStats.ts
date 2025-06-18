import { useMemo } from 'react';
import { useAppSelector } from '../store/store';
import { skillsEnum } from '../types/skillsResponse';
import { xpToLevel, remainingXPToTarget } from '../utils/xpCalculations';
import type { SkillsRecord } from '../store/slices/characterSlice';

export const useCharacterStats = () => {
  const characters = useAppSelector(state => state.characterReducer);

  const lastCharacter: SkillsRecord & { 'username': string } | null = useMemo(() => {
    const last = Object.entries(characters).sort(([, a], [, b]) => b.lastUpdated - a.lastUpdated).at(0);
    if (last !== undefined) {
      return {
        ...last[1],
        username: last[0]
      }
    }
    return null;
  }, [characters]);

  const overallProgress = useMemo(() => {
    if (!lastCharacter) return 0;
    
    let totalLevels = 0;
    let totalSkills = 0;
    
    Object.keys(skillsEnum).forEach((skillId) => {
      const skillName = skillId as keyof typeof skillsEnum;
      const skills = lastCharacter[skillName] ?? { "0": 0 };
      const lastEpoch = Math.max(...Object.keys(skills).map(Number));
      const currentSkill = skills[lastEpoch] ?? 0;
      const currentLevel = xpToLevel(currentSkill);
      
      totalLevels += currentLevel;
      totalSkills++;
    });
    
    return Math.floor((totalLevels / (99 * totalSkills)) * 100);
  }, [lastCharacter]);

  const characterUsernames = useMemo(() => {
    return Object.keys(characters).sort();
  }, [characters]);

  const getSkillLevel = (skillName: keyof typeof skillsEnum) => {
    if (!lastCharacter) return 0;
    const skills = lastCharacter[skillName] ?? { "0": 0 };
    const lastEpoch = Math.max(...Object.keys(skills).map(Number));
    return xpToLevel(skills[lastEpoch] ?? 0);
  };

  const getSkillXP = (skillName: keyof typeof skillsEnum) => {
    if (!lastCharacter) return 0;
    const skills = lastCharacter[skillName] ?? { "0": 0 };
    const lastEpoch = Math.max(...Object.keys(skills).map(Number));
    return skills[lastEpoch] ?? 0;
  };

  const getRemainingXP = (skillName: keyof typeof skillsEnum) => {
    const currentXP = getSkillXP(skillName);
    return remainingXPToTarget(currentXP, 99);
  };

  const isSkillMaxed = (skillName: keyof typeof skillsEnum) => {
    return getSkillLevel(skillName) >= 99;
  };

  const getTotalLevel = () => {
    if (!lastCharacter) return 0;
    return Object.keys(skillsEnum).reduce((total, skillId) => {
      const skillName = skillId as keyof typeof skillsEnum;
      return total + getSkillLevel(skillName);
    }, 0);
  };

  const getTotalXP = () => {
    if (!lastCharacter) return 0;
    return Object.keys(skillsEnum).reduce((total, skillId) => {
      const skillName = skillId as keyof typeof skillsEnum;
      return total + getSkillXP(skillName);
    }, 0);
  };

  return {
    lastCharacter,
    overallProgress,
    characterUsernames,
    getSkillLevel,
    getSkillXP,
    getRemainingXP,
    isSkillMaxed,
    getTotalLevel,
    getTotalXP
  };
};