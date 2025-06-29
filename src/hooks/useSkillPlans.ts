import { useAppSelector, useAppDispatch } from '../store/store';
import { Plans } from '../plans/plans';
import { setSelectedPlan } from '../store/thunks/skills/setSelectedPlan';
import { useLastCharacter } from './useLastCharacter';
import { useMemo } from 'react';
import type { PlanOption } from '../components/MaxingGuide/types';

export const useSkillPlans = () => {
	const dispatch = useAppDispatch();
	const { selectedPlans, plans: userPlans } = useAppSelector((state) => state.skillsReducer);

	const characters = useAppSelector(state => state.characterReducer)

	const character = useLastCharacter(characters);
	const userSelectedPlan = useMemo(()=> {
		return selectedPlans[character?.username ?? '']?? null;
	}, [character?.username, selectedPlans])
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

		const filteredUserPlans = userPlans.filter(plan => plan.type === skillId && plan.character === character?.username).map(plan => ({
			id: plan.id,
			label: plan.label,
			plan,
			isTemplate: false
		}));

		return [...templatePlanOptions, ...filteredUserPlans];
	};

	const handlePlanChange = (skillId: string, option: PlanOption | null) => {
		const valInSkills = (key: string): key is keyof typeof Plans => key in Plans;
		if (!valInSkills(skillId)) {
			console.warn('Invalid skill', skillId);
			return;
		}

		if (!option) return;

		void dispatch(setSelectedPlan({ plan: option.id, skill: skillId, characterName: character?.username ?? '' }));
	};

	return {
		userSelectedPlan,
		getPlanOptionsForSkill,
		handlePlanChange
	};
};