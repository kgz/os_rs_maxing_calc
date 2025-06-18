import { useAppSelector, useAppDispatch } from '../store/store';
import { Plans } from '../plans/plans';
import { setSelectedPlan } from '../store/thunks/skills/setSelectedPlan';

export const useSkillPlans = () => {
  const dispatch = useAppDispatch();
  const { selectedPlans, plans: userPlans } = useAppSelector((state) => state.skillsReducer);

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

  return {
    selectedPlans,
    getPlanOptionsForSkill,
    handlePlanChange
  };
};