import { useCallback, useMemo, useRef, useState } from 'react';
import { fetchCharacterStats } from '../store/thunks/character/fetchCharacterStats';
import { skillsEnum } from '../types/skillsResponse';
import { useAppDispatch, useAppSelector } from '../store/store';
import type { SkillsRecord } from '../store/slices/characterSlice';
import { remainingXPToTarget, xpToLevel, levelToXp } from '../utils/xpCalculations';
import { Link } from 'react-router-dom';
import styles from './MaxingGuide.module.css';
import CustomSelect from './CustomSelect';
import { setSelectedPlan } from '../store/thunks/skills/setSelectedPlan';
import { Plans } from '../plans/plans';
import type { PlanMethod } from '../types/plan';
import { useItems } from '../hooks/useItems';

const MaxingGuide = () => {
	const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const usernameRef = useRef<HTMLInputElement>(null);
	const {getItemPrice} = useItems();

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
			setLoading(true);
            dispatch(fetchCharacterStats(username)).finally(() => setLoading(false));
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

    // Function to estimate the cost of a plan based on the selected plan and remaining XP
    const estimatePlanCost = useCallback((skillId: string, remainingXP: number, currentLevel: number) => {
        // if (skillId !== "Crafting") return null;
        const selectedPlanId = selectedPlans[skillId as keyof typeof selectedPlans];

        if (!selectedPlanId) {
            console.warn('No plan selected for skill');    
            return null;
        }
        
        const valInSkills = (key: string): key is keyof typeof Plans => key in Plans;
        if (!valInSkills(skillId)) {
            console.warn('Invalid skill', skillId);    
            return null;
        }
        
        const skillEpochs = lastCharacter?.[skillId] ?? { "0": 0 };
        // get the last skill level, key is an epoch
        const lastEpoch = Math.max(...Object.keys(skillEpochs).map(Number));

        // Get the plan details
        const templatePlans = Plans[skillId];

        if (!(selectedPlanId in templatePlans) && !userPlans.some(plan => plan.id === selectedPlanId)) {
            console.warn(`Invalid plan ID or type for ${skillId}:`, selectedPlanId);
        }

        let selectedPlan = null;

        const selectedTemplatePlan = Object.entries(templatePlans).find(([key]) => key === selectedPlanId);
        if (selectedTemplatePlan) {
            selectedPlan = selectedTemplatePlan[1];
        } else {
            selectedPlan = userPlans.find((plan) => plan.id === selectedPlanId);
        }
        
        if (!selectedPlan) return null;
        
        // Check if methods exist and are in the expected format
        if (!selectedPlan.methods || typeof selectedPlan.methods !== 'object') {
            console.warn(`Invalid plan structure for ${skillId}:`, selectedPlan);
            return null;
        }
        
        // Calculate cost based on methods in the plan
        let totalCost = 0;
        let remainingXpToCalculate = remainingXP;
        
        // Handle both array and object formats for methods
        const _methodsArray: PlanMethod[] = Array.isArray(selectedPlan.methods) 
            ? selectedPlan.methods 
            : Object.values(selectedPlan.methods);

        const methodsArray = [..._methodsArray];
        
        // Sort methods by level requirement
        let sortedMethods = methodsArray.sort((a, b) => Number(a.from) - Number(b.from));
        sortedMethods = sortedMethods.filter((method, i) => {
            // if next element .from is less than or equal to current level ignore
            if (sortedMethods[i+1] && sortedMethods[i+1].from <= currentLevel) return false;
            return true;
        });
        
        if (sortedMethods.length === 0) {
            console.warn(`No applicable methods found for ${skillId} at level ${currentLevel}`);
            return null;
        }
        
        for (const method of sortedMethods) {
            if (remainingXpToCalculate <= 0) break;
            
            // Safely access method properties
            const methodObj = method.method;
            const xpPerAction = methodObj.xp;
            const input = methodObj.items;
            const output = methodObj.returns;
            
			 // Find the next method's level or default to 99
            const nextMethod = sortedMethods.find(m => m.from > method.from);
            const nextLevel = nextMethod ? nextMethod.from : 99;
        	const currentSkillXp = skillEpochs[lastEpoch] ?? 0;
			const fromXp = Math.max(levelToXp(method.from), currentSkillXp);

			const xpForThisMethod = remainingXPToTarget(fromXp, nextLevel);

            
            // // Calculate XP for this level range
            // const xpForThisMethod = Math.min(
            //     remainingXpToCalculate,
            //     remainingXPToTarget(Math.max(currentSkillXp, levelToXp(method.from)), levelToXp(nextLevel))
            // );
            
            const actionsNeeded = Math.ceil(xpForThisMethod / xpPerAction);

            // Try to get cost from different possible properties
            let costPerAction = 0;
            input.forEach(item => {
                const cost = getItemPrice(item.item.id) ?? 0;
                costPerAction += cost * item.amount;
            });

            output.forEach(item => {
                const cost = getItemPrice(item.item.id) ?? 0;
                costPerAction -= cost * item.amount;
            });
            
            if (xpPerAction <= 0) continue;
			console.log(`Cost for ${skillId} at level ${currentLevel} to level ${nextLevel}`);
			console.log(`Actions needed: ${actionsNeeded}`);
            
           
            totalCost += actionsNeeded * costPerAction;
            
            remainingXpToCalculate -= xpForThisMethod;
        }
        
        return totalCost;
    }, [getItemPrice, selectedPlans, userPlans, lastCharacter]);

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
                        className={styles.usernameInput}
                    />
                    <button 
                        disabled={loading || !usernameRef.current?.value?.trim()}
                        onClick={handleFetchStats}
                        className={`${styles.snapshotButton} ${loading ? styles.loading : ''}`}
                    >
                        {loading  ? (
                            <span className={styles.loadingContainer}>
                                <span className={styles.loadingSpinner}></span>
                                <span>Loading...</span>
                            </span>
                        ) : (
                            <>Fetch</>
                        )}
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
                                <th>Est. Cost</th>
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
                                
                                // Estimate cost based on selected plan
                                const estimatedCost = !isMaxed ? estimatePlanCost(skillName, remainingXP, currentLevel) : null;
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
                                        <td className={styles.estCostCell}>
                                            {estimatedCost !== null ? (
                                                <span className={estimatedCost > 0 ? styles.costNegative : styles.costPositive}>
                                                    {estimatedCost > 0 ? '-' : ''}
                                                    {Math.abs(estimatedCost).toLocaleString('en-au', { notation: 'compact' })}
                                                </span>
                                            ) : '-'}
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
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MaxingGuide;