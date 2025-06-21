import { createSlice, current, type PayloadAction } from '@reduxjs/toolkit';
import { Plans } from '../../plans/plans';
import { setSelectedPlan } from '../thunks/skills/setSelectedPlan';
import type { Plan } from '../../types/plan';
import { skillsEnum } from '../../types/skillsResponse';
import { setPlanFromLevel } from '../thunks/skills/setPlanFromLevel';
import { addNewMethodToPlan } from '../thunks/skills/addNewMethodToPlan';
import { updatePlanMethod } from '../thunks/skills/updatePlanMethod';
import { removeMethodFromPlan } from '../thunks/skills/removeMethodFromPlan';
import { v4 } from 'uuid';

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
    [username: string]: {[K in keyof TPlanKeys]?: string}//keyof typeof Plans[K]
}


type InitialState = {
    selectedPlans: TPlan,
    plans: (Plan & { type: keyof typeof skillsEnum, id: string, character: string })[]
}


const initialState: InitialState = {
    selectedPlans: {},
    plans: []
}

// Create the skills slice
const skillsSlice = createSlice({
    name: 'skills',
    initialState,
    reducers: {
        // Add a new reducer to handle adding custom plans
        addCustomPlan(state, action: PayloadAction<Plan & { type: keyof typeof skillsEnum, id: string, character: string }>) {
            state.plans.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setSelectedPlan.fulfilled, (state, action) => {
            const { skill, plan, characterName } = action.payload;

            // Initialize the character entry if it doesn't exist
            if (!state.selectedPlans[characterName]) {
                state.selectedPlans[characterName] = {};
            }

            // Check if the plan is a template plan or a custom plan
            const isCustomPlan = state.plans.some(p => p.id === plan);
            const isTemplatePlan = isValidPlan(skill, plan);

            // If it's a template plan and not already in user plans, just set it as selected
            // without creating a custom copy
            if (isTemplatePlan && !isCustomPlan) {
                state.selectedPlans[characterName][skill] = plan;
            } else {
                // For custom plans, just set it as selected
                state.selectedPlans[characterName][skill] = plan;
            }
        });

        builder.addCase(setPlanFromLevel.fulfilled, (state, action) => {
            const { level, plan, methodIndex, skill, characterName } = action.payload;
            const planIndex = state.plans.findIndex(p => p.id === plan);

            // Initialize the character entry if it doesn't exist
            if (!state.selectedPlans[characterName]) {
                state.selectedPlans[characterName] = {};
            }

            // If plan doesn't exist in user plans but exists in template plans, create a copy
            if (planIndex === -1) {
                // Check if skill is a valid key in Plans
                if (!isValidSkill(skill)) {
                    console.error(`No plans found for skill: ${skill}`);
                    return;
                }

                const skillPlans = Plans[skill];

				const templatePlan = Object.values(skillPlans).find(p => p.id === plan) as Plan|null;
                if (!templatePlan) {
                    console.error(`Template plan not found: ${plan} for skill: ${skill}`);
                    return;
                }

                // Create a new custom plan based on the template
                const newPlan = {
                    ...templatePlan,
                    id: v4(),
                    label: `${templatePlan.label} (Custom)`,
                    type: skill,
                    character: characterName
                };

                // Add the new plan to user plans
                state.plans.push(newPlan);

                // Update the selected plan to point to the new custom plan
                state.selectedPlans[characterName][skill] = newPlan.id;

                // Update planIndex to point to the newly created plan
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
            const { skill, planId, index, characterName } = action.payload;
            let planIndex = state.plans.findIndex(p => p.id === planId);

            // Initialize the character entry if it doesn't exist
            if (!state.selectedPlans[characterName]) {
                state.selectedPlans[characterName] = {};
            }
			
            // If plan doesn't exist in user plans but exists in template plans, create a copy
            if (planIndex === -1) {
                // Check if skill is a valid key in Plans
                if (!isValidSkill(skill)) {
                    console.error(`No plans found for skill: ${skill}`);
                    return;
                }

                const skillPlans = Plans[skill];

				const templatePlan = Object.values(skillPlans).find(p => p.id === planId) as Plan|null;
                if (!templatePlan) {
                    console.error(`Template plan not found: ${planId} for skill: ${skill}`);
                    return;
                }

                // Create a new custom plan based on the template
                const newPlan = {
                    ...templatePlan,
                    id: v4(),
                    label: `${templatePlan.label} (Custom)`,
                    type: skill,
                    character: characterName
                };

                // Add the new plan to user plans
                state.plans.push(newPlan);

                // Update the selected plan to point to the new custom plan
                state.selectedPlans[characterName][skill] = newPlan.id;

                // Update planIndex to point to the newly created plan
                planIndex = state.plans.length - 1;

				
            }

            const userPlans = state.plans[planIndex];

			const _lastMethod = JSON.parse(JSON.stringify(userPlans.methods));
			const lastMethod = Object.values(_lastMethod).sort((a, b) => b.from - a.from).at(0);
			console.log(Object.values(_lastMethod).sort((a, b) => b.from - a.from))

			// if (!defaultMethod) {
			// 	throw new Error('No default method found for ' + skill);
			// 	//TODO, need to handle this error condition
			// }

            // Add the new method to the user's plan at the specified index
            const newMethods = [...Object.values(userPlans.methods), lastMethod];

			
            state.plans[planIndex] = {
				...userPlans,
                methods: newMethods
            };
			console.log(current(state).plans)
        });

        builder.addCase(updatePlanMethod.fulfilled, (state, action) => {
            const { planId, methodIndex, method, skill, characterName } = action.payload;
            console.log({methodIndex})
            let planIndex = state.plans.findIndex(p => p.id === planId);
            console.log({ planIndex }, current(state).plans);

            // Initialize the character entry if it doesn't exist
            if (!state.selectedPlans[characterName]) {
                state.selectedPlans[characterName] = {};
            }

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
                    id: v4(),
                    label: `${templatePlan.label} (Custom)`,
                    type: skill,
                    character: characterName
                };

                // Add the new plan to user plans
                state.plans.push(newPlan);

                // Update the selected plan to point to the new custom plan
                state.selectedPlans[characterName][skill] = newPlan.id;

                // Update planIndex to point to the newly created plan
                planIndex = state.plans.length - 1;
            }

            const userPlan = state.plans[planIndex];

            if (Array.isArray(userPlan.methods)) {
                // Replace the direct assignment with a more explicit update
                if (methodIndex > -1 && methodIndex < state.plans[planIndex].methods.length) {
                    // Create a new method object to ensure proper update
                    const updatedMethod = {
                        ...state.plans[planIndex].methods[methodIndex],
                        method: method
                    };
                    
                    // Create a new methods array
                    const updatedMethods = [...state.plans[planIndex].methods];
                    updatedMethods[methodIndex] = updatedMethod;
                    
                    // Update the entire methods array
                    state.plans[planIndex] = {
                        ...state.plans[planIndex],
                        methods: updatedMethods
                    };
                    
                    console.log('Updated methods with new approach:', current(state).plans[planIndex].methods, methodIndex, method);
                } else {
                    console.error('Method index out of bounds:', methodIndex, 'length:', state.plans[planIndex].methods.length);
                }
            } else {
                console.error('No methods found in plan', userPlan);
            }
        });

        builder.addCase(removeMethodFromPlan.fulfilled, (state, action) => {
            const { planId, methodIndex, skill, characterName } = action.payload;
            let planIndex = state.plans.findIndex(p => p.id === planId);

            // Initialize the character entry if it doesn't exist
            if (!state.selectedPlans[characterName]) {
                state.selectedPlans[characterName] = {};
            }

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
                    id: v4(),
                    label: `${templatePlan.label} (Custom)`,
                    type: skill,
                    character: characterName
                };

                // Add the new plan to user plans
                state.plans.push(newPlan);

                // Update the selected plan to point to the new custom plan
                state.selectedPlans[characterName][skill] = newPlan.id;

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