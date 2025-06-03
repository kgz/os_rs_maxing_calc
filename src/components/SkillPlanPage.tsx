import React, { useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { remainingXPToTarget } from '../utils/xpCalculations';
import { updateTrainingMethod, removeTrainingMethod, addTrainingMethod, reorderTrainingMethods, type TrainingMethod } from '../store/skillsSlice';
import CardList from './CardList';
import './SkillPlanPage.scss';

const SkillPlanPage: React.FC = () => {
    const { skillId } = useParams<{ skillId: string }>();
    const skill = useAppSelector((state) =>
        state.skills.skills.find((s) => s.id === skillId)
    );
    const methods = useAppSelector((state) => state.skills.trainingMethods[skillId as string] || []);
    const dispatch = useAppDispatch();

    if (!skill) {
        return <div>Skill not found</div>;
    }

    const handleMethodChange = (methodIndex: number, field: keyof TrainingMethod, value: string | number) => {
        const updatedMethod = { ...methods[methodIndex], [field]: value };
        dispatch(updateTrainingMethod({ skillId: skillId as string, methodIndex, method: updatedMethod }));
    };

    const removeMethod = (index: number) => {
        dispatch(removeTrainingMethod({ skillId: skillId as string, methodIndex: index }));
    };

    const addNewMethod = () => {
        const newMethod: TrainingMethod = {
            id: `method-${Date.now()}`, // Generate a unique id
            name: 'New Method',
            levelReq: skill.level,
            xpPerHour: 0,
            intensity: 'Medium',
            startLevel: skill.level,
            endLevel: skill.targetLevel
        };
        dispatch(addTrainingMethod({ skillId: skillId as string, method: newMethod }));
    };

    return (
        <div className="skill-plan-page">
            <Link to="/" className="back-link">← Back to Skills</Link>
            <h2>{skill.name} Training Plan</h2>
            <div className="skill-info">
                <p><strong>Current Level:</strong> {skill.level}</p>
                <p><strong>Current XP:</strong> {skill.xp.toLocaleString()}</p>
                <p><strong>Target Level:</strong> {skill.targetLevel}</p>
                <p><strong>Total XP Needed:</strong> {remainingXPToTarget(skill.xp, skill.targetLevel).toLocaleString()}</p>
            </div>

            <h3>Training Methods</h3>
            
            {/* Add the CardList component here */}
            <CardList />

            <button className="add-method-btn" onClick={addNewMethod}>Add New Method</button>
        </div>
    );
};

export default SkillPlanPage;