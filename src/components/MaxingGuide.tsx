import {useMemo, useRef } from 'react';
import { fetchCharacterStats } from '../store/thunks/character/fetchCharacterStats';
import { skillsEnum } from '../types/skillsResponse';
import { useAppDispatch, useAppSelector } from '../store/store';
import type { SkillsRecord } from '../store/slices/characterSlice';
import { remainingXPToTarget, xpToLevel } from '../utils/xpCalculations';
import { Link } from 'react-router-dom';

const MaxingGuide = () => {
	const dispatch = useAppDispatch();
	const usernameRef = useRef<HTMLInputElement>(null);
	//   useEffect(() => {
	//     if (username) {
	//       dispatch(fetchCharacterStats(username));
	//     }
	//   }, [dispatch, username]);

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


	const handleFetchStats = () => {
		const username = usernameRef.current?.value?.trim();
		console.log('Fetching stats for:', username);
		if (username) {
			dispatch(fetchCharacterStats(username));
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleFetchStats();
		}
	};


	return (
		<div className="maxing-guide">
			<header className="guide-header">
				<h1>OSRS Maxing Guide</h1>
				<div className="import-container">
					<input
						ref={usernameRef}
						type="text"
						defaultValue={lastCharacter?.username ?? ''}
						// onChange={handleUsernameChange}
						onKeyPress={handleKeyPress}
						placeholder="Enter RuneScape username"
					// disabled={loading}
					/>
					<button onClick={handleFetchStats}>
						{'Take Xp Snapshot'}
					</button>
				</div>
				{/* {error && <div className="error-message">{error}</div>} */}
			</header>

			<div className="overall-progress">
				<h2>Overall Progress</h2>
				<div className="progress-container">
					<div className="progress-bar">
						<div
							className="progress"
						//   style={{ width: `${overallProgress}%` }}
						></div>
					</div>
					<div className="progress-text">
						{/* {overallProgress.toFixed(2)}% */}
					</div>
				</div>
			</div>
			{
				!lastCharacter && (
					<div className="no-character-message">
						No character data found. Please enter a valid RuneScape username.
					</div>
				)
			}
			{lastCharacter && <div className="skills-grid">
				{
					Object.keys(skillsEnum).map((skillId) => {
						const skillName = skillId as keyof typeof skillsEnum;
						// if (skillsEnum[skillName] !== skillsEnum.Prayer) {return <></>}

						
						const skills = lastCharacter[skillName]?? {
							"0": 0
						};
						const lastEpoch = Math.max(...Object.keys(skills).map(Number));
						const currentSkill = skills[lastEpoch] ?? null
						if (currentSkill === null) {
							console.log({ lastEpoch,lastCharacter, skills })
							throw new Error(`No skill data found for ${skillName}`);
						}

						const currentLevel = xpToLevel(currentSkill)

						const isMaxed = currentLevel === 99;

						const remainingXP = remainingXPToTarget(currentSkill, 99);
						const progressPercent = Math.min((currentLevel / 99) * 100, 100);
						const xpToNext = remainingXPToTarget(currentSkill, currentLevel + 1);
						const isExpanded = !isMaxed

						return (


							<div key={skillName} className={`skill-card ${isMaxed ? 'maxed' : ''} ${isExpanded ? 'expanded' : ''}`}>
								<div className="skill-header">
									<img
										src={`https://oldschool.tools/images/skills/${skillsEnum[skillName].toLocaleLowerCase()}.png`}
										alt={skillName}
										className="skill-icon"
									/>
									<h3>{skillName}</h3>
									{isMaxed ? (
										<span className="maxed-indicator">
											Maxed
										</span>
									) : <span className="maxed-indicator" style={{ visibility: 'hidden' }}></span>}
								</div>

								{(!isMaxed || isExpanded) && (
									<>
										<div className="skill-inputs">
											<div className="input-group">
												<label>Current Level:</label>
												<input
													type="number"
													min="1"
													max="99"
													value={currentLevel}
													// onChange={(e) => handleLevelChange(skillName, e.target.value)}
													disabled={isMaxed}
												/>
											</div>
											<div className="input-group">
												<label>Current XP:</label>
												<input
													type="number"
													min="0"
													value={skillName}
													// onChange={(e) => handleXpChange(skillName, e.target.value)}
													disabled={isMaxed}
												/>
											</div>
											<div className="input-group">
												<label>Target Level:</label>
												<input
													type="number"
													min={currentLevel}
													max="99"
													value={99}
													// onChange={(e) => handleTargetChange(skillName, e.target.value)}
													disabled={isMaxed}
												/>
											</div>
										</div>

										<div className="progress-container">
											<div className="progress-bar">
												<div
													className="progress"
													style={{ width: `${progressPercent}%` }} 
												></div>
											</div>
												<div className="progress-text">
                                                	{Math.floor(progressPercent)}%
												</div>
											{/* <div className="progress-text">
												{currentLevel} / {isMaxed ? '99' : 99}
											</div> */}
										</div>

										<div className="xp-info">
											{isMaxed ? (
												<p>Skill Maxed - 13,034,431 XP</p>
											) : (
												<>
													<p>XP to next level: {xpToNext.toLocaleString()}</p>
													<p>Remaining XP to target: {remainingXP.toLocaleString()}</p>
													{/* <p>Estimated time to 99: {timeTo99.toFixed(2)} hours</p> */}
													<Link to={`/skill-plan/${skillName}`}>
														<button>Build Plan</button>
													</Link>
												</>
											)}
										</div>
									</>
								)}
							</div>
						)
					})
				}
			</div>
			}
		</div>
	);
};

export default MaxingGuide;