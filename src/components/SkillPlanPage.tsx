import { useParams } from 'react-router-dom';
import style from './SkillPlanPage.module.css';
import type { SkillsRecord } from '../store/slices/characterSlice';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { SkillMethods } from '../methods/methods';
import { Plans } from '../plans/plans';
import { levelToXp, remainingXPToTarget, xpToLevel } from '../utils/xpCalculations';
import { setSelectedPlan } from '../store/thunks/skills/setSelectedPlan';
import { setPlanFromLevel } from '../store/thunks/skills/setPlanFromLevel';
import { addNewMethodToPlan } from '../store/thunks/skills/addNewMethodToPlan';

const SkillPlanPage = () => {
	const { skillId } = useParams();
	const characters = useAppSelector(state => state.characterReducer)

	const { selectedPlans, plans: _UserPlans } = useAppSelector((state) => state.skillsReducer);
	const dispatch = useAppDispatch();
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
		console.log(_UserPlans)
		return _UserPlans.filter(plan => plan.type === skillId);
	}, [_UserPlans, skillId])

	// useEffect(() => {
	//     if (userPlans && userPlans.length > 0) {
	//         dispatch(setSelectedPlan({ skill: skillId as keyof typeof skillsEnum, plan: userPlans[0] }));
	//     }
	// }, [dispatch, skillId, userPlans])

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
			return null;
		}

		const plan = selectedPlans[skillId] ?? null;
		if (!plan) {
			return null;
		}



		return userPlans.filter(plan => plan.id === selectedPlans[skillId]).at(0);
	}, [selectedPlans, skillId, userPlans])


	useEffect(() => {
		console.log({ skillMethods, plans: TemplatePlans, currentSelectedPlan, currentSkillLevel, lastCharacter })
	}, [TemplatePlans, skillMethods, currentSelectedPlan, currentSkillLevel, lastCharacter])

	return (
		<div className={style.container}>


			{lastCharacter && <div className={style.character}> {lastCharacter.username} </div>}
			<select value={selectedPlans[skillId as keyof typeof selectedPlans]} onChange={(e) => {
				const valInSkills = (key: string): key is keyof typeof Plans => key in Plans;
				const val = e.target.value;

				if (!skillId || !valInSkills(skillId)) {
					console.warn('Invalid plan or skill', skillId, val);
					return;
				}
				const valInSelectedPlans = (key: string): key is keyof typeof Plans[typeof skillId] => key in Plans[skillId];
				if (!valInSelectedPlans(val)) {
					console.warn('Invalid plan in selected plans', skillId, val);
					return;
				}
				void dispatch(setSelectedPlan({ plan: val, skill: skillId }));
			}}>
				{
					Object.entries(TemplatePlans ?? {}).map(([key, method]) => {
						return <option key={key} value={key}>{method.label}</option>
					})
				}

			</select>
			<div>{currentSelectedPlan?.label}</div>

			<table style={{ background: '#222' }}>
				<thead>
					<tr>
						<th></th>
						<th style={{paddingBottom: 5}}>Level</th>
						<th style={{paddingBottom: 5}}>Method</th>
						<th style={{paddingBottom: 5}}>Amount</th>
					</tr>
				</thead>
				<tbody>

					{
						currentSelectedPlan && <>
							{
								Object.entries(currentSelectedPlan?.methods ?? {}).map(([key, plan]) => {
									const from = Math.max(plan.from, currentSkillLevel);
									// calc to from next OR 99
									const nextLevel = (Object.values(currentSelectedPlan.methods).find((p) => p?.from > from) || { from: 99 }).from;

									const currentStartXp = levelToXp(from);
									const fromXp = Math.max(currentStartXp, currentSkillXp);

									const xpToNext = remainingXPToTarget(fromXp, nextLevel);
									const itemsToNext = Math.ceil(xpToNext / plan.method.xp)

									const prevLevel = (Object.values(currentSelectedPlan.methods).find((p) => p?.from < from) || { from: 0 }).from;
									return (
										<>
											<tr>
												<td style={{ position: 'relative', paddingTop: 4, paddingBottom: 4, paddingRight: 10, }}>
													<div style={{
														position: 'absolute',
														width: '100%',
														height: '1px',
														// backgroundColor: 'var(--osrs-gold)',
														opacity: 0.5,
														top: '50%',
														left: 0
													}}></div>
													<button
														style={{
															position: 'relative',
															zIndex: 2,
															height: 1,
															color: 'white',
															border: 'none',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															cursor: 'pointer',
															margin: '0 auto',
															padding: 0,
															fontSize: '16px',
															fontWeight: 'bold',
															marginTop: -4
														}}
														onClick={() => {
															const valInSkills = (key: string): key is keyof typeof Plans => key in Plans;
															if (!skillId || !valInSkills(skillId)) {
																console.warn('Invalid skill', skillId);
																return;
															}

															void dispatch(addNewMethodToPlan({
																planId: currentSelectedPlan.id,
																index: Number(key),
																skill: skillId,
															}))
														}}
													>
														<span style={{ marginTop: -4 }}>+</span>
													</button>
												</td>
												<td colSpan={4} style={{ borderTop: 'solid 1px white' }}></td>
											</tr>
											<tr key={key}>
												<td />
												<td style={{paddingBottom: 5}}>
													<input

														data-min={prevLevel + 1}
														value={from}
														type="number"
														min={prevLevel + 1}
														max={nextLevel - 1}
														step={1}
														onChange={(e) => {
															const val = Number(e.target.value);
															void dispatch(setPlanFromLevel({
																level: val,
																methodIndex: Object.keys(currentSelectedPlan.methods).indexOf(key),
																plan: currentSelectedPlan.id,

															}))
														}
														}
													></input>

												</td>
												<td style={{paddingBottom: 5}}>
													<div style={{ display: 'flex', alignItems: 'center', textAlign:'left' }}>
														<img src={"https://secure.runescape.com/m=itemdb_oldschool/1749130378040_obj_sprite.gif?id=" + plan.method.items.at(0)?.item.id} width="32" height="32" alt={plan.method.label} />


														{plan.method.label}
													</div>
												</td>
												<td style={{paddingBottom: 5}} title={itemsToNext.toString()}>{itemsToNext.toLocaleString("en-AU", {
													// notation: 'compact',
													maximumFractionDigits: 2,
													style: 'decimal',
												}).toLocaleString()}</td>
												{/* <td>{currentStartXp.toLocaleString()} {"->"} {xpToNext.toLocaleString()} </td> */}
											</tr>
										</>
									)
								})

							}
						</>

					}
				</tbody>
			</table>

		</div>
	)
};

export default SkillPlanPage;