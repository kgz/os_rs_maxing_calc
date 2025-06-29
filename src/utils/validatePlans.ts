import { useAppDispatch, useAppSelector } from '../store/store';
import { useEffect, useState } from 'react';
import { SkillMethods } from '../methods/index';
import { updatePlanMethod } from '../store/thunks/skills/updatePlanMethod';

// Helper function for deep equality comparison
const isEqual = (obj1: unknown, obj2: unknown): boolean => {
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
  const keys1 = Object.keys(obj1 as object);
  const keys2 = Object.keys(obj2 as object);
  
  if (keys1.length !== keys2.length) return false;
  
  return keys1.every(key => {
    // Skip comparing functions
    const val1 = (obj1 as Record<string, unknown>)[key];
    const val2 = (obj2 as Record<string, unknown>)[key];
    
    if (typeof val1 === 'function' && typeof val2 === 'function') return true;
    return isEqual(val1, val2);
  });
};

export const useValidateUserPlans = () => {
    const plans = useAppSelector(state=>state.skillsReducer.plans)
    const dispatch = useAppDispatch();
    const [processedMethods, setProcessedMethods] = useState<Set<string>>(new Set());

    useEffect(()=> {
        const methodsToProcess = new Set<string>();
        
        // First pass: identify all methods that need updating
        for(const [, plan] of Object.entries(plans)) {
            const type = plan.type;
            plan.methods.forEach(({method}, methodIndex) => {
                
                const skillMethods = SkillMethods[type as keyof typeof SkillMethods];
                if (!skillMethods) {
                    console.warn(`Skill methods not found for skill: ${type}`);
                    return;
                }
                
                const originalMethod = Object.values(skillMethods).find(m => m.id === method.id);
				
                
                // const methodIndex = plan.methods.findIndex(m => m.method.id === method.id);
                if (methodIndex === -1 || !originalMethod) {
					console.warn(`Method not found in original plan: ${method.id} for skill: ${type}`);
					return
				};

				const methodId = `${plan.id}-${method.id}-${methodIndex}`;
                if (processedMethods.has(methodId)) return; // Skip already processed methods

                
                if (!isEqual(method, originalMethod)) {
                    methodsToProcess.add(methodId);
                    
                    dispatch(updatePlanMethod({
                        planId: plan.id,
                        methodIndex: methodIndex,
                        method: originalMethod,
                        skill: type,
                        characterName: plan.character
                    }));
					return
                }
            });
        }
        // Update processed methods
        if (methodsToProcess.size > 0) {
            setProcessedMethods(prev => new Set([...prev, ...methodsToProcess]));
        }
    }, [dispatch, plans, processedMethods]);
  
};