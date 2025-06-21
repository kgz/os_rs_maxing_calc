import { Plans } from '../plans/plans';
import { useAppDispatch, useAppSelector } from '../store/store';
import { useEffect, useState } from 'react';
import type { Method } from '../types/method';
import { SkillMethods } from '../methods/methods';
import { updatePlanMethod } from '../store/thunks/skills/updatePlanMethod';

// Helper function for deep equality comparison
const isEqual = (obj1: any, obj2: any): boolean => {
  // Handle primitive types and null/undefined
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
  
  // Handle arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    return obj1.every((val, idx) => isEqual(val, obj2[idx]));
  }
  
  // Handle objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  return keys1.every(key => {
    // Skip comparing functions
    if (typeof obj1[key] === 'function' && typeof obj2[key] === 'function') return true;
    return isEqual(obj1[key], obj2[key]);
  });
};

export const useValidateUserPlans = () => {
	const plans = useAppSelector(state=>state.skillsReducer.plans)
	const dispatch = useAppDispatch();
	const [safetyCount, setSafetyCount] = useState(20);

	return useEffect(()=> {
		if (safetyCount <= 0) {
			console.warn('Safety count reached. Skipping fetching plan options.');
			return;
		}
		setSafetyCount(safetyCount - 1);
		// Object.entries(plans).forEach(([name, character]) => {
		// 	console.log({name, character})
		// });
		for(const [, plan] of Object.entries(plans)) {
			const type = plan.type;
			plan.methods.forEach(({method}) => {
				const {items, returns} = method;
				// const origionalMethod = Object.values(Plans[type as keyof typeof Plans])
				// // can we group

				let originalMethod = SkillMethods[type as keyof typeof SkillMethods]
				originalMethod = Object.values(originalMethod).find(m => m.id === method.id)
				// console.log({method, origionalMethod, id: method.id})

				const methodIndex = plan.methods.findIndex(m => m.method.id === method.id);
				if (methodIndex === -1) {
                    console.error(`Method not found for`, method);
                    return;
                }
				if (!isEqual(method, originalMethod)) {
					console.error(`Method mismatch for`, method, originalMethod);
					// issue here not updating method...
					console.log('Updating method in plan', {originalMethod});
					void dispatch(updatePlanMethod({
						planId: plan.id,
						methodIndex: methodIndex,
						method: originalMethod,
						skill: type,
						characterName: plan.character
					}));
					return;

                }
				// items.forEach(item => {
				// 	//...
				// });

				// returns.forEach(returnItem => {
                //     console.log(returnItem)
                // });
			});
		}
	}, [dispatch, plans, safetyCount]);
  
};