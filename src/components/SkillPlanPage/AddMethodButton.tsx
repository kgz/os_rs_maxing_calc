import { CirclePlus } from "lucide-react";
import { Plans } from "../../plans/plans";
import { useAppDispatch } from "../../store/store";
import { addNewMethodToPlan } from "../../store/thunks/skills/addNewMethodToPlan";
import type { Plan } from "../../types/plan";

// Component for the add method button row
export const AddMethodButtonRow = ({
	currentSelectedPlan,
	skillId,
}: {
	currentSelectedPlan: Plan;
	skillId: string | undefined;
}) => {

	const dispatch = useAppDispatch();
	return (
		<tr>
			<td style={{ position: 'relative', paddingTop: 4, paddingBottom: 4, paddingRight: 10 }}>
				<div style={{
					position: 'absolute',
					width: '100%',
					height: '1px',
					opacity: 0.5,
					top: '50%',
					left: 0
				}}></div>
				<button
					style={{
						position: 'relative',
						zIndex: 2,
						height: 1,
						border: 'none',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						background: 'none',
						margin: '0 auto',
						padding: 0,
						marginRight: 2,
						fontSize: '16px',
						fontWeight: 'bold',
						marginTop: 0,
						outline: 'none',
						color: '#4CAF50'
					}}
					onClick={() => {
						const valInSkills = (key: string): key is keyof typeof Plans => key in Plans;
						if (!skillId || !valInSkills(skillId)) {
							console.warn('Invalid skill', skillId);
							return;
						}

						void dispatch(addNewMethodToPlan({
							planId: currentSelectedPlan.id,
							index: Object.keys(currentSelectedPlan.methods).length,
							skill: skillId,
						}));
					}}
				>
					<span style={{ marginTop: -4 }}><CirclePlus size={15} /></span>
				</button>
			</td>
			<td colSpan={100} style={{ borderTop: 'solid 1px white' }}></td>
		</tr>
	)
};