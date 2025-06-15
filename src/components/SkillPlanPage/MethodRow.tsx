import { Fragment } from "react";
import { useAppDispatch } from "../../store/store";
import type { Plan, PlanMethod } from "../../types/plan";
import { CirclePlus, Trash2 } from "lucide-react";
import { addNewMethodToPlan } from "../../store/thunks/skills/addNewMethodToPlan";
import { Plans } from "../../plans/plans";
import { removeMethodFromPlan } from "../../store/thunks/skills/removeMethodFromPlan";
import { setPlanFromLevel } from "../../store/thunks/skills/setPlanFromLevel";
import CustomSelect from "../CustomSelect";
import { SkillMethods } from "../../methods/methods";
import type { Method } from "../../types/method";
import { updatePlanMethod } from "../../store/thunks/skills/updatePlanMethod";
import { useItems } from "../../hooks/useItems";
import { Items } from "../../types/items";

// Component for the method row
export const MethodRow = ({
	index,
	plan,
	from,
	nextLevel,
	prevLevel,
	currentSkillLevel,
	xpToNext,
	itemsToNext,
	currentSelectedPlan,
	skillId,
}: {
	index: string;
	plan: PlanMethod;
	from: number;
	nextLevel: number;
	prevLevel: number;
	currentSkillLevel: number;
	xpToNext: number;
	itemsToNext: number;
	currentSelectedPlan: Plan;
	skillId: string | undefined;
}) => {
	const dispatch = useAppDispatch();
	const { getItemIconUrl, getItemPrice } = useItems();

	return (
		<Fragment key={index}>
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
								skill: skillId,
								index: Number(index),
							}));
						}}
					>
						<span style={{ marginTop: -4 }}><CirclePlus size={15} /></span>
					</button>
				</td>
				<td colSpan={100} style={{ borderTop: 'solid 1px white' }}></td>
			</tr>
			<tr key={index}>
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
								methodIndex: Number(index),
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
								methodIndex: Number(index),
								plan: currentSelectedPlan.id,
								skill: skillId ?? ''
							}))
						}
						}
					></input>

				</td>
				<td style={{ paddingBottom: 5 }}>{xpToNext.toLocaleString('en-au', { notation: 'compact' })}</td>
				<td style={{ paddingBottom: 5 }}>
					<div style={{ display: 'flex', alignItems: 'center', textAlign: 'left' }} data-key={index}>
						<CustomSelect
							showSearch
							searchFn={(option, searchText) => option.label.toLowerCase().includes(searchText.toLowerCase())}
							options={Object.values(SkillMethods[skillId as keyof typeof Plans]) as Method[]}
							value={plan.method} // This is correct - accessing the nested method object
							onChange={(newMethod) => {
								console.log(index)
								console.log(currentSelectedPlan.methods)
								void dispatch(updatePlanMethod({
									methodIndex: Number(index),
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
};
