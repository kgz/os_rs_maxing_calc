import { useParams } from 'react-router-dom';
import style from './SkillPlanPage.module.css';
import type { SkillsRecord } from '../store/slices/characterSlice';
import { useEffect, useMemo } from 'react';
import { useAppSelector } from '../store/store';
import { SkillMethods } from '../methods/methods';

const SkillPlanPage = () => {
	

	const {skillId} = useParams();

	const characters = useAppSelector(state => state.characterReducer)
	
	const lastCharacter: SkillsRecord & { 'username': string } | null = useMemo(() => {
		const last = Object.entries(characters).sort(([, a], [, b]) => b.lastUpdated - a.lastUpdated).at(0);
		if (last !== undefined) {
			return {
				...last[1],
				username: last[0]
			}
		}

		return null
	}, [characters])

	const skillMethods = useMemo(() => {
		if (!skillId) {
			return {};
		}

		return SkillMethods[skillId as keyof typeof SkillMethods] ?? {};

    }, [skillId])

	const currentSkill = useMemo(() => {

		if (!lastCharacter || !skillId) {
			return null;
        }
		return lastCharacter?.[skillId as keyof SkillsRecord]?? null;
    }, [lastCharacter, skillId]);


	useEffect(()=>{
		console.log({currentSkill, skillMethods})
	}, [currentSkill, skillMethods])

	return (
        <div className={style.container}>

			{lastCharacter && <div className={style.character}> {lastCharacter.username} </div>}

		</div>
	)
};

export default SkillPlanPage;