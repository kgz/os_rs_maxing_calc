import { useMemo, useRef } from 'react';
import { fetchCharacterStats } from '../store/thunks/character/fetchCharacterStats';
import { skillsEnum } from '../types/skillsResponse';
import { useAppDispatch, useAppSelector } from '../store/store';
import type { SkillsRecord } from '../store/slices/characterSlice';
import { remainingXPToTarget, xpToLevel } from '../utils/xpCalculations';
import { Link } from 'react-router-dom';
import styles from './MaxingGuide.module.css';
import CustomSelect from './CustomSelect';
import { setSelectedPlan } from '../store/thunks/skills/setSelectedPlan';
import { Plans } from '../plans/plans';

const MaxingGuide = () => {
    const dispatch = useAppDispatch();
    const usernameRef = useRef<HTMLInputElement>(null);

    const characters = useAppSelector(state => state.characterReducer);
    const { selectedPlans, plans: userPlans } = useAppSelector((state) => state.skillsReducer);

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

    // Calculate overall progress
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
        
        // Calculate percentage (max level is 99 * number of skills)
        return Math.floor((totalLevels / (99 * totalSkills)) * 100);
    }, [lastCharacter]);

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

    // Function to get plan options for a specific skill
    const getPlanOptionsForSkill = (skillId: string) => {
        const valInSkills = (key: string): key is keyof typeof Plans => key in Plans;
        if (!valInSkills(skillId)) return [];

        // Get template plans for this skill
        const templatePlans = Plans[skillId] || {};
        
        // Create options from template plans
        const templatePlanOptions = Object.entries(templatePlans).map(([key, plan]) => ({
            id: key,
            label: plan?.label || "Unknown",
            plan,
            isTemplate: true
        }));

        // Get user plans for this skill
        const filteredUserPlans = userPlans.filter(plan => plan.type === skillId).map(plan => ({
            id: plan.id,
            label: plan.label,
            plan,
            isTemplate: false
        }));

        return [...templatePlanOptions, ...filteredUserPlans];
    };

    // Function to handle plan selection change
    const handlePlanChange = (skillId: string, option: any) => {
        const valInSkills = (key: string): key is keyof typeof Plans => key in Plans;
        if (!valInSkills(skillId)) {
            console.warn('Invalid skill', skillId);
            return;
        }

        if (!option) return;

        void dispatch(setSelectedPlan({ plan: option.id, skill: skillId }));
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
                        <div 
                            className={styles.progress} 
                            style={{ width: `${overallProgress}%` }}
                        ></div>
                    </div>
                    <div className={styles.progressText}>
                        {overallProgress}%
                    </div>
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
                                <th>Remaining XP</th>
                                <th>Current Plan</th>
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
                                
                                // Get plan options for this skill
                                const planOptions = getPlanOptionsForSkill(skillName);
                                
                                // Find the currently selected plan
                                const selectedPlanId = selectedPlans[skillName as keyof typeof selectedPlans];
                                const selectedPlanOption = planOptions.find(option => option.id === selectedPlanId) || null;
                                
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