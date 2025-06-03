import { type ChangeEvent, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { 
  fetchCharacterStats,
  setUsername,
  updateSkillLevel,
  updateSkillXp,
  updateTargetLevel,
} from '../store/skillsSlice';
import { remainingXPToTarget } from '../utils/xpCalculations';
import { Link } from 'react-router-dom';
import type { TrainingMethod } from '../store/skillsSlice';
import { trainingMethods } from './TrainingMethods';

const MaxingGuide = () => {
  const { skills, loading, error, username } = useAppSelector((state) => state.skills);
  const dispatch = useAppDispatch();
  const [expandedSkills, setExpandedSkills] = useState<string[]>([]);
  const [planningSkill, setPlanningSkill] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      dispatch(fetchCharacterStats(username));
    }
  }, []);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setUsername(e.target.value));
  };

  const handleFetchStats = () => {
    if (username) {
      dispatch(fetchCharacterStats(username));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFetchStats();
    }
  };

  const handleLevelChange = (id: string, level: string) => {
    const parsedLevel = parseInt(level, 10);
    if (!isNaN(parsedLevel) && parsedLevel >= 1 && parsedLevel <= 99) {
      dispatch(updateSkillLevel({ id, level: parsedLevel }));
    }
  };

  const handleXpChange = (id: string, xp: string) => {
    const parsedXp = parseInt(xp, 10);
    if (!isNaN(parsedXp) && parsedXp >= 0) {
      dispatch(updateSkillXp({ id, xp: parsedXp }));
    }
  };

  const handleTargetChange = (id: string, targetLevel: string) => {
    const parsedTargetLevel = parseInt(targetLevel, 10);
    if (!isNaN(parsedTargetLevel) && parsedTargetLevel >= 1 && parsedTargetLevel <= 99) {
      dispatch(updateTargetLevel({ id, targetLevel: parsedTargetLevel }));
    }
  };

  const toggleSkillExpansion = (skillId: string) => {
    setExpandedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const calculateOverallProgress = () => {
    const totalXP = skills.reduce((sum, skill) => sum + skill.xp, 0);
    const maxTotalXP = skills.length * 13034431; // 13,034,431 is the XP for level 99
    return (totalXP / maxTotalXP) * 100;
  };

  const calculateTimeTo99 = (skill: typeof skills[0], trainingMethods: TrainingMethod[]) => {
    let remainingXP = remainingXPToTarget(skill.xp, 99);
	console.log({trainingMethods})
    let totalHours = 0;

    for (const method of trainingMethods) {
		console.log({method})

      if (skill.level >= method.startLevel && skill.level < method.endLevel) {
        const xpForThisMethod = Math.min(remainingXP, remainingXPToTarget(skill.xp, method.endLevel));
        const hoursForThisMethod = xpForThisMethod / method.xpPerHour;
        totalHours += hoursForThisMethod;
        remainingXP -= xpForThisMethod;

        if (remainingXP <= 0) break;
      }
    }

    return totalHours;
  };

  const overallProgress = calculateOverallProgress();

  const generatePlan = (skill: typeof skills[0]) => {
    const plan = [];
    let currentLevel = skill.level;
    let currentXP = skill.xp;

    while (currentLevel < skill.targetLevel) {
      const nextLevel = currentLevel + 1;
      const xpForNextLevel = remainingXPToTarget(currentXP, nextLevel);
      plan.push({
        level: nextLevel,
        xpNeeded: xpForNextLevel,
      });
      currentLevel = nextLevel;
      currentXP += xpForNextLevel;
    }

    return plan;
  };

  return (
    <div className="maxing-guide">
      <header className="guide-header">
        <h1>OSRS Maxing Guide</h1>
        <div className="import-container">
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter RuneScape username"
            disabled={loading}
          />
          <button onClick={handleFetchStats} disabled={loading}>
            {loading ? 'Loading...' : 'Import Character'}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </header>

      <div className="overall-progress">
        <h2>Overall Progress</h2>
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {overallProgress.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="skills-grid">
        {skills.filter(s => s.name === 'Woodcutting').map((skill) => {
          const remainingXP = remainingXPToTarget(skill.xp, skill.targetLevel);
          const progressPercent = Math.min((skill.level / skill.targetLevel) * 100, 100);
          const xpToNext = remainingXPToTarget(skill.xp, skill.level + 1);
          const isMaxed = skill.level === 99;
          const isExpanded = expandedSkills.includes(skill.id);
          const isPlanVisible = planningSkill === skill.id;

          // Get training methods for this skill
          const skillMethods = trainingMethods[skill.id] || [];
          const timeTo99 = calculateTimeTo99(skill, skillMethods);

          return (
            <div key={skill.id} className={`skill-card ${isMaxed ? 'maxed' : ''} ${isExpanded ? 'expanded' : ''}`}>
              <div className="skill-header" onClick={() => isMaxed && toggleSkillExpansion(skill.id)}>
                <img
                  src={`https://oldschool.tools/images/skills/${skill.id.toLocaleLowerCase()}.png`}
                  alt={skill.name}
                  className="skill-icon"
                />
                <h3>{skill.name}</h3>
                {isMaxed ? (
                  <span className="maxed-indicator">
                    Maxed {isExpanded ? '▲' : '▼'}
                  </span>
                ) : <span className="maxed-indicator" style={{visibility:'hidden'}}></span>}
              </div>

              {(!isMaxed || isExpanded) && (
                <>
                  <div className="skill-inputs">
                    <div className="input-group">
                      <label>Current Level:</label>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={skill.level}
                        onChange={(e) => handleLevelChange(skill.id, e.target.value)}
                        disabled={isMaxed}
                      />
                    </div>
                    <div className="input-group">
                      <label>Current XP:</label>
                      <input
                        type="number"
                        min="0"
                        value={skill.xp}
                        onChange={(e) => handleXpChange(skill.id, e.target.value)}
                        disabled={isMaxed}
                      />
                    </div>
                    <div className="input-group">
                      <label>Target Level:</label>
                      <input
                        type="number"
                        min={skill.level}
                        max="99"
                        value={skill.targetLevel}
                        onChange={(e) => handleTargetChange(skill.id, e.target.value)}
                        disabled={isMaxed}
                      />
                    </div>
                  </div>

                  <div className="progress-container">
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      {skill.level} / {isMaxed ? '99' : skill.targetLevel}
                    </div>
                  </div>

                  <div className="xp-info">
                    {isMaxed ? (
                      <p>Skill Maxed - 13,034,431 XP</p>
                    ) : (
                      <>
                        <p>XP to next level: {xpToNext.toLocaleString()}</p>
                        <p>Remaining XP to target: {remainingXP.toLocaleString()}</p>
                        <p>Estimated time to 99: {timeTo99.toFixed(2)} hours</p>
                        <Link to={`/skill-plan/${skill.id}`}>
                          <button>Build Plan</button>
                        </Link>
                      </>
                    )}
                  </div>

                  
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MaxingGuide;