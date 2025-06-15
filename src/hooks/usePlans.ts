import { useMemo } from "react";
import type { Plan } from "../types/plan";
import { Plans } from "../plans/plans";

export const usePlans = (skillId: string | undefined, userPlans: Plan[], selectedPlans: Record<string, string>) => {
  const templatePlans = useMemo(() => {
	return Plans[skillId as keyof typeof Plans] ?? [null];
  }, [skillId]);

  const currentSelectedPlan = useMemo(() => {
	const keyExists = (key: string): key is keyof typeof selectedPlans => key in selectedPlans;
	if (!skillId || !keyExists(skillId)) {
	  console.warn('No skill data found for', skillId);
	  return null;
	}

	const plan = selectedPlans[skillId] ?? null;
	if (!plan) {
	  console.warn('No plan found for', skillId);
	  return null;
	}

	// merge user plans and template plans
	const userPlan = userPlans.filter(plan => plan.id === selectedPlans[skillId]).at(0);
	if (!userPlan) {
	  return templatePlans[plan as keyof typeof templatePlans];
	}
	return userPlan;
  }, [templatePlans, selectedPlans, skillId, userPlans]);

  return { templatePlans, currentSelectedPlan };
};
