import { Fragment, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import type { Plan, PlanMethod } from "../../types/plan";
import { InfoIcon, Trash2, TriangleAlert } from "lucide-react";
import { Plans } from "../../plans/plans";
import { removeMethodFromPlan } from "../../store/thunks/skills/removeMethodFromPlan";
import { setPlanFromLevel } from "../../store/thunks/skills/setPlanFromLevel";
import CustomSelect from "../CustomSelect";
import { SkillMethods } from "../../methods/index.ts";
import type { Method } from "../../types/method";
import { updatePlanMethod } from "../../store/thunks/skills/updatePlanMethod";
import { useItems } from "../../hooks/useItems";
import { Items } from "../../types/items";
import { useLastCharacter } from "../../hooks/useLastCharacter";
import { forwardRef } from 'react';
import { Tooltip } from '../Tooltip/Tooltip';

type Props = {
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
	isGreyedOut: boolean;
	isLastMethod: boolean;
	isActive: boolean;
}
// Component for the method row
const MethodRow = ({
	index,
	plan,
	from,
	prevLevel,
	xpToNext,
	itemsToNext,
	currentSelectedPlan,
	skillId,
	isActive,
	nextLevel
}: Props) => {
	const dispatch = useAppDispatch();
	const { getItemIconUrl, getItemPrice } = useItems();

	const characters = useAppSelector(state => state.characterReducer)
	const character = useLastCharacter(characters);

	// Calculate time to complete based on actions per hour
	const calculateTimeToComplete = () => {
		if (!origMethod.actionsPerHour || origMethod.actionsPerHour <= 0) {
			return "Unknown";
		}

		// Calculate how many hours it will take
		const hours = itemsToNext / origMethod.actionsPerHour;

		// Format the time nicely
		if (hours < 1) {
			// Less than an hour, show minutes
			const minutes = Math.ceil(hours * 60);
			return `${minutes} min`;
		} else if (hours < 24) {
			// Less than a day, show hours and minutes
			const wholeHours = Math.floor(hours);
			const minutes = Math.ceil((hours - wholeHours) * 60);
			return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
		} else {
			// More than a day, show days and hours
			const days = Math.floor(hours / 24);
			const remainingHours = Math.ceil(hours % 24);
			return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
		}
	};

	const rowStyle = {
		// opacity: isActive ? 1 : 0.5,
		color: isActive ? 'inherit' : '#888',
		height: isActive ? 'auto' : '30px', // Reduce height for inactive rows
		overflow: 'hidden',

	};

	const origMethod = useMemo(() => {

		const methods = SkillMethods[skillId as keyof typeof Plans];
		const orig = Object.values(methods)?.find(m => m.id === plan.method.id) as Method | null
		if (!orig) {
			throw new Error(`Method not found for skill ${skillId} and method id ${plan.method.id}`);
		}
		console.log({orig})
		return orig;
	}, [plan.method, skillId])

	return (
		<Fragment key={index} >
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

				</td>
				<td colSpan={100} style={{ borderTop: 'solid 1px white' }}></td>
			</tr>
			<tr key={index} style={rowStyle} className="method-row">
				<td >
					{/* Remove button */}
					<Tooltip content="Remove method" position="top">
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
									skill: skillId ?? '',
									characterName: character?.username ?? ''

								}))
							}}
						><Trash2 size={15} /></button>
					</Tooltip>
				</td>
				<td style={{ paddingBottom: 5 }}>
					<input
						data-min={prevLevel + 1}
						defaultValue={from}
						type="number"
						min={1}
						max={99}
						step={1}
						onBlur={(e) => {
							const val = Number(e.target.value);
							void dispatch(setPlanFromLevel({
								level: val,
								methodIndex: Number(index),
								plan: currentSelectedPlan.id,
								skill: skillId ?? '',
								characterName: character?.username ?? ''
							}))
						}}
						// onclick select whole value
						onFocus={(e) => { e.target.select(); }}
						style={{
							opacity: 1, // Always fully visible
							background: 'inherit',
							border: '1px solid #ccc',
							padding: '2px 5px',
							width: '50px',
							textAlign: 'center',
						}}
					/>
				</td>
				<td style={{ paddingBottom: 5 }}>{xpToNext.toLocaleString('en-au', { notation: 'compact' })}</td>
				<td style={{ paddingBottom: 5 }}>

					<div style={{ display: 'flex', alignItems: 'center', textAlign: 'left' }} data-key={index}>
						{(origMethod.requirement.levels[skillId as keyof typeof origMethod.requirement.levels] ?? 0) > from && (
							<Tooltip
								content={`This method requires ${skillId} level ${origMethod.requirement.levels[skillId as keyof typeof origMethod.requirement.levels]}, but starts at level ${from}`}
								position="top"
							>
								<span
									style={{
										color: '#ff9800',
										marginLeft: '5px',
										cursor: 'help'
									}}
								>
									<TriangleAlert style={{ marginTop: 5 }} size={16} />
								</span>
							</Tooltip>
						)}
						<CustomSelect
							showSearch
							searchFn={(option, searchText) => option.label.toLowerCase().includes(searchText.toLowerCase())}
							options={Object.values(SkillMethods[skillId as keyof typeof Plans]) as Method[]}
							value={origMethod}
							onChange={(newMethod) => {
								void dispatch(updatePlanMethod({
									methodIndex: Number(index),
									planId: currentSelectedPlan.id,
									method: newMethod,
									skill: skillId ?? '',
									characterName: character?.username ?? ''
								}));
							}}
							getOptionLabel={(option) => {
								const requiredLevel = option.requirement?.levels?.[skillId as keyof typeof option.requirement.levels] || 0;
								const hasRequirementWarning = requiredLevel > from;
								return hasRequirementWarning
									? `${option.label} ⚠️`
									: option.label;
							}}
							getOptionValue={(option) => option.id}
							renderSelectedValue={(option) => {

								return (
									<span style={{
										color: isActive ? 'white' : 'grey',
										display: 'flex',
										alignItems: 'center'
									}}>
										{option.label}

									</span>
								);
							}}
							renderOption={(option) => {

								return (
									<div style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										width: '100%'
									}}>
										<span>{option.label}</span>
										{/* {hasRequirementWarning && (
											<span
												title={`Requires ${skillId} level ${requiredLevel}`}
												style={{
													color: '#ff9800',
													marginLeft: '8px',
													fontSize: '0.85em'
												}}
											>
												Req: Lvl {requiredLevel}
											</span>
										)} */}
									</div>
								);
							}}
						/>
					</div>

				</td>
				<td style={{ paddingBottom: 5 }}>{origMethod.xp}</td>
				{isActive ? (
					<>
						<td style={{ paddingBottom: 5 }}>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
								{origMethod.items.map((itemData, idx) => {
									const item = Object.values(Items).find((i) => i.id === itemData.item.id);
									const amount = typeof itemData.amount === 'function' ? itemData.amount(from, nextLevel) : itemData.amount;

									return (
										<div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
											<Tooltip content={itemData.item.label} position="top">
												<img
													src={getItemIconUrl(item?.id ?? 0, item?.label)}
													width="24"
													height="24"
													alt={itemData.item.label}
													style={{ marginRight: '4px' }}
												/>
											</Tooltip>
											<span>
												{(amount * itemsToNext).toLocaleString("en-AU", {
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
								{origMethod.returns?.map((outputData, idx) => {
									if (!outputData.item) {
										console.warn(`No item found for output: ${JSON.stringify(outputData)}`);
										return <span>-</span>;
									}
									const outputItem = Object.values(Items).find((i) => i.id === outputData.item.id);
									console.log({ outputData, outputItem });
									const amount = typeof outputData.amount === 'function' ? outputData.amount(from, nextLevel) : outputData.amount;

									return (
										<div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
											<Tooltip
												content={outputData.item.label}
												position="top"
											>
												<img
													src={getItemIconUrl(outputItem?.id ?? 0, outputItem?.label)}
													width="24"
													height="24"
													alt={outputData.item.label}
													style={{ marginRight: '4px' }}
													data-id={outputData.item.id}
												/>
											</Tooltip>
											<span>
												{(amount * itemsToNext).toLocaleString("en-AU", {
													maximumFractionDigits: 0,
													style: 'decimal',
												})}
											</span>
											{
												outputData.link && (
													<Tooltip
														content={"View burn rates"}
														position="top"
													>
														<a style={{ marginLeft: 5, color: 'var(--osrs-gold)' }} aria-label="view burn rates" href={outputData.link} target="_blank" rel="noopener noreferrer">
															<InfoIcon size={12} />
														</a>
													</Tooltip>
												)
											}
										</div>
									)
								}) || <span>-</span>}
							</div>
						</td>
						{/* New Profit/Loss column */}
						<td style={{ paddingBottom: 5 }}>
							{(() => {
								const inputItems = origMethod.items
								const outputItems = origMethod.returns

								let costPerAction = 0;

								inputItems.forEach(item => {
									const amount = typeof item.amount === 'function' ? item.amount(from, nextLevel) : item.amount;
									const cost = getItemPrice(item.item?.id) ?? 0;
									costPerAction += cost * amount;
								});

								outputItems.forEach(item => {
									const cost = getItemPrice(item.item?.id) ?? 0;
									const amount = typeof item.amount === 'function' ? item.amount(from, nextLevel) : item.amount;
									costPerAction -= cost * amount;
								});

								const totalCost = -(costPerAction * itemsToNext);

								const isProfit = totalCost < 0;

								return (
									<Tooltip
										content={isProfit ? "Profit from this method" : "Cost of this method"}
										position="top"
									>
										<span style={{
											color: !isProfit ? '#4CAF50' : '#ff4747',
											fontWeight: 'bold',
										}}>
											{totalCost.toLocaleString("en-AU", {
												notation: 'compact',
											})} gp
										</span>
									</Tooltip>
								);
							})()}
						</td>
						<td>
							<Tooltip
								content={`Estimated time to complete: ${calculateTimeToComplete()}`}
								position="top"
							>
								<span>{calculateTimeToComplete()}</span>
							</Tooltip>
						</td>
					</>
				) : (
					<td colSpan={4} style={{ textAlign: 'center', color: '#4CAF50', fontWeight: 'bold' }}>
						Completed
					</td>
				)}
			</tr>
		</Fragment>
	)
};

// Create a forwardRef version of MethodRow
const MethodRowWithRef = forwardRef<HTMLSpanElement, Props>((props, ref) => {
	// Your existing MethodRow implementation
	return (
		<span ref={ref}>
			{/* Your existing row content */}
			<MethodRow  {...props} />
		</span>
	);
});

// Export both versions
export { MethodRowWithRef };
export { MethodRow }