import { createSlice } from '@reduxjs/toolkit';
import { Plans } from '../../plans/plans';
import { setSelectedPlan } from '../thunks/skills/setSelectedPlan';
import type { Plan } from '../../types/plan';
import { skillsEnum } from '../../types/skillsResponse';
import { setPlanFromLevel } from '../thunks/skills/setPlanFromLevel';
import { addNewMethodToPlan } from '../thunks/skills/addNewMethodToPlan';
import { updatePlanMethod } from '../thunks/skills/updatePlanMethod';
import { removeMethodFromPlan } from '../thunks/skills/removeMethodFromPlan';


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
	},
	extraReducers: (builder) => {
		builder.addCase(setSelectedPlan.fulfilled, (state, action) => {
			const { skill, plan } = action.payload;
			state.selectedPlans[skill] = plan;
		});

		builder.addCase(setPlanFromLevel.fulfilled, (state, action) => {
			const { level, plan, methodIndex } = action.payload;
			const planIndex = state.plans.findIndex(p => p.id === plan);
			if (planIndex > -1) {
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
			} else {
				console.error('Plan not found for', plan);
			}
		});

		builder.addCase(addNewMethodToPlan.fulfilled, (state, action) => {
			const { skill, planId, index } = action.payload;
			const planIndex = state.plans.findIndex(p => p.id === planId);

			if (planIndex === -1) {
				console.error('Plan not found for', planId);
				return;
			}

			const userPlans = state.plans[planIndex];

			const availableSkillMethods = Plans[skill];
			const _firstKey = Object.keys(availableSkillMethods)[0];
			const defaultMethod = availableSkillMethods[_firstKey as keyof typeof availableSkillMethods].methods.at(0);
			if (!defaultMethod) {
				console.error('No default method found for', skill);
				return;
			}

			// Add the new method to the user's plan at the specified index
			// Only include the necessary properties without duplication
			const newMethods = [...Object.values(userPlans.methods)];
			newMethods.splice(index, 0, {
				from: defaultMethod.from,
				method: defaultMethod.method // Only include the method object, not duplicated properties
			});

			state.plans[planIndex] = {
				...userPlans,
				methods: newMethods
			};
		});

		builder.addCase(updatePlanMethod.fulfilled, (state, action) => {
			const { planId, methodIndex, method } = action.payload;
			const planIndex = state.plans.findIndex(p => p.id === planId);
			if (planIndex === -1) {
				console.error('Plan not found for', planId);
				return;
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
			const { planId, methodIndex } = action.payload;
            const planIndex = state.plans.findIndex(p => p.id === planId);
            if (planIndex === -1) {
                console.error('Plan not found for', planId);
                return;
            }

            const userPlan = state.plans[planIndex];

            if (Array.isArray(userPlan.methods)) {
                // Create a new methods array without the removed method
                const updatedMethods = userPlan.methods.filter((_, idx) => idx!== methodIndex);

                state.plans[planIndex] = {
                    ...userPlan,
                    methods: updatedMethods
                };
            }
        })

		return builder
	},
});



// Export the reducer
export const skillsReducer = skillsSlice.reducer;