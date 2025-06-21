import { useLastCharacter } from "../../hooks/useLastCharacter";
import { useAppSelector } from "../../store/store";
import { useCurrentSkillStats } from "../../hooks/usecurrentSkillStats";
import { useParams } from "react-router-dom";

export const TableHeader = () => {

	const characters = useAppSelector(state => state.characterReducer)
	const character = useLastCharacter(characters);
	const { skillId } = useParams();

	const { currentSkillLevel } = useCurrentSkillStats(character, skillId);
	

    return (
        <thead>
            <tr>
                <th></th> {/* For the remove button */}
                <th>From</th>
                <th style={{whiteSpace: 'nowrap'}}>XP Left {currentSkillLevel ?  <><br/>(from {currentSkillLevel}) </> :''}</th>
                <th>Method</th>
                <th>XP/Action</th>
                <th>Items</th>
                <th>Output</th>
                <th>Profit/Loss</th>
                <th>Time to Complete</th> {/* New column */}
            </tr>
        </thead>
    );
};