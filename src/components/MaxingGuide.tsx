import { type ChangeEvent, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { 
  fetchCharacterStats,
  setUsername,
  updateSkillLevel,
  updateSkillXp,
  updateTargetLevel
} from '../store/skillsSlice';
import { remainingXPToTarget } from '../utils/xpCalculations';

const MaxingGuide = () => {
  const { skills, loading, error, username } = useAppSelector((state) => state.skills);
  const dispatch = useAppDispatch();

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

      <div className="skills-grid">
        {skills.map((skill) => {
          const remainingXP = remainingXPToTarget(skill.xp, skill.targetLevel);
          const progressPercent = Math.min((skill.level / skill.targetLevel) * 100, 100);

          //   if (skill.name === 'Prayer') {
          // 	console.log({skill, remainingXP}, skill.xp, levelData[skill.level], remainingXPToTarget(skill.xp, skill.level+1))
          //   }
          const xpToNext = remainingXPToTarget(skill.xp, skill.level + 1)

          return (
            <div key={skill.id} className="skill-card">
              <div className="skill-header">
                <img
                  src={`https://oldschool.tools/images/skills/${skill.id.toLocaleLowerCase()}.png`}
                  alt={skill.name}
                  className="skill-icon"
                />
                <h3>{skill.name}</h3>
              </div>

              <div className="skill-inputs">
                <div className="input-group">
                  <label>Current Level:</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={skill.level}
                    onChange={(e) => handleLevelChange(skill.id, e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Current XP:</label>
                  <input
                    type="number"
                    min="0"
                    value={skill.xp}
                    onChange={(e) => handleXpChange(skill.id, e.target.value)}
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
                  {skill.level} / {skill.targetLevel}
                </div>
              </div>

              <div className="xp-info">
                {skill.level < 99 ? (
                  <>
                    <p>XP to next level: {xpToNext.toLocaleString()}</p>
                    <p>Remaining XP to target: {remainingXP.toLocaleString()}</p>
                  </>
                ) : (
                  <p>Max level reached</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MaxingGuide;