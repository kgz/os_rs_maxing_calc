import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
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
import { formatTime } from '../utils/timeFormatting';

const MaxingGuide = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const suggestionsRef = useRef<HTMLDivElement>(null);
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

    // Add this state to track if user has manually typed
    const [hasTyped, setHasTyped] = useState(false);

    // Update the filteredSuggestions logic
    const filteredSuggestions = useMemo(() => {
        // If user hasn't typed anything manually, show all suggestions
        if (!hasTyped) return characterUsernames;
        
        // If they've typed, filter based on input
        if (!inputValue) return characterUsernames;
        return characterUsernames.filter(username => 
            username.toLowerCase().includes(inputValue.toLowerCase())
        );
    }, [characterUsernames, inputValue, hasTyped]);

    useEffect(() => {
        if (lastCharacter?.username) {
            setInputValue(lastCharacter.username);
            setHasTyped(false); // Reset typing state when character changes
        }
    }, [lastCharacter]);

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

    // Update the handleInputChange function
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setShowSuggestions(true);
        setHasTyped(true); // Mark that user has typed
    };

    // Update the handleSuggestionClick function
    const handleSuggestionClick = (username: string) => {
        setInputValue(username);
        setShowSuggestions(false);
        setHasTyped(false); // Reset typing state when selecting from dropdown
        if (usernameRef.current) {
            usernameRef.current.value = username;
        }
		handleFetchStats(username)
		
    };

    // Update the handleFetchStats function
    const handleFetchStats = (val:string) => {
        const username = val.trim();
        console.log('Fetching stats for:', username);
        if (username) {
            setLoading(true);
            setHasTyped(false); // Reset typing state after fetch
            dispatch(fetchCharacterStats(username))
                .then(() => setError(null))
                .finally(() => setLoading(false))
                .catch((error) => {
                    console.error('Failed to fetch character stats:', error);
                    setError('Failed to fetch character stats');
                });
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleFetchStats(inputValue);
            setShowSuggestions(false);
        }
    };

    const handleInputFocus = () => {
        // Only show suggestions when focusing if we have character usernames
        if (characterUsernames.length > 0) {
            setShowSuggestions(true);
            // Don't filter on focus, show all available usernames
            setHasTyped(false);
        }
    };

    const getPlanOptionsForSkill = (skillId: string) => {
        const valInSkills = (key: string): key is keyof typeof Plans => key in Plans;
        if (!valInSkills(skillId)) return [];

        const templatePlans = Plans[skillId] || {};
        
        const templatePlanOptions = Object.entries(templatePlans).map(([key, plan]) => ({
            id: key,
            label: plan?.label || "Unknown",
            plan,
            isTemplate: true
        }));

        const filteredUserPlans = userPlans.filter(plan => plan.type === skillId).map(plan => ({
            id: plan.id,
            label: plan.label,
            plan,
            isTemplate: false
        }));

        return [...templatePlanOptions, ...filteredUserPlans];
    };

    const handlePlanChange = (skillId: string, option: any) => {
        const valInSkills = (key: string): key is keyof typeof Plans => key in Plans;
        if (!valInSkills(skillId)) {
            console.warn('Invalid skill', skillId);
            return;
        }

        if (!option) return;

        void dispatch(setSelectedPlan({ plan: option.id, skill: skillId }));
    };

    const estimatePlanCost = useCallback((skillId: string, remainingXP: number, currentLevel: number) => {
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
        const lastEpoch = Math.max(...Object.keys(skillEpochs).map(Number));

        const templatePlans = Plans[skillId];

        let selectedPlan = null;

        const selectedTemplatePlan = Object.entries(templatePlans).find(([key]) => key === selectedPlanId);
        if (selectedTemplatePlan) {
            selectedPlan = selectedTemplatePlan[1];
        } else {
            selectedPlan = userPlans.find((plan) => plan.id === selectedPlanId);
        }
        
        if (!selectedPlan) return null;
        
        if (!selectedPlan.methods || typeof selectedPlan.methods !== 'object') {
            console.warn(`Invalid plan structure for ${skillId}:`, selectedPlan);
            return null;
        }
        
        let totalCost = 0;
        let remainingXpToCalculate = remainingXP;
        
        const _methodsArray: PlanMethod[] = Array.isArray(selectedPlan.methods) 
            ? selectedPlan.methods 
            : Object.values(selectedPlan.methods);

        const methodsArray = [..._methodsArray];
        
        let sortedMethods = methodsArray.sort((a, b) => Number(a.from) - Number(b.from));
        sortedMethods = sortedMethods.filter((method, i) => {
            if (sortedMethods[i+1] && sortedMethods[i+1].from <= currentLevel) return false;
            return true;
        });
        
        if (sortedMethods.length === 0) {
            console.warn(`No applicable methods found for ${skillId} at level ${currentLevel}`);
            return null;
        }
        
        for (const method of sortedMethods) {
            if (remainingXpToCalculate <= 0) break;
            
            const methodObj = method.method;
            const xpPerAction = methodObj.xp;
            const input = methodObj.items;
            const output = methodObj.returns;
            
            const nextMethod = sortedMethods.find(m => m.from > method.from);
            const nextLevel = nextMethod ? nextMethod.from : 99;
        	const currentSkillXp = skillEpochs[lastEpoch] ?? 0;
			const fromXp = Math.max(levelToXp(method.from), currentSkillXp);

			const xpForThisMethod = remainingXPToTarget(fromXp, nextLevel);
            
            const actionsNeeded = Math.ceil(xpForThisMethod / xpPerAction);

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

    const estimatePlanTime = useCallback((skillId: string, remainingXP: number, currentLevel: number) => {
        const selectedPlanId = selectedPlans[skillId as keyof typeof selectedPlans];

        if (!selectedPlanId) {
            return null;
        }
        
        const valInSkills = (key: string): key is keyof typeof Plans => key in Plans;
        if (!valInSkills(skillId)) {
            return null;
        }
        
        const skillEpochs = lastCharacter?.[skillId] ?? { "0": 0 };
        const lastEpoch = Math.max(...Object.keys(skillEpochs).map(Number));

        const templatePlans = Plans[skillId];

        let selectedPlan = null;

        const selectedTemplatePlan = Object.entries(templatePlans).find(([key]) => key === selectedPlanId);
        if (selectedTemplatePlan) {
            selectedPlan = selectedTemplatePlan[1];
        } else {
            selectedPlan = userPlans.find((plan) => plan.id === selectedPlanId);
        }
        
        if (!selectedPlan) return null;
        
        if (!selectedPlan.methods || typeof selectedPlan.methods !== 'object') {
            return null;
        }
        
        let totalHours = 0;
        let remainingXpToCalculate = remainingXP;
        
        const _methodsArray: PlanMethod[] = Array.isArray(selectedPlan.methods) 
            ? selectedPlan.methods 
            : Object.values(selectedPlan.methods);

        const methodsArray = [..._methodsArray];
        
        let sortedMethods = methodsArray.sort((a, b) => Number(a.from) - Number(b.from));
        sortedMethods = sortedMethods.filter((_, i) => {
            if (sortedMethods[i+1] && sortedMethods[i+1].from <= currentLevel) return false;
            return true;
        });
        
        if (sortedMethods.length === 0) {
            return null;
        }
        
        for (const method of sortedMethods) {
            if (remainingXpToCalculate <= 0) break;
            
            const methodObj = method.method;
            const xpPerHour = methodObj.xp * (methodObj.actionsPerHour || 0);
            
            if (!xpPerHour || xpPerHour <= 0) continue;
            
            const nextMethod = sortedMethods.find(m => m.from > method.from);
            const nextLevel = nextMethod ? nextMethod.from : 99;
            const currentSkillXp = skillEpochs[lastEpoch] ?? 0;
            const fromXp = Math.max(levelToXp(method.from), currentSkillXp);

            const xpForThisMethod = remainingXPToTarget(fromXp, nextLevel);
            
            const hoursNeeded = xpForThisMethod / xpPerHour;
            
            totalHours += hoursNeeded;
            remainingXpToCalculate -= xpForThisMethod;
        }
        
        return totalHours;
    }, [selectedPlans, userPlans, lastCharacter]);

    return (
        <div className={styles.maxingGuide}>
            <header className={styles.guideHeader}>
                <h1>OSRS Maxing Guide</h1>
                <div className={styles.importContainer}>
                    <div className={styles.autocompleteContainer}>
                        <input
                            ref={usernameRef}
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
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
                        onClick={()=>handleFetchStats(inputValue)}
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
                                <th>Est. Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(skillsEnum)
                                .sort((a, b) => {
                                    const skillsA = lastCharacter?.[a as keyof typeof skillsEnum] ?? { "0": 0 };
                                    const skillsB = lastCharacter?.[b as keyof typeof skillsEnum] ?? { "0": 0 };
                                    
                                    const lastEpochA = Math.max(...Object.keys(skillsA).map(Number));
                                    const lastEpochB = Math.max(...Object.keys(skillsB).map(Number));
                                    
                                    const currentSkillA = skillsA[lastEpochA] ?? 0;
                                    const currentSkillB = skillsB[lastEpochB] ?? 0;
                                    
                                    const isMaxedA = xpToLevel(currentSkillA) >= 99;
                                    const isMaxedB = xpToLevel(currentSkillB) >= 99;
                                    
                                    if (isMaxedA !== isMaxedB) {
                                        return isMaxedA ? 1 : -1;
                                    }
                                    
                                    return a.localeCompare(b);
                                })
                                .map((skillId) => {
                                    const skillName = skillId as keyof typeof skillsEnum;
                                    
                                    const skills = lastCharacter?.[skillName] ?? {
                                        "0": 0
                                    };
                                    const lastEpoch = Math.max(...Object.keys(skills).map(Number));
                                    const currentSkill = skills[lastEpoch] ?? 0;
                                    
                                    const currentLevel = xpToLevel(currentSkill);
                                    const isMaxed = currentLevel >= 99;
                                    const remainingXP = remainingXPToTarget(currentSkill, 99);
                                    
                                    const planOptions = getPlanOptionsForSkill(skillName);
                                    
                                    const selectedPlanId = selectedPlans[skillName as keyof typeof selectedPlans];
                                    const selectedPlanOption = planOptions.find(option => option.id === selectedPlanId) || null;
                                    
                                    const estimatedCost = !isMaxed ? estimatePlanCost(skillName, remainingXP, currentLevel) : null;
                                    const estimatedTime = !isMaxed ? estimatePlanTime(skillName, remainingXP, currentLevel) : null;
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
                                })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MaxingGuide;