import { useCallback } from 'react';
import { useAppSelector } from '../store/store';
import { Plans } from '../plans/plans';
import { levelToXp, remainingXPToTarget, xpToLevel } from '../utils/xpCalculations';
import { useItems } from './useItems';
import { useCharacterStats } from './useCharacterStats';
import type { PlanMethod } from '../types/plan';
import { skillsEnum } from '../types/skillsResponse';

export const usePlanEstimations = () => {
	const { getItemPrice } = useItems();
	const { lastCharacter } = useCharacterStats();
	const { selectedPlans, plans: userPlans } = useAppSelector((state) => state.skillsReducer);

	const estimatePlanCost = useCallback((skillId: string, remainingXP: number, currentLevel: number) => {
		const _selectedPlanId = selectedPlans[lastCharacter?.username ?? ''];
		if (!_selectedPlanId) {
			return null;
        }
		const selectedPlanId = _selectedPlanId[skillId as keyof typeof _selectedPlanId];

		if (!selectedPlanId) {
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
			return null;
		}

		let totalCost = 0;
		let remainingXpToCalculate = remainingXP;

		const _methodsArray: PlanMethod[] = Array.isArray(selectedPlan.methods)
			? selectedPlan.methods
			: Object.values(selectedPlan.methods);

		const methodsArray = [..._methodsArray];

		let sortedMethods = methodsArray.sort((a, b) => Number(a.from) - Number(b.from));
		sortedMethods = sortedMethods.filter((_, i) => {
			if (sortedMethods[i + 1] && sortedMethods[i + 1].from <= currentLevel) return false;
			return true;
		});

		if (sortedMethods.length === 0) {
			return null;
		}

		for (const method of sortedMethods) {
			if (remainingXpToCalculate <= 0) break;
			const methodObj = method.method;
			if (!methodObj) {
				console.warn('Invalid method', method);
			}
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
				const amount = typeof item.amount === 'function'? item.amount(method.from, nextLevel) : item.amount;
				const cost = getItemPrice(item.item?.id) ?? 0;
				costPerAction += cost * amount;
			});

			output.forEach(item => {
				const cost = getItemPrice(item.item?.id) ?? 0;
				const amount = typeof item.amount === 'function'? item.amount(method.from, nextLevel) : item.amount;
				costPerAction -= cost * amount;
			});

			if (xpPerAction <= 0) continue;

			totalCost += actionsNeeded * costPerAction;

			remainingXpToCalculate -= xpForThisMethod;
		}

		return totalCost;
	}, [getItemPrice, selectedPlans, userPlans, lastCharacter]);

	const estimatePlanTime = useCallback((skillId: string, remainingXP: number, currentLevel: number) => {
		const _selectedPlanId = selectedPlans[lastCharacter?.username ?? ''];
		if (!_selectedPlanId) {
			return null;
        }
		const selectedPlanId = _selectedPlanId[skillId as keyof typeof _selectedPlanId];

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
			if (sortedMethods[i + 1] && sortedMethods[i + 1].from <= currentLevel) return false;
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

	const calculateOverallStats = useCallback(() => {
		if (!lastCharacter) return { totalRemainingXP: 0, totalEstimatedCost: 0, totalEstimatedTime: 0 };

		let totalRemainingXP = 0;
		let totalEstimatedCost = 0;
		let totalEstimatedTime = 0;

		Object.keys(skillsEnum).forEach((skillId) => {
			const skillName = skillId as keyof typeof skillsEnum;
			const skills = lastCharacter[skillName] ?? { "0": 0 };
			const lastEpoch = Math.max(...Object.keys(skills).map(Number));
			const currentSkill = skills[lastEpoch] ?? 0;

			const currentLevel = xpToLevel(currentSkill);
			const isMaxed = currentLevel >= 99;

			if (!isMaxed) {
				const remainingXP = remainingXPToTarget(currentSkill, 99);
				totalRemainingXP += remainingXP;

				const estimatedCost = estimatePlanCost(skillName, remainingXP, currentLevel);
				if (estimatedCost !== null) {
					totalEstimatedCost += estimatedCost;
				}

				const estimatedTime = estimatePlanTime(skillName, remainingXP, currentLevel);
				if (estimatedTime !== null) {
					totalEstimatedTime += estimatedTime;
				}
			}
		});

		return { totalRemainingXP, totalEstimatedCost, totalEstimatedTime };
	}, [lastCharacter, estimatePlanCost, estimatePlanTime]);

	return {
		estimatePlanCost,
		estimatePlanTime,
		calculateOverallStats
	};
};