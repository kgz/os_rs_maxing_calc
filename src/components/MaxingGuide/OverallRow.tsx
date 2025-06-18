import React from 'react';
import styles from '../MaxingGuide.module.css';
import { formatTime } from '../../utils/timeFormatting';



interface OverallRowProps {
  totalLevel: number;
  totalXP: number;
  overallStats: {
    totalRemainingXP: number;
    totalEstimatedCost: number;
    totalEstimatedTime: number;
  };
}
const OverallRow: React.FC<OverallRowProps> = ({ totalLevel, totalXP, overallStats }) => (
  <tr className={styles.overallRow}>
    <td>
      <div className={styles.overallNameCell}>
        <span>Overall</span>
      </div>
    </td>
    <td className={styles.levelCell}>{totalLevel}</td>
    <td className={styles.xpCell}>{totalXP.toLocaleString('en-au', { notation: 'compact' })}</td>
    <td className={styles.remainingXpCell}>
      {overallStats.totalRemainingXP.toLocaleString('en-au', { notation: 'compact' })}
    </td>
    <td>-</td>
    <td className={`${styles.estCostCell} ${styles.overallCostCell}`}>
      {overallStats.totalEstimatedCost !== 0 ? (
        <span className={overallStats.totalEstimatedCost > 0 ? styles.costNegative : styles.costPositive}>
          {overallStats.totalEstimatedCost > 0 ? '-' : ''}
          {Math.abs(overallStats.totalEstimatedCost).toLocaleString('en-au', { notation: 'compact' })}
        </span>
      ) : '-'}
    </td>
    <td className={styles.overallTimeCell}>
      {overallStats.totalEstimatedTime > 0 ? formatTime(overallStats.totalEstimatedTime) : '-'}
    </td>
    <td>-</td>
  </tr>
);

export default OverallRow;