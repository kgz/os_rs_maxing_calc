import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import styles from './CookingBurnRateGraph.module.css';

interface CookingBurnRateGraphProps {
	baseLevel: number;
	maxLevel: number;
	minRate: number;
	maxRate: number;
	selectedModifiers: string[];
	foodName: string;
	allowedModifiers: string[]; // New prop for allowed modifiers
}

// Helper function to calculate success rate based on level
const getCookSuccessRate = (currentLevel: number, baseLevel: number, maxLevel: number, minRate: number = 0.6, maxRate: number = 1.0) => {
	if (currentLevel >= maxLevel) return maxRate;
	if (currentLevel <= baseLevel) return minRate;

	// Linear interpolation between min and max rates
	const levelRange = maxLevel - baseLevel;
	const levelProgress = currentLevel - baseLevel;
	return minRate + (maxRate - minRate) * (levelProgress / levelRange);
};

// Helper function to apply cooking modifiers to success rates
const applyCookingModifiers = (baseSuccessRate: number, modifiers?: string[]) => {
	let modifiedRate = baseSuccessRate;

	if (modifiers && Array.isArray(modifiers)) {
		// Check for cooking gauntlets
		if (modifiers.includes('gauntlets')) {
			// Increase success rate by approximately 10%
			modifiedRate = Math.min(1.0, modifiedRate + 0.1);
		}

		// Check for Hosidius range - Easy diary
		if (modifiers.includes('hosidius_easy')) {
			// Increase success rate by 5%
			modifiedRate = Math.min(1.0, modifiedRate + 0.05);
		}

		// Check for Hosidius range - Elite diary
		if (modifiers.includes('hosidius_elite')) {
			// Increase success rate by 10%
			modifiedRate = Math.min(1.0, modifiedRate + 0.1);
		}
	}

	return modifiedRate;
};

