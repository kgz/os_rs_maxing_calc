import { useLastCharacter } from "../../hooks/useLastCharacter";
import { useAppSelector } from "../../store/store";
import { useCurrentSkillStats } from "../../hooks/useCurrentSkillStats";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { Modifiers } from "../../modifiers";

export const TableHeader = () => {

	const characters = useAppSelector(state => state.characterReducer)
	const character = useLastCharacter(characters);
	const { skillId } = useParams();

	const { currentSkillLevel } = useCurrentSkillStats(character, skillId);
	

	const has_modifiers = useMemo(() => {
		if (Object.keys(Modifiers).indexOf(skillId ?? '') === -1) {
			console.log('No skill modifiers found for', skillId, "in ", Object.keys(Modifiers));
			return false;
		}

		const skill_m = Modifiers[skillId as keyof typeof Modifiers];
		return Object.keys(skill_m).length > 0;
	}, [skillId]);

    return (
        <thead>
            <tr>
                <th></th> {/* For the remove button */}
                <th>From</th>
                <th style={{whiteSpace: 'nowrap'}}>XP Left {currentSkillLevel ?  <><br/>(from {currentSkillLevel}) </> :''}</th>
                <th>Method</th>
                {has_modifiers && <th>Modifiers</th>}
                <th>Input</th>
                <th>Output</th>
                <th>Profit/Loss</th>
                <th>Time to Complete</th> {/* New column */}
            </tr>
        </thead>
    );
};