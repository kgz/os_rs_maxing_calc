import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { addNewMethodToPlan } from '../../store/thunks/skills/addNewMethodToPlan';
import { Plans } from '../../plans/plans';
import type { Plan } from '../../types/plan';
import { useLastCharacter } from '../../hooks/useLastCharacter';
import { PlusCircleIcon } from 'lucide-react';

export const InsertMethodRow = ({
  currentSelectedPlan,
  skillId,
}: {
  currentSelectedPlan: Plan;
  skillId: string | undefined;
}) => {
  const dispatch = useAppDispatch();


  const characters = useAppSelector(state=>state.characterReducer);
  const character = useLastCharacter(characters);

  const handleInsert = () => {
    const valInSkills = (key: string): key is keyof typeof Plans => key in Plans;
	if (!character?.username) {
		return;
	}
    if (!skillId || !valInSkills(skillId)) {
      console.warn('Invalid skill', skillId);
      return;
    }
    void dispatch(
      addNewMethodToPlan({
        planId: currentSelectedPlan.id,
        index: Object.keys(currentSelectedPlan.methods).length,
        skill: skillId,
		characterName: character?.username, // Add character name here if available
      })
    );
  };

  return (
    <tr>
      <td colSpan={9} style={{ textAlign: 'center', padding: '10px 0' }}>
        <button
          onClick={handleInsert}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
			display: 'flex',
			alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            fontSize: '14px',
            fontWeight: 'bold',
			float: 'right',
          }}
        >
          <PlusCircleIcon size={16}/> Add New Method
        </button>
      </td>
    </tr>
  );
};