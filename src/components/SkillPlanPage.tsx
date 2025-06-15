import { useParams } from 'react-router-dom';
import style from './SkillPlanPage.module.css';
import type { SkillsRecord } from '../store/slices/characterSlice';
import { Fragment, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { SkillMethods } from '../methods/methods';
import { Plans } from '../plans/plans';
import { levelToXp, remainingXPToTarget, xpToLevel } from '../utils/xpCalculations';
import { setSelectedPlan } from '../store/thunks/skills/setSelectedPlan';
import { setPlanFromLevel } from '../store/thunks/skills/setPlanFromLevel';
import { addNewMethodToPlan } from '../store/thunks/skills/addNewMethodToPlan';
import CustomSelect from './CustomSelect';
import { updatePlanMethod } from '../store/thunks/skills/updatePlanMethod';
import type { Method } from '../types/method';
import { Items } from '../types/items';
import { CirclePlus, Trash2 } from 'lucide-react'
import { removeMethodFromPlan } from '../store/thunks/skills/removeMethodFromPlan';
import { useItems } from '../hooks/useItems';

const SkillPlanPage = () => {
	const { skillId } = useParams();
	const characters = useAppSelector(state => state.characterReducer)
	const { getItemIconUrl, getItemPrice } = useItems();

	const { selectedPlans, plans: _UserPlans } = useAppSelector((state) => state.skillsReducer);
	const dispatch = useAppDispatch();

	// Function to get skill icon URL
	const getSkillIconUrl = (skillName: string) => {
		return `/images/skills/${skillName.toLowerCase()}.png`;
	};

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

	const userPlans = useMemo(() => {
		const isInSkillMethods = (skill: string): skill is keyof typeof SkillMethods => skill in SkillMethods;
		if (!skillId || !isInSkillMethods(skillId)) {
			console.error(`No skill data found for ${skillId}`);
			return [];
		}
		return _UserPlans.filter(plan => plan.type === skillId);
	}, [_UserPlans, skillId])

	const skillMethods = useMemo(() => {
		const isInSkillMethods = (skill: string): skill is keyof typeof SkillMethods => skill in SkillMethods;
		if (!skillId || !isInSkillMethods(skillId)) {
			return null;
		}

		return SkillMethods[skillId] ?? {};

	}, [skillId])

	const _currentSkill = useMemo(() => {

		if (!lastCharacter || !skillId) {
			return null;
		}
		return lastCharacter?.[skillId as keyof SkillsRecord] ?? null;
	}, [lastCharacter, skillId]);

	const currentSkillXp = useMemo(() => {

		const lastEpoch = Math.max(...Object.keys(_currentSkill ?? {}).map(Number));

		if (typeof _currentSkill !== 'object') {
			return 1;
		}

		if (lastEpoch && lastEpoch !== Infinity && lastEpoch !== -Infinity) {
			return (_currentSkill ?? {})[Number(lastEpoch)] ?? 1;
		}

		return 1;
	}, [_currentSkill]);

	const currentSkillLevel = useMemo(() => {

		return xpToLevel(currentSkillXp);

	}, [currentSkillXp])

	const TemplatePlans = useMemo(() => {
		return Plans[skillId as keyof typeof Plans] ?? [null];
	}, [skillId])

	const currentSelectedPlan = useMemo(() => {
		const keyExists = (key: string): key is keyof typeof selectedPlans => key in selectedPlans;
		if (!skillId || !keyExists(skillId)) {
			console.warn('No skill data found for', skillId);
			return null;
		}

		const plan = selectedPlans[skillId] ?? null;
		if (!plan) {
			console.warn('No plan found for', skillId);
			return null;
		}

		// merge user plans and template plans
		const userPlan = userPlans.filter(plan => plan.id === selectedPlans[skillId]).at(0);
		if (!userPlan) {
			return TemplatePlans[plan as keyof typeof TemplatePlans];
		}
		return userPlan
	}, [TemplatePlans, selectedPlans, skillId, userPlans])

	useEffect(() => {
	}, [TemplatePlans, skillMethods, currentSelectedPlan, currentSkillLevel, lastCharacter])

	// Create an array of plan options for the CustomSelect component
	const planOptions = useMemo(() => {
		if (!skillId) return [];

		// Combine template plans and user plans
		const templatePlanOptions = Object.entries(TemplatePlans || {}).map(([key, plan]) => ({
			id: key,
			label: plan?.label || "Unknown",
			plan,
			isTemplate: true
		}));

		const userPlanOptions = userPlans.map(plan => ({
			id: plan.id,
			label: plan.label,
			plan,
			isTemplate: false
		}));

		return [...templatePlanOptions, ...userPlanOptions];
	}, [TemplatePlans, userPlans, skillId]);

	// Find the currently selected plan option
	const selectedPlanOption = useMemo(() => {
		if (!skillId || !selectedPlans[skillId as keyof typeof selectedPlans] || !planOptions.length) return null;
		return planOptions.find(option => option.id === selectedPlans[skillId as keyof typeof selectedPlans]) || null;
	}, [planOptions, selectedPlans, skillId]);

	// Handle plan selection change
	const handlePlanChange = (option: typeof planOptions[0] | null) => {
		const valInSkills = (key: string): key is keyof typeof Plans => key in Plans;
		if (!skillId || !valInSkills(skillId)) {
			console.warn('Invalid plan or skill', skillId, option?.id);
			return;
		}

		if (!option) return;

		// if (option.isTemplate) {
		//     createCustomPlanFromTemplate(option.id);
		// } else {
		// }
		void dispatch(setSelectedPlan({ plan: option.id, skill: skillId }));
	};


	return (
		<div className={style.container}>
			{/* Redesigned Skill Header with Plan Selector */}
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

					{/* Larger Plan Selector using CustomSelect */}
					<div className={style.planSelectorContainer}>
						<div className={style.planSelectorLabel}>Current Plan:</div>
						<div className={style.planSelectorWrapper}>
							<CustomSelect
								options={planOptions}
								value={selectedPlanOption}
								onChange={handlePlanChange}
								getOptionLabel={(option) => option?.label}
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

			<table style={{ background: '#222', padding: 10, width: '100%', marginTop: '20px' }}>
				<thead>
					<tr>
						<th></th>
						<th style={{ paddingBottom: 5 }}>Level</th>
						<th style={{ paddingBottom: 5 }}>Xp Remaining</th>
						<th style={{ paddingBottom: 5 }}>Method</th>
						<th style={{ paddingBottom: 5 }}>XP/Action</th>
						<th style={{ paddingBottom: 5 }}>Input</th>
						<th style={{ paddingBottom: 5 }}>Output</th>
						<th style={{ paddingBottom: 5 }}>Profit/Loss</th>
					</tr>
				</thead>
				<tbody>

					{
						currentSelectedPlan && (
							<>
								{
									Object.entries(currentSelectedPlan?.methods ?? {})
										.sort((a, b) => a[1].from - b[1].from) // Sort by level requirement
										.filter(([_, plan]) => {
											// Show methods that are applicable to the player's current level
											// This means either:
											// 1. The method's level requirement is exactly at the player's level
											// 2. The method's level requirement is below the player's level, but it's the highest such method
											// 3. The method's level requirement is above the player's level, but it's the lowest such method
											
											if (plan.from === currentSkillLevel) {
												// Exact match for player's level
												return true;
											}
											
											// Find the highest method level that's below or equal to the player's level
											const highestBelowOrEqual = Math.max(
												...Object.values(currentSelectedPlan.methods)
													.filter(p => p.from <= currentSkillLevel)
													.map(p => p.from)
											);
											
											// Find the lowest method level that's above the player's level
											const lowestAbove = Math.min(
												...Object.values(currentSelectedPlan.methods)
													.filter(p => p.from > currentSkillLevel)
													.map(p => p.from),
												99 // Default to 99 if no methods above
											);
											
											// Show this method if it's either the highest below or the lowest above
											return plan.from === highestBelowOrEqual || plan.from === lowestAbove;
										})
										.map(([key, plan]) => {
											const from = Math.max(plan.from, currentSkillLevel);
											
											// Find the next method's level or default to 99
											const nextLevel = (
												Object.values(currentSelectedPlan.methods)
													.filter(p => p?.from > from)
													.sort((a, b) => a.from - b.from)[0] || { from: 99 }
											).from;

											const currentStartXp = levelToXp(from);
											const fromXp = Math.max(currentStartXp, currentSkillXp);

											const xpToNext = remainingXPToTarget(fromXp, nextLevel);
											const itemsToNext = Math.ceil(xpToNext / plan.method.xp);

											// Find the previous method's level
											const prevLevel = (
												Object.values(currentSelectedPlan.methods)
													.filter(p => p?.from < from)
													.sort((a, b) => b.from - a.from)[0] || { from: 0 }
											).from;

											return (
												<Fragment key={key}>
													<tr>
														<td style={{ position: 'relative', paddingTop: 4, paddingBottom: 4, paddingRight: 10, }}>
															<div style={{
																position: 'absolute',
																width: '100%',
																height: '1px',
																opacity: 0.5,
																top: '50%',
																left: 0
															}}></div>
															<button
																disabled={nextLevel - from <= 1}
																style={{
																	position: 'relative',
																	zIndex: 2,
																	height: 1,
																	border: 'none',
																	display: 'flex',
																	alignItems: 'center',
																	justifyContent: 'center',
																	background: 'none',
																	cursor: nextLevel - from <= 1 ? 'default' : 'pointer',
																	opacity: nextLevel - from <= 1 ? 0.5 : 1,
																	margin: '0 auto',
																	padding: 0,
																	marginRight: 2,
																	fontSize: '16px',
																	fontWeight: 'bold',
																	marginTop: 0,
																	outline: 'none',
																	color: '#4CAF50'
																}}
																onClick={() => {
																	const valInSkills = (key: string): key is keyof typeof Plans => key in Plans;
																	if (!skillId || !valInSkills(skillId)) {
																		console.warn('Invalid skill', skillId);
																		return;
																	}

																	void dispatch(addNewMethodToPlan({
																		planId: currentSelectedPlan.id,
																		index: Object.keys(currentSelectedPlan.methods).indexOf(key),
																		skill: skillId,
																	}))
																}}
															>
																<span style={{ marginTop: -4 }}><CirclePlus size={15} /></span>
															</button>
														</td>
														<td colSpan={100} style={{ borderTop: 'solid 1px white' }}></td>
													</tr>
													<tr key={key}>

														<td >
															{/* // add remove button */}
															<button
																style={{
																	background: 'none',
																	width: 10,
																	aspectRatio: '1',
																	marginRight: 16,
																	marginLeft: 0,
																	padding: 0,
																	color: '#ff4747',
																	outline: 'none',
																}}
																onClick={() => {
																	void dispatch(removeMethodFromPlan({
																		planId: currentSelectedPlan.id,
																		methodIndex: Object.keys(currentSelectedPlan.methods).indexOf(key),
																		skill: skillId ?? ''
																	}))
																}}
															><Trash2 size={15} /></button>
														</td>
														<td style={{ paddingBottom: 5 }}>
															<input

																data-min={prevLevel + 1}
																value={from}
																type="number"
																min={Math.max(prevLevel + 1, currentSkillLevel)}
																max={nextLevel - 1}
																step={1}
																onChange={(e) => {
																	const val = Number(e.target.value);
																	void dispatch(setPlanFromLevel({
																		level: val,
																		methodIndex: Object.keys(currentSelectedPlan.methods).indexOf(key),
																		plan: currentSelectedPlan.id,
																		skill: skillId ?? ''
																	}))
																}
																}
															></input>

														</td>
														<td style={{ paddingBottom: 5 }}>{xpToNext.toLocaleString('en-au', { notation: 'compact' })}</td>
														<td style={{ paddingBottom: 5 }}>
															<div style={{ display: 'flex', alignItems: 'center', textAlign: 'left' }}>
																<CustomSelect
																	showSearch
																	searchFn={(option, searchText) => option.label.toLowerCase().includes(searchText.toLowerCase())}
																	options={Object.values(SkillMethods[skillId as keyof typeof Plans]) as Method[]}
																	value={plan.method} // This is correct - accessing the nested method object
																	onChange={(newMethod) => {
																		void dispatch(updatePlanMethod({
																			methodIndex: Object.keys(currentSelectedPlan.methods).indexOf(key),
																			planId: currentSelectedPlan.id,
																			method: newMethod,
																			skill: skillId ?? ''
																		}));
																	}}
																	getOptionLabel={(option) => option.label}
																	getOptionValue={(option) => option.id}
																	renderSelectedValue={(option) => (
																		<span>{option.label}</span> // Only show the label, no image
																	)}
																	renderOption={(option) => (
																		<span>{option.label}</span> // Only show the label, no image
																	)}
																/>
															</div>
														</td>
														<td style={{ paddingBottom: 5 }}>{plan.method.xp}</td>
														<td style={{ paddingBottom: 5 }} title={itemsToNext.toString()}>
															<div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
																{plan.method.items.map((itemData, idx) => {
																	const item = Object.values(Items).find((i) => i.id === itemData.item.id);
																	return (
																		<div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
																			<img
																				src={getItemIconUrl(item?.id ?? 0)}
																				width="24"
																				height="24"
																				alt={itemData.item.label}
																				title={itemData.item.label}
																				style={{ marginRight: '4px' }}
																			/>
																			<span>
																				{(itemData.amount * itemsToNext).toLocaleString("en-AU", {
																					maximumFractionDigits: 0,
																					style: 'decimal',
																				})}
																			</span>
																		</div>
																	)
																})}
															</div>
														</td>
														{/* New output column */}
														<td style={{ paddingBottom: 5 }}>
															<div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
																{plan.method.returns?.map((outputData, idx) => {
																	const outputItem = Object.values(Items).find((i) => i.id === outputData.item.id);
																	return (
																		<div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
																			<img
																				src={getItemIconUrl(outputItem?.id ?? 0)}
																				width="24"
																				height="24"
																				alt={outputData.item.label}
																				title={outputData.item.label}
																				style={{ marginRight: '4px' }}
																			/>
																			<span>
																				{(outputData.amount * itemsToNext).toLocaleString("en-AU", {
																					maximumFractionDigits: 0,
																					style: 'decimal',
																				})} 
																			</span>
																		</div>
																	)
																}) || <span>-</span>}
															</div>
														</td>
														{/* New Profit/Loss column */}
														<td style={{ paddingBottom: 5 }}>
															{(() => {
																// Calculate total input cost
																const inputCost = plan.method.items.reduce((total, itemData) => {
																	const item = Object.values(Items).find((i) => i.id === itemData.item.id);
																	if (!item) return total;
																	
																	// Use the latest price data if available, otherwise fall back to the mapping value
																	const itemPrice = getItemPrice(item.id) ?? 0
																		
																	return total + (itemPrice * itemData.amount * itemsToNext);
																}, 0);
																
																// Calculate total output value
																const outputValue = (plan.method.returns || []).reduce((total, outputData) => {
																	const outputItem = Object.values(Items).find((i) => i.id === outputData.item.id);
																	if (!outputItem) return total;
																	
																	// Use the latest price data if available, otherwise fall back to the mapping value
																	const itemPrice = getItemPrice(outputItem.id) ?? 0

																		
																	return total + (itemPrice * outputData.amount * itemsToNext);
																}, 0);
																
																// Calculate profit/loss
																const profitLoss = outputValue - inputCost;
																const isProfit = profitLoss >= 0;
																
																return (
																	<span style={{ 
																		color: isProfit ? '#4CAF50' : '#ff4747',
																		fontWeight: 'bold',
																	}}>
																		{isProfit ? '+' : ''}
																		{profitLoss.toLocaleString("en-AU", {
																			notation: 'compact',
																			maximumFractionDigits: 0,
																			style: 'decimal',
																		})} gp
																	</span>
																);
															})()}
														</td>
														{/* <td>{currentStartXp.toLocaleString()} {"->"} {xpToNext.toLocaleString()} </td> */}
													</tr>
												</Fragment>
											)
										})
								}

								{/* Add new method at the end of the list */}
								<tr>
									<td style={{ position: 'relative', paddingTop: 4, paddingBottom: 4, paddingRight: 10 }}>
										<div style={{
											position: 'absolute',
											width: '100%',
											height: '1px',
											opacity: 0.5,
											top: '50%',
											left: 0
										}}></div>
										<button
											// disabled={nextLevel - Math.max(from, currentSkillLevel) <= 1}
											style={{
												position: 'relative',
												zIndex: 2,
												height: 1,
												border: 'none',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												background: 'none',
												// cursor: nextLevel - Math.max(from, currentSkillLevel) <= 1 ? 'default' : 'pointer',
												// opacity: nextLevel - Math.max(from, currentSkillLevel) <= 1? 0.5 : 1,
												margin: '0 auto',
												padding: 0,
												marginRight: 2,
												fontSize: '16px',
												fontWeight: 'bold',
												marginTop: 0,
												outline: 'none',
												color: '#4CAF50'
											}}
											onClick={() => {
												const valInSkills = (key: string): key is keyof typeof Plans => key in Plans;
												if (!skillId || !valInSkills(skillId)) {
													console.warn('Invalid skill', skillId);
													return;
												}

												void dispatch(addNewMethodToPlan({
													planId: currentSelectedPlan.id,
													index: Object.keys(currentSelectedPlan.methods).length,
													skill: skillId,
												}))
											}}
										>
											<span style={{ marginTop: -4 }}><CirclePlus size={15} /></span>
										</button>
									</td>
									<td colSpan={100} style={{ borderTop: 'solid 1px white' }}></td>
								</tr>
							</>
						)
					}

				</tbody>
			</table>

		</div>
	)
};

export default SkillPlanPage;