const CookingBurnRateGraph: React.FC<CookingBurnRateGraphProps> = ({
	baseLevel,
	maxLevel,
	minRate,
	maxRate,
	selectedModifiers,
	foodName,
	allowedModifiers
}) => {
	const chartRef = useRef<HTMLCanvasElement>(null);
	const chartInstance = useRef<Chart | null>(null);
	const chartId = useRef(`cooking-chart-${Math.random().toString(36).substring(2, 9)}`);

	// Define all possible modifier combinations based on allowed modifiers
	const modifierCombinations = [
		{ name: 'No modifiers', modifiers: [] }
	] as { name: string, modifiers: string[] }[];

	// Only add gauntlets if they're allowed
	if (allowedModifiers.includes('gauntlets')) {
		modifierCombinations.push({ name: 'Cooking gauntlets', modifiers: ['gauntlets'] });
	}

	// Only add Hosidius options if they're allowed
	if (allowedModifiers.includes('hosidius_easy')) {
		modifierCombinations.push({ name: 'Hosidius (Easy)', modifiers: ['hosidius_easy'] });
	}

	if (allowedModifiers.includes('hosidius_elite')) {
		modifierCombinations.push({ name: 'Hosidius (Elite)', modifiers: ['hosidius_elite'] });
	}

	// Add combinations only if both components are allowed
	if (allowedModifiers.includes('gauntlets') && allowedModifiers.includes('hosidius_easy')) {
		modifierCombinations.push({ name: 'Gauntlets + Hosidius (Easy)', modifiers: ['gauntlets', 'hosidius_easy'] });
	}

	if (allowedModifiers.includes('gauntlets') && allowedModifiers.includes('hosidius_elite')) {
		modifierCombinations.push({ name: 'Gauntlets + Hosidius (Elite)', modifiers: ['gauntlets', 'hosidius_elite'] });
	}

	// Colors for different modifier combinations
	const colors = [
		'#ff4747', // Red - No modifiers
		'#4CAF50', // Green - Cooking gauntlets
		'#2196F3', // Blue - Hosidius Easy
		'#9C27B0', // Purple - Hosidius Elite
		'#FF9800', // Orange - Gauntlets + Hosidius Easy
		'#FFEB3B'  // Yellow - Gauntlets + Hosidius Elite
	];

	useEffect(() => {
		// Clean up function to destroy chart when component unmounts
		return () => {
			if (chartInstance.current) {
				chartInstance.current.destroy();
				chartInstance.current = null;
			}
		};
	}, []);

	useEffect(() => {
		if (!chartRef.current) return;

		// Destroy previous chart if it exists
		if (chartInstance.current) {
			chartInstance.current.destroy();
			chartInstance.current = null;
		}

		const ctx = chartRef.current.getContext('2d');
		if (!ctx) return;

		// Generate data points for each level
		const labels: number[] = [];
		for (let level = baseLevel; level <= maxLevel; level++) {
			labels.push(level);
		}

		// Calculate data for each modifier combination
		const dataByModifiers = modifierCombinations.map((combo, index) => {
			// Check if this combination matches the selected modifiers
			const isSelected = selectedModifiers.length === combo.modifiers.length &&
				combo.modifiers.every(mod => selectedModifiers.includes(mod));

			// Generate data points for this modifier combination
			const data = labels.map(level => {
				const successRate = getCookSuccessRate(level, baseLevel, maxLevel, minRate, maxRate);
				return applyCookingModifiers(successRate, combo.modifiers) * 100; // Convert to percentage
			});

			return {
				name: combo.name,
				data: data,
				color: colors[index % colors.length], // Use modulo to ensure we don't go out of bounds
				isSelected,
				modifiers: combo.modifiers
			};
		});

		// Group combinations with identical data
		const uniqueDataSets: {
			label: string;
			data: number[];
			borderColor: string;
			backgroundColor: string;
			borderWidth: number;
			pointRadius: number;
			tension: number;
			fill: boolean;
			borderDash: number[];
			order: number;
		}[] = [];
		const processedDataKeys = new Set();

		dataByModifiers.forEach((dataset) => {
			// Create a key based on the data values
			const dataKey = dataset.data.join(',');

			if (!processedDataKeys.has(dataKey)) {
				// This is a new unique data set
				processedDataKeys.add(dataKey);

				// Find all datasets with the same values
				const matchingDatasets = dataByModifiers.filter(
					d => d.data.join(',') === dataKey
				);

				// Combine their names
				const combinedName = matchingDatasets.map(d => d.name).join(' / ');

				// Check if any of the matching datasets is selected
				const isAnySelected = matchingDatasets.some(d => d.isSelected);

				uniqueDataSets.push({
					label: combinedName,
					data: dataset.data,
					borderColor: isAnySelected ? dataset.color : dataset.color + '99',
					backgroundColor: dataset.color,
					borderWidth: isAnySelected ? 3 : 1.5,
					pointRadius: 0,
					tension: 0.1,
					fill: false,
					borderDash: isAnySelected ? [] : [5, 5],
					order: isAnySelected ? 1 : 2
				});
			}
		});

		// Create the chart with a unique ID
		chartInstance.current = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: uniqueDataSets
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					title: {
						display: true,
						text: `${foodName} Cooking Success Rate`,
						color: '#fff',
						font: {
							size: 14
						}
					},
					legend: {
						display: true,
						position: 'top',
						labels: {
							color: '#ddd',
							usePointStyle: false,
							boxWidth: 30,
							boxHeight: 2,
							padding: 15,
							filter: function () {
								// Show all legends
								return true;
							}
						}
					},
					tooltip: {
						mode: 'index',
						intersect: false,
						callbacks: {
							label: function (context) {
								return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
							}
						}
					}
				},
				scales: {
					x: {
						title: {
							display: true,
							text: 'Level',
							color: '#ddd'
						},
						ticks: {
							color: '#ddd',
							maxTicksLimit: 10
						},
						grid: {
							color: 'rgba(255, 255, 255, 0.1)'
						}
					},
					y: {
						title: {
							display: true,
							text: 'Success Rate (%)',
							color: '#ddd'
						},
						min: Math.floor(minRate * 100) - 5,
						max: 100,
						ticks: {
							color: '#ddd'
						},
						grid: {
							color: 'rgba(255, 255, 255, 0.1)'
						}
					}
				}
			}
		});
	}, [baseLevel, maxLevel, minRate, maxRate, selectedModifiers, foodName, allowedModifiers]);

	return (
		<div className={styles.graphContainer}>
			<canvas
				id={chartId.current}
				ref={chartRef}
				className={styles.graph}
			/>
		</div>
	);
};

export default CookingBurnRateGraph;