import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { Plans } from '../../plans/plans';
import { setSelectedPlan } from '../thunks/skills/setSelectedPlan';
import type { Plan } from '../../types/plan';
import { skillsEnum } from '../../types/skillsResponse';
import { setPlanFromLevel } from '../thunks/skills/setPlanFromLevel';
import { addNewMethodToPlan } from '../thunks/skills/addNewMethodToPlan';
import { updatePlanMethod } from '../thunks/skills/updatePlanMethod';
import { removeMethodFromPlan } from '../thunks/skills/removeMethodFromPlan';

function isKeyOfObject<T extends object>(key: string | number | symbol, obj: T): key is keyof T {
  return key in obj;
}

function isValidSkill(skill: string): skill is keyof typeof Plans {
  return skill in Plans;
}

// Alternative approach without type predicate
function isValidPlan(skill: keyof typeof Plans, plan: string): boolean {
  return plan in Plans[skill];
}

type TPlanKeys =
	{
		[K in keyof typeof Plans]?: keyof typeof Plans[K]
	}

type TPlan = {
	[K in keyof TPlanKeys]?: string//keyof typeof Plans[K]
}


type InitialState = {
	selectedPlans: TPlan,
	plans: (Plan & { type: keyof typeof skillsEnum, id: string })[]
}


const initialState: InitialState = {
	selectedPlans: {
		Prayer: '234234-234234-234'
	},
	plans: [{
		id: '234234-234234-234',
		label: 'Default Plan',
		methods: [
			...Plans['Prayer'].prayer_medium_1.methods,
		],
		type: "Prayer"
	}]

}

