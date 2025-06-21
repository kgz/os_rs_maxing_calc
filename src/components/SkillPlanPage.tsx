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
import { InsertMethodRow } from './SkillPlanPage/InsertMethodRow';
import { SkillHeader } from './SkillPlanPage/SkillHeader';


const SkillPlanPage = () => {
	const { skillId } = useParams();
	const characters = useAppSelector(state => state.characterReducer)

	const { selectedPlans, plans: _UserPlans } = useAppSelector((state) => state.skillsReducer);
	const dispatch = useAppDispatch();

	const lastCharacter = useLastCharacter(characters);
	const { currentSkillXp, currentSkillLevel } = useCurrentSkillStats(lastCharacter, skillId);
	const { templatePlans, currentSelectedPlan } = usePlans(skillId, _UserPlans, selectedPlans[lastCharacter?.username?? '']?? null);

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
		const characterPlans = selectedPlans[lastCharacter?.username?? ''] ?? {};
		if (!skillId || !characterPlans[skillId as keyof typeof characterPlans] || !planOptions.length) return null;
		return planOptions.find(option => option.id === characterPlans[skillId as keyof typeof characterPlans]) || null;
	}, [lastCharacter?.username, planOptions, selectedPlans, skillId]);

	// Handle plan selection change
	const handlePlanChange = (option: typeof planOptions[0] | null) => {
		const valInSkills = (key: string): key is keyof typeof Plans => key in Plans;
		if (!skillId || !valInSkills(skillId)) {
			console.warn('Invalid plan or skill', skillId, option?.id);
			return;
		}

		if (!option) return;

		void dispatch(setSelectedPlan({ plan: option.id, skill: skillId, characterName: lastCharacter?.username?? '' }));
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
					{currentSelectedPlan && (
						<>
							{Object.entries(currentSelectedPlan?.methods ?? {})
								.map((plan, key) => ({
									key,
									plan: plan[1],
								}))
								.sort((a, b) => a.plan?.from - b.plan?.from)
								.map((ob, index, array) => {
									const from = ob.plan.from;
									const nextMethod = array[index + 1];
									const nextFrom = nextMethod ? nextMethod.plan.from : 99;
									
									const isActive = from < currentSkillLevel && nextFrom > currentSkillLevel;
									const isLastMethod = index === array.length - 1;

									// Find the next method's level or default to 99
									const nextLevel = nextFrom;

									const currentStartXp = levelToXp(from);
									const fromXp = Math.max(currentStartXp, currentSkillXp);

									const xpToNext = remainingXPToTarget(fromXp, nextLevel);
									const itemsToNext = Math.ceil(xpToNext / ob.plan.method.xp);

									// Find the previous method's level
									const prevLevel = index > 0 ? array[index - 1].plan.from : 1;

									return (
										<MethodRow
											key={ob.key.toString()}
											index={ob.key.toString()}
											plan={ob.plan}
											from={from}
											nextLevel={nextLevel}
											prevLevel={prevLevel}
											currentSkillLevel={currentSkillLevel}
											xpToNext={xpToNext}
											itemsToNext={itemsToNext}
											currentSelectedPlan={currentSelectedPlan}
											skillId={skillId}
											isGreyedOut={from >= currentSkillLevel}
											isLastMethod={isLastMethod}
											isActive={isActive || isLastMethod}
											isFirstActiveRow={isActive && !array.slice(0, index).some(item => item.plan.from < currentSkillLevel && nextFrom > currentSkillLevel)}
										/>
									);
								})}

							{/* New row for inserting methods */}
							<InsertMethodRow
								currentSelectedPlan={currentSelectedPlan}
								skillId={skillId}
							/>
						</>
					)}
				</tbody>
			</table>
		</div>
	)
};

export default SkillPlanPage;