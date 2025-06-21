import React, { useState } from 'react';
import { useAppDispatch } from '../../store/store';
import { renamePlan } from '../../store/thunks/skills/renamePlan';
import styles from '../SkillPlanPage.module.css';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  currentName: string;
  characterName: string;
}

export const RenameModal: React.FC<RenameModalProps> = ({
  isOpen,
  onClose,
  planId,
  currentName,
  characterName
}) => {
  const dispatch = useAppDispatch();
  const [newName, setNewName] = useState(currentName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      dispatch(renamePlan({
        planId,
        newName: newName.trim(),
        characterName
      }));
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Rename Plan</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new plan name"
            autoFocus
            className={styles.modalInput}
          />
          <div className={styles.modalButtons}>
            <button type="submit" className={styles.modalSaveButton}>Save</button>
            <button type="button" onClick={onClose} className={styles.modalCancelButton}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};