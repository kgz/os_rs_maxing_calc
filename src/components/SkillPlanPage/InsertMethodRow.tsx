import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { addNewMethodToPlan } from '../../store/thunks/skills/addNewMethodToPlan';
import { Plans } from '../../plans/plans';
import type { Plan } from '../../types/plan';
import { useLastCharacter } from '../../hooks/useLastCharacter';
import { Edit, PlusCircleIcon, Trash2 } from 'lucide-react';
import { RenameModal } from './RenameModal';
import { deletePlan } from '../../store/thunks/skills/deletePlan';
import styles from '../SkillPlanPage.module.css';

export const InsertMethodRow = ({
	currentSelectedPlan,
	skillId,
}: {
	currentSelectedPlan: Plan;
	skillId: string | undefined;
}) => {
	const dispatch = useAppDispatch();
	const characters = useAppSelector(state => state.characterReducer);
	const character = useLastCharacter(characters);
	const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const handleAddMethod = () => {
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
				characterName: character?.username,
			})
		);
	};

	const handleDeletePlan = () => {
		if (!character?.username) {
			return;
		}
		
		void dispatch(
			deletePlan({
				planId: currentSelectedPlan.id,
				characterName: character.username,
			})
		);
		
		setIsDeleteModalOpen(false);
	};

	// Check if this is a custom plan (not a template)
	const isCustomPlan = currentSelectedPlan && 'character' in currentSelectedPlan;

	return (
		<tr>
			<td colSpan={9} style={{ textAlign: 'center', padding: '10px 0' }}>
				<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
					<button
						onClick={() => handleAddMethod()}
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
						}}
					>
						<PlusCircleIcon size={16} /> Add New Method
					</button>
					
					{isCustomPlan && (
						<>
							<button
								onClick={() => setIsRenameModalOpen(true)}
								style={{
									background: '#4a6fa5',
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
								}}
							>
								<Edit size={16} /> Rename Plan
							</button>
							
							<button
								onClick={() => setIsDeleteModalOpen(true)}
								style={{
									background: '#d32f2f',
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
								}}
							>
								<Trash2 size={16} /> Delete Plan
							</button>
						</>
					)}
				</div>

				{/* Rename Modal */}
				{isCustomPlan && (
					<RenameModal
						isOpen={isRenameModalOpen}
						onClose={() => setIsRenameModalOpen(false)}
						planId={currentSelectedPlan.id}
						currentName={currentSelectedPlan.label}
						characterName={character?.username ?? ''}
					/>
				)}

				{/* Delete Plan Confirmation Modal */}
				{isDeleteModalOpen && (
					<div className={styles.modalOverlay}>
						<div className={styles.modalContent}>
							<h3>Delete Plan</h3>
							<p>Are you sure you want to delete the plan "{currentSelectedPlan.label}"?</p>
							<p style={{ color: '#ff6b6b', fontWeight: 'bold' }}>This action cannot be undone.</p>
							<div className={styles.modalButtons}>
								<button 
									onClick={handleDeletePlan}
									style={{
										backgroundColor: '#d32f2f',
										color: 'white',
										border: 'none',
										padding: '8px 16px',
										borderRadius: '4px',
										cursor: 'pointer',
									}}
								>
									Delete
								</button>
								<button 
									onClick={() => setIsDeleteModalOpen(false)}
									className={styles.modalCancelButton}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}
			</td>
		</tr>
	);
};