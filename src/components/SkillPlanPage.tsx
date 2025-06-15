import { useParams } from 'react-router-dom';
import style from './SkillPlanPage.module.css';
import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { Plans } from '../plans/plans';
import { levelToXp, remainingXPToTarget } from '../utils/xpCalculations';
import { setSelectedPlan } from '../store/thunks/skills/setSelectedPlan';
import { usePlans } from '../hooks/usePlans';
import { useCurrentSkillStats } from '../hooks/usecurrentSkillStats';
import { useLastCharacter } from '../hooks/useLastCharacter';
import { MethodRow } from './SkillPlanPage/MethodRow';
import { TableHeader } from './SkillPlanPage/TableHeader';
import { AddMethodButtonRow } from './SkillPlanPage/AddMethodButton';
import { SkillHeader } from './SkillPlanPage/SkillHeader';


const SkillPlanPage = () => {
	const { skillId } = useParams();
	const characters = useAppSelector(state => state.characterReducer)

	const { selectedPlans, plans: _UserPlans } = useAppSelector((state) => state.skillsReducer);
	const dispatch = useAppDispatch();

	const lastCharacter = useLastCharacter(characters);
	const { currentSkillXp, currentSkillLevel } = useCurrentSkillStats(lastCharacter, skillId);
	const { templatePlans, currentSelectedPlan } = usePlans(skillId, _UserPlans, selectedPlans);

	// Create an array of plan options for the CustomSelect component
	const planOptions = useMemo(() => {
		if (!skillId) return [];

		// Combine template plans and user plans
		const templatePlanOptions = Object.entries(templatePlans || {}).map(([key, plan]) => ({
			id: key,
			label: plan?.label || "Unknown",
			plan,
			isTemplate: true
		}));

		const userPlanOptions = _UserPlans.filter(plan=>{
			return plan.type === skillId
		}).map(plan => ({
			id: plan.id,
			label: plan.label,
			plan,
			isTemplate: false
		}));

		return [...templatePlanOptions, ...userPlanOptions];
	}, [templatePlans, _UserPlans, skillId]);

	// Find the currently selected plan option
	const selectedPlanOption = useMemo(() => {
		if (!skillId || !selectedPlans[skillId as keyof typeof selectedPlans] || !planOptions.length) return null;
		return planOptions.find(option => option.id === selectedPlans[skillId as keyof typeof selectedPlans]) || null;
	}, [planOptions, selectedPlans, skillId]);

	// Handle plan selection change
	const handlePlanChange = (option: typeof planOptions[0] | null) => {
		const valInSkills = (key: string): key is keyof typeof Plans => key in Plans;
		if (!skillId || !valInSkills(skillId)) {
			console.warn('Invalid plan or skill', skillId, option?.id);
			return;
		}

		if (!option) return;

		void dispatch(setSelectedPlan({ plan: option.id, skill: skillId }));
	};

	return (
		<div className={style.container}>
			{/* Redesigned Skill Header with Plan Selector */}
			<SkillHeader
				skillId={skillId}
				lastCharacter={lastCharacter}
				currentSkillLevel={currentSkillLevel}
				planOptions={planOptions}
				selectedPlanOption={selectedPlanOption}
				handlePlanChange={handlePlanChange}
			/>

			<table style={{ background: '#222', padding: 10, width: '100%', marginTop: '20px' }}>
				<TableHeader />
				<tbody>

					{
						currentSelectedPlan && (
							<>
								{
									Object.entries(currentSelectedPlan?.methods ?? {})
										.sort((a, b) => a[1].from - b[1].from) // Sort by level requirement
										.filter(([, plan]) => {
											// Show methods that are applicable to the player's current level
											// This means either:
											// 1. The method's level requirement is exactly at the player's level
											// 2. The method's level requirement is below the player's level, but it's the highest such method
											// 3. The method's level requirement is above the player's level, but it's the lowest such method

											if (plan.from === currentSkillLevel) {
												// Exact match for player's level
												return true;
											}

											// Find the highest method level that's below or equal to the player's level
											const highestBelowOrEqual = Math.max(
												...Object.values(currentSelectedPlan.methods)
													.filter(p => p.from <= currentSkillLevel)
													.map(p => p.from)
											);

											// Find the lowest method level that's above the player's level
											const lowestAbove = Math.min(
												...Object.values(currentSelectedPlan.methods)
													.filter(p => p.from > currentSkillLevel)
													.map(p => p.from),
												99 // Default to 99 if no methods above
											);

											// Show this method if it's either the highest below or the lowest above
											return plan.from === highestBelowOrEqual || plan.from === lowestAbove;
										})
										.map(([key, plan]) => {
											const from = Math.max(plan.from, currentSkillLevel);

											// Find the next method's level or default to 99
											const nextLevel = (
												Object.values(currentSelectedPlan.methods)
													.filter(p => p?.from > from)
													.sort((a, b) => a.from - b.from)[0] || { from: 99 }
											).from;

											const currentStartXp = levelToXp(from);
											const fromXp = Math.max(currentStartXp, currentSkillXp);

											const xpToNext = remainingXPToTarget(fromXp, nextLevel);
											const itemsToNext = Math.ceil(xpToNext / plan.method.xp);

											// Find the previous method's level
											const prevLevel = (
												Object.values(currentSelectedPlan.methods)
													.filter(p => p?.from < from)
													.sort((a, b) => b.from - a.from)[0] || { from: 0 }
											).from;

											return (
												<MethodRow
													key={key}
													plan={plan}
													from={from}
													nextLevel={nextLevel}
													prevLevel={prevLevel}
													currentSkillLevel={currentSkillLevel}
													xpToNext={xpToNext}
													itemsToNext={itemsToNext}
													currentSelectedPlan={currentSelectedPlan}
													skillId={skillId}
												/>
											)
										})
								}

								{/* Add new method at the end of the list */}
								<AddMethodButtonRow
									currentSelectedPlan={currentSelectedPlan}
									skillId={skillId}
								/>
							</>
						)
					}

				</tbody>
			</table>

		</div>
	)
};

export default SkillPlanPage;