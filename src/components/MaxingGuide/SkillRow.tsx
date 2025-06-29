import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../MaxingGuide.module.css';
import { skillsEnum } from '../../types/skillsResponse';
import { formatTime } from '../../utils/timeFormatting';
import CustomSelect from '../CustomSelect';
import type { Plan } from '../../types/plan';


interface PlanOption {
  id: string;
  label: string;
  plan: Plan;
  isTemplate: boolean;
}

interface SkillRowProps {
  skillName: string;
  currentLevel: number;
  currentSkill: number;
  isMaxed: boolean;
  remainingXP: number;
  planOptions: PlanOption[];
  selectedPlanOption: PlanOption | null;
  handlePlanChange: (skillId: string, option: PlanOption | null ) => void;
  estimatedCost: number | null;
  estimatedTime: number | null;
}

const SkillRow: React.FC<SkillRowProps> = ({ 
  skillName, 
  currentLevel, 
  currentSkill, 
  isMaxed, 
  remainingXP, 
  planOptions, 
  selectedPlanOption, 
  handlePlanChange, 
  estimatedCost, 
  estimatedTime 
}) => (
  <tr className={isMaxed ? styles.maxedSkill : ''}>
    <td>
      <div className={styles.skillNameCell}>
        <img 
          src={`/images/skills/${skillsEnum[skillName as keyof typeof skillsEnum].toLowerCase()}.png`}
          alt={skillName}
          className={styles.skillIcon}
        />
        <span className={styles.skillName}>{skillName}</span>
      </div>
    </td>
    <td className={styles.levelCell}>{currentLevel}</td>
    <td className={styles.xpCell}>{currentSkill.toLocaleString('en-au', { notation: 'compact' })}</td>
    <td className={styles.remainingXpCell}>
      {isMaxed ? '-' : remainingXP.toLocaleString('en-au', { notation: 'compact' })}
    </td>
    <td className={styles.planSelectorCell}>
      {!isMaxed && (
        <div className={styles.planSelectorWrapper}>
          <CustomSelect
            options={planOptions}
            value={selectedPlanOption}
            onChange={(option) => handlePlanChange(skillName, option)}
            getOptionLabel={(option) => option?.label ?? ''}
            getOptionValue={(option) => option?.id ?? ''}
            placeholder="Select plan..."
            renderSelectedValue={(option) => (
              <span className={styles.selectedPlanLabel}>{option?.label || "Select plan..."}</span>
            )}
            renderOption={(option) => (
              <span>{option?.label}</span>
            )}
          />
        </div>
      )}
      {isMaxed && (
        <span className={styles.maxedText}>Maxed</span>
      )}
    </td>
    <td className={styles.estCostCell}>
      {estimatedCost !== null ? (
        <span className={estimatedCost > 0 ? styles.costNegative : styles.costPositive}>
          {estimatedCost > 0 ? '-' : ''}
          {Math.abs(estimatedCost).toLocaleString('en-au', { notation: 'compact' })}
        </span>
      ) : '-'}
    </td>
    <td className={styles.estTimeCell}>
      {estimatedTime !== null ? formatTime(estimatedTime) : '-'}
    </td>
    <td className={styles.actionsCell}>
      {!isMaxed && (
        <Link to={`/skill/${skillName}`}>
          <button className={styles.planButton}>Edit</button>
        </Link>
      )}
    </td>
  </tr>
);

export default SkillRow;