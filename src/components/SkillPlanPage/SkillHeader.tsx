import { useState } from 'react';
import type { SkillsRecord } from "../../store/slices/characterSlice";
import type { PlanMethod } from "../../types/plan";
import { getSkillIconUrl } from "../../utils/getSkillIconUrl";
import CustomSelect from "../CustomSelect";
import style from '../SkillPlanPage.module.css';
import { useAppDispatch } from '../../store/store';
import { renamePlan } from '../../store/thunks/skills/renamePlan';

export const SkillHeader = ({
	skillId,
	lastCharacter,
	currentSkillLevel,
	planOptions,
	selectedPlanOption,
	handlePlanChange
}: {
	skillId: string | undefined;
	lastCharacter: (SkillsRecord & { username: string }) | null;
	currentSkillLevel: number;
	planOptions: Array<{
		id: string;
		label: string;
		plan: PlanMethod;
		isTemplate: boolean;
	}>;
	selectedPlanOption: {
		id: string;
		label: string;
		plan: PlanMethod;
		isTemplate: boolean;
	} | null;
	handlePlanChange: (option: typeof planOptions[0] | null) => void;
}) => {
  return (
		<div className="skill-header">
			<div className={style.headerLeft}>
				{skillId && (
					<>
						<img
							src={getSkillIconUrl(skillId)}
							alt={`${skillId} icon`}
							width="50"
							height="50"
						/>
						<h3>{skillId} Training Plan</h3>
					</>
				)}
			</div>

			<div className={style.headerRight}>
				{lastCharacter && (
					<div className={style.character}>
						Player: {lastCharacter.username} - Level: {currentSkillLevel}
					</div>
				)}

				<div className={style.planSelectorContainer}>
					<div className={style.planSelectorLabel}>Current Plan:</div>
					<div className={style.planSelectorWrapper}>
						<CustomSelect
							options={planOptions}
							value={selectedPlanOption}
							onChange={handlePlanChange}
							getOptionLabel={(option) => option?.label ?? ''}
							getOptionValue={(option) => option?.id ?? ''}
							placeholder="Select a plan..."
							renderSelectedValue={(option) => (
								<span className={style.selectedPlanLabel}>{option?.label}</span>
							)}
							renderOption={(option) => (
								<span>{option?.label}</span>
							)}
						/>
					</div>
				</div>

				
			</div>
		</div>
	)
};