// Create the skills slice
const skillsSlice = createSlice({
	name: 'skills',
	initialState,
	reducers: {
		// Add a new reducer to handle adding custom plans
		addCustomPlan(state, action: PayloadAction<Plan & { type: keyof typeof skillsEnum, id: string }>) {
			state.plans.push(action.payload);
		}
	},
	extraReducers: (builder) => {
		builder.addCase(setSelectedPlan.fulfilled, (state, action) => {
		  const { skill, plan } = action.payload;
		  
		  // Check if the plan is a template plan or a custom plan
		  const isCustomPlan = state.plans.some(p => p.id === plan);
		  const isTemplatePlan = isValidPlan(skill, plan);
		  
		  // If it's a template plan and not already in user plans, just set it as selected
		  // without creating a custom copy
		  if (isTemplatePlan && !isCustomPlan) {
		    state.selectedPlans[skill] = plan;
		  } else {
		    // For custom plans, just set it as selected
		    state.selectedPlans[skill] = plan;
		  }
		});

		builder.addCase(setPlanFromLevel.fulfilled, (state, action) => {
			const { level, plan, methodIndex, skill } = action.payload;
			const planIndex = state.plans.findIndex(p => p.id === plan);
			
			// If plan doesn't exist in user plans but exists in template plans, create a copy
			if (planIndex === -1) {
				// Check if skill is a valid key in Plans
				if (!isValidSkill(skill)) {
					console.error(`No plans found for skill: ${skill}`);
					return;
				}
				
				const skillPlans = Plans[skill];

				if (!isValidPlan(skill, plan)) {
				  console.error(`Template plan not found: ${plan} for skill: ${skill}`);
				  return;
				}

				// Check if plan is a valid key in skillPlans
				if (!isKeyOfObject(plan, skillPlans)) {
				  console.error(`Invalid plan key: ${plan} for skill: ${skill}`);
				  return;
				}

				// Now TypeScript knows plan is a valid key
				const templatePlan = skillPlans[plan] as Plan;

				// Create a new custom plan based on the template
				const newPlan = {
				  ...templatePlan,
				  id: `${plan}-custom`,
				  label: `${templatePlan.label} (Custom)`,
				  type: skill
				};
				
				// Add the new plan to user plans
				state.plans.push(newPlan);
				
				// Update the selected plan to point to the new custom plan
				state.selectedPlans[skill] = newPlan.id;
				
				// Now update the level in the newly created plan
				const newPlanIndex = state.plans.length - 1;
				const method = state.plans[newPlanIndex].methods[methodIndex];
				
				const plansBefore = Array.isArray(state.plans[newPlanIndex].methods) ?
					state.plans[newPlanIndex].methods.slice(0, methodIndex) : [];
				
				const plansAfter = Array.isArray(state.plans[newPlanIndex].methods) ?
					state.plans[newPlanIndex].methods.slice(methodIndex + 1) : [];
				
				state.plans[newPlanIndex] = {
					...state.plans[newPlanIndex],
					methods: [
						...plansBefore,
						{ ...method, from: level },
						...plansAfter
					]
				};
			} else {
				// Original code for existing user plans
				const currentPlan = state.plans[planIndex];
				const method = currentPlan.methods[methodIndex];

				// Create a new array for plans instead of using slice on the draft
				const plansBefore = Array.isArray(currentPlan.methods) ?
					currentPlan.methods.slice(0, methodIndex) : [];

				const plansAfter = Array.isArray(currentPlan.methods) ?
					currentPlan.methods.slice(methodIndex + 1) : [];

				// Update the state directly without creating intermediate objects
				state.plans[planIndex] = {
					...currentPlan,
					methods: [
						...plansBefore,
						{ ...method, from: level },
						...plansAfter
					]
				};
			}
		});

  builder.addCase(addNewMethodToPlan.fulfilled, (state, action) => {
    const { skill, planId, index } = action.payload;
    let planIndex = state.plans.findIndex(p => p.id === planId);
  
    // If plan doesn't exist in user plans but exists in template plans, create a copy
    if (planIndex === -1) {
      // Check if skill is a valid key in Plans
      if (!isValidSkill(skill)) {
        console.error(`No plans found for skill: ${skill}`);
        return;
      }
      
      const skillPlans = Plans[skill];
  
      if (!isValidPlan(skill, planId)) {
        console.error(`Template plan not found: ${planId} for skill: ${skill}`);
        return;
      }
  
      // Check if planId is a valid key in skillPlans
      if (!isKeyOfObject(planId, skillPlans)) {
        console.error(`Invalid plan key: ${planId} for skill: ${skill}`);
        return;
      }
  
      // Now TypeScript knows planId is a valid key
      const templatePlan = skillPlans[planId] as Plan;
  
      // Create a new custom plan based on the template
      const newPlan = {
        ...templatePlan,
        id: `${planId}-custom`,
        label: `${templatePlan.label} (Custom)`,
        type: skill
      };
      
      // Add the new plan to user plans
      state.plans.push(newPlan);
      
      // Update the selected plan to point to the new custom plan
      state.selectedPlans[skill] = newPlan.id;
      
      // Update planIndex to point to the newly created plan
      planIndex = state.plans.length - 1;
    }
  
    const userPlans = state.plans[planIndex];
  
    const availableSkillMethods = Plans[skill];

    // Get the first key and ensure it exists
    const _firstKey = Object.keys(availableSkillMethods)[0];
    if (!_firstKey || !(_firstKey in availableSkillMethods)) {
      console.error('No default method found for', skill);
      return;
    }

    // Get the plan using the key
    const firstPlan = availableSkillMethods[_firstKey as keyof typeof availableSkillMethods];

    // Use type assertion to help TypeScript understand the structure
    if (!firstPlan || !('methods' in firstPlan) || !Array.isArray((firstPlan as Plan).methods) || (firstPlan as Plan).methods.length === 0) {
      console.error('No default method found for', skill);
      return;
    }

    // Now we can safely access the first method with proper type assertion
    const defaultMethod = (firstPlan as Plan).methods[0];
  
    // Add the new method to the user's plan at the specified index
    const newMethods = [...Object.values(userPlans.methods)];
    newMethods.splice(index, 0, {
      from: defaultMethod.from,
      method: defaultMethod.method
    });
  
    state.plans[planIndex] = {
      ...userPlans,
      methods: newMethods
    };
  });

		builder.addCase(updatePlanMethod.fulfilled, (state, action) => {
			const { planId, methodIndex, method, skill } = action.payload;
			let planIndex = state.plans.findIndex(p => p.id === planId);
			
			// If plan doesn't exist in user plans but exists in template plans, create a copy
			if (planIndex === -1) {
				// Check if skill is a valid key in Plans
				if (!skill || !isValidSkill(skill)) {
					console.error(`No plans found for skill: ${skill}`);
					return;
				}
				
				const skillPlans = Plans[skill];

				// For this case, we need to find the plan by ID since we're using Object.values
				const templatePlan = Object.values(skillPlans).find(p => p.id === planId) as Plan | undefined;
				if (!templatePlan) {
					console.error(`Template plan not found: ${planId} for skill: ${skill}`);
					return;
				}
				
				// Create a new custom plan based on the template
				const newPlan = {
				  ...templatePlan,
				  id: `${planId}-custom`,
				  label: `${templatePlan.label} (Custom)`,
				  type: skill
				};
				
				// Add the new plan to user plans
				state.plans.push(newPlan);
				
				// Update the selected plan to point to the new custom plan
				state.selectedPlans[skill] = newPlan.id;
				
				// Update planIndex to point to the newly created plan
				planIndex = state.plans.length - 1;
			}

			const userPlan = state.plans[planIndex];

			if (Array.isArray(userPlan.methods)) {
				// Create a new methods array with the updated method
				const updatedMethods = userPlan.methods.map((item, idx) =>
					idx === methodIndex ? { ...item, method } : item
				);

				state.plans[planIndex] = {
					...userPlan,
					methods: updatedMethods
				};
			}
		});

		builder.addCase(removeMethodFromPlan.fulfilled, (state, action) => {
			const { planId, methodIndex, skill } = action.payload;
			let planIndex = state.plans.findIndex(p => p.id === planId);
			
			// If plan doesn't exist in user plans but exists in template plans, create a copy
			if (planIndex === -1) {
				// Check if skill is a valid key in Plans
				if (!skill || !isValidSkill(skill)) {
					console.error(`No plans found for skill: ${skill}`);
					return;
				}
				
				const skillPlans = Plans[skill];

				if (!isValidPlan(skill, planId)) {
				  console.error(`Template plan not found: ${planId} for skill: ${skill}`);
				  return;
				}

				// Check if planId is a valid key in skillPlans
				if (!isKeyOfObject(planId, skillPlans)) {
				  console.error(`Invalid plan key: ${planId} for skill: ${skill}`);
				  return;
				}

				// Now TypeScript knows planId is a valid key
				const templatePlan = skillPlans[planId] as Plan;

				// Create a new custom plan based on the template
				const newPlan = {
				  ...templatePlan,
				  id: `${planId}-custom`,
				  label: `${templatePlan.label} (Custom)`,
				  type: skill
				};
				
				// Add the new plan to user plans
				state.plans.push(newPlan);
				
				// Update the selected plan to point to the new custom plan
				state.selectedPlans[skill] = newPlan.id;
				
				// Update planIndex to point to the newly created plan
				planIndex = state.plans.length - 1;
			}

			const userPlan = state.plans[planIndex];

			if (Array.isArray(userPlan.methods)) {
				// Create a new methods array without the removed method
				const updatedMethods = userPlan.methods.filter((_, idx) => idx !== methodIndex);

				state.plans[planIndex] = {
					...userPlan,
					methods: updatedMethods
				};
			}
		});

		return builder;
	},
});



// Export the reducer
export const { addCustomPlan } = skillsSlice.actions;
export const skillsReducer = skillsSlice.reducer;