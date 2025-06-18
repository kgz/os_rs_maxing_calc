import React from 'react';
import styles from '../MaxingGuide.module.css';
interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
  <div className={styles.overallProgress}>
    <h2>Overall Progress</h2>
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div 
          className={styles.progress} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className={styles.progressText}>
        {progress}%
      </div>
    </div>
  </div>
);

export default ProgressBar;