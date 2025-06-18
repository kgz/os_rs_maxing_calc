import { useMemo, useRef } from 'react';
import { fetchCharacterStats } from '../store/thunks/character/fetchCharacterStats';
import { skillsEnum } from '../types/skillsResponse';
import { useAppDispatch, useAppSelector } from '../store/store';
import type { SkillsRecord } from '../store/slices/characterSlice';
import { remainingXPToTarget, xpToLevel } from '../utils/xpCalculations';
import { Link } from 'react-router-dom';
import styles from './MaxingGuide.module.css';

const MaxingGuide = () => {
    const dispatch = useAppDispatch();
    const usernameRef = useRef<HTMLInputElement>(null);

    const characters = useAppSelector(state => state.characterReducer)

    const lastCharacter: SkillsRecord & { 'username': string } | null = useMemo(() => {
        const last = Object.entries(characters).sort(([, a], [, b]) => b.lastUpdated - a.lastUpdated).at(0);
        if (last !== undefined) {
            return {
                ...last[1],
                username: last[0]
            }
        }

        return null
    }, [characters])

    const handleFetchStats = () => {
        const username = usernameRef.current?.value?.trim();
        console.log('Fetching stats for:', username);
        if (username) {
            dispatch(fetchCharacterStats(username));
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleFetchStats();
        }
    };

    return (
        <div className={styles.maxingGuide}>
            <header className={styles.guideHeader}>
                <h1>OSRS Maxing Guide</h1>
                <div className={styles.importContainer}>
                    <input
                        ref={usernameRef}
                        type="text"
                        defaultValue={lastCharacter?.username ?? ''}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter RuneScape username"
                    />
                    <button onClick={handleFetchStats}>
                        {'Take Xp Snapshot'}
                    </button>
                </div>
            </header>

            <div className={styles.overallProgress}>
                <h2>Overall Progress</h2>
                <div className={styles.progressContainer}>
                    <div className={styles.progressBar}>
                        <div className={styles.progress}></div>
                    </div>
                    <div className={styles.progressText}></div>
                </div>
            </div>
            
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
                                <th>Remaining XP to 99</th>
                                <th>Progress</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(skillsEnum).map((skillId) => {
                                const skillName = skillId as keyof typeof skillsEnum;
                                
                                const skills = lastCharacter[skillName] ?? {
                                    "0": 0
                                };
                                const lastEpoch = Math.max(...Object.keys(skills).map(Number));
                                const currentSkill = skills[lastEpoch] ?? 0;
                                
                                const currentLevel = xpToLevel(currentSkill);
                                const isMaxed = currentLevel === 99;
                                const remainingXP = remainingXPToTarget(currentSkill, 99);
                                const progressPercent = Math.min((currentLevel / 99) * 100, 100);
                                
                                return (
                                    <tr key={skillName} className={isMaxed ? styles.maxedSkill : ''}>
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
                                        <td className={styles.levelCell}>
                                            {currentLevel}
                                        </td>
                                        <td className={styles.xpCell}>{currentSkill.toLocaleString()}</td>
                                        <td className={styles.remainingXpCell}>
                                            {isMaxed ? '-' : remainingXP.toLocaleString()}
                                        </td>
                                        <td className={styles.progressCell}>
                                            <div className={styles.progressBar}>
                                                <div 
                                                    className={styles.progress} 
                                                    style={{ width: `${progressPercent}%` }}
                                                ></div>
                                            </div>
                                            <span className={styles.progressText}>{Math.floor(progressPercent)}%</span>
                                        </td>
                                        <td className={styles.actionsCell}>
                                            {!isMaxed && (
                                                <Link to={`/skill/${skillName}`}>
                                                    <button className={styles.planButton}>Plan</button>
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
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