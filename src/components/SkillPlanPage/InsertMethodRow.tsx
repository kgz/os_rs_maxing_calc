import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { addNewMethodToPlan } from '../../store/thunks/skills/addNewMethodToPlan';
import { Plans } from '../../plans/plans';
import type { Plan } from '../../types/plan';
import { useLastCharacter } from '../../hooks/useLastCharacter';
import { Edit, PlusCircleIcon } from 'lucide-react';
import { RenameModal } from './RenameModal';

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
	const [isAddMethodModalOpen, setIsAddMethodModalOpen] = useState(false);

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
				characterName: character?.username, // Add character name here if available
			})
		);
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

				{/* Add Method Modal */}
				{isAddMethodModalOpen && (
					<div className="modalOverlay" style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: 'rgba(0, 0, 0, 0.7)',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						zIndex: 1000,
					}}>
						<div className="modalContent" style={{
							backgroundColor: '#2a2a2a',
							padding: '20px',
							borderRadius: '8px',
							width: '300px',
							boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
						}}>
							<h3>Add New Method</h3>
							<p>Are you sure you want to add a new method to this plan?</p>
							<div style={{
								display: 'flex',
								justifyContent: 'flex-end',
								gap: '10px',
								marginTop: '15px',
							}}>
								<button
									onClick={handleAddMethod}
									style={{
										backgroundColor: '#4CAF50',
										color: 'white',
										border: 'none',
										padding: '8px 16px',
										borderRadius: '4px',
										cursor: 'pointer',
									}}
								>
									Add
								</button>
								<button
									onClick={() => setIsAddMethodModalOpen(false)}
									style={{
										backgroundColor: '#666',
										color: 'white',
										border: 'none',
										padding: '8px 16px',
										borderRadius: '4px',
										cursor: 'pointer',
									}}
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