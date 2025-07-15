import React, { useEffect, useMemo, useRef } from 'react';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import styles from './CookingBurnRateGraph.module.css';

// Register the annotation plugin
Chart.register(annotationPlugin);

interface CookingBurnRateGraphProps {
	baseLevel: number;
	maxLevel: number;
	minRate: number;
	maxRate: number;
	selectedModifiers: string[];
	foodName: string;
	allowedModifiers: string[];
	fromLevel?: number; // New prop for highlighting from level
	toLevel?: number;   // New prop for highlighting to level
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

// Add this helper function to create a highlight dataset
const createHighlightDataset = (labels: number[], fromLevel?: number, toLevel?: number) => {
    // If either fromLevel or toLevel is undefined, don't create a highlight
    if (fromLevel === undefined || toLevel === undefined) {
        return null;
    }

    // Create data points that will form a filled area for the range
    const data = labels.map(level => {
        // Only include data points within the range
        if (level >= fromLevel && level <= toLevel) {
            return 100; // Full height of the chart
        }
        return 0; // Return 0 instead of null to satisfy number[] type
    });

    return {
        label: 'Selected Range',
        data: data,
        backgroundColor: 'rgba(255, 215, 0, 0.1)', // Gold with transparency
        borderColor: 'rgba(255, 215, 0, 0.3)',
        borderWidth: 1,
        pointRadius: 0,
        fill: true,
        tension: 0, // Set tension to 0 for straight lines
        stepped: 'before', // Use stepped line for sharp vertical edges
        order: 10, // Draw behind other datasets
        hidden: false
    };
};

const CookingBurnRateGraph: React.FC<CookingBurnRateGraphProps> = ({
	baseLevel,
	maxLevel,
	minRate,
	maxRate,
	selectedModifiers,
	foodName,
	allowedModifiers,
	fromLevel,
	toLevel
}) => {
	const chartRef = useRef<HTMLCanvasElement>(null);
	const chartInstance = useRef<Chart | null>(null);
	const chartId = useRef(`cooking-chart-${Math.random().toString(36).substring(2, 9)}`);

	// Define all possible modifier combinations based on allowed modifiers
	const modifierCombinations = useMemo(() => [
		{ name: 'No modifiers', modifiers: [] }
	] as { name: string, modifiers: string[] }[], []);

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
	const colors = useMemo(() => [
		'#ff4747', // Red - No modifiers
		'#4CAF50', // Green - Cooking gauntlets
		'#2196F3', // Blue - Hosidius Easy
		'#9C27B0', // Purple - Hosidius Elite
		'#FF9800', // Orange - Gauntlets + Hosidius Easy
		'#FFEB3B'  // Yellow - Gauntlets + Hosidius Elite
	], []);

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

		// Debug log to check values
		console.log('Rendering chart with highlight range:', { fromLevel, toLevel });

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
			borderDash?: number[];
			order: number;
			avgSuccessRate: number; // Add this to store the average success rate
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

				// Get unique names to avoid duplication
				const uniqueNames = [...new Set(matchingDatasets.map(d => d.name))];

				// Combine the unique names
				const combinedName = uniqueNames.join(' / ');

				// Check if any of the matching datasets is selected
				const isAnySelected = matchingDatasets.some(d => d.isSelected);

				// Calculate average success rate for sorting
				const avgSuccessRate = dataset.data.reduce((sum, val) => sum + val, 0) / dataset.data.length;

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
					order: isAnySelected ? 1 : 2,
					avgSuccessRate: avgSuccessRate
				});
			}
		});

		// Sort datasets by average success rate (highest to lowest)
		uniqueDataSets.sort((a, b) => b.avgSuccessRate - a.avgSuccessRate);

		// Create datasets array starting with uniqueDataSets
		// Remove avgSuccessRate property before adding to chart
		const datasets = uniqueDataSets.map(({ avgSuccessRate, ...rest }) => rest);

		// Add highlight dataset if fromLevel and toLevel are defined
		const highlightDataset = createHighlightDataset(labels, fromLevel, toLevel);
		if (highlightDataset) {
			datasets.unshift(highlightDataset);
		}

		// Create the chart with a unique ID
		chartInstance.current = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: datasets
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				animation: false, // Disable all animations
				transitions: {
					active: {
						animation: {
							duration: 0 // Disable transition animations
						}
					}
				},
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
							filter: function (item) {
								// Don't show the highlight dataset in the legend
								return item.text !== 'Selected Range';
							},
							generateLabels: function(chart) {
							    const originalLabels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
							    
							    // Modify each label to include line breaks
							    return originalLabels.map(label => {
							        // Add line breaks after each slash while keeping the slash
							        if (label.text) {
							            label.text = label.text.replace(/ \/ /g, ' / \n');
							        }
							        return label;
							    });
							},
							font: {
								lineHeight: 1.2
							}
						}
					},
					tooltip: {
						mode: 'index',
						intersect: false,
						callbacks: {
							label: function (context) {
								// Don't show tooltip for highlight dataset
								if (context.dataset.label === 'Selected Range') {
									return '';
								}
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
	}, [baseLevel, maxLevel, minRate, maxRate, selectedModifiers, foodName, allowedModifiers, fromLevel, toLevel, modifierCombinations, colors]);

	return (
		<div className={styles.graphContainer}>
			<canvas
				id={chartId.current}
				ref={chartRef}
				className={styles.graph}
			/>
			{fromLevel !== undefined && toLevel !== undefined && (
				<div className={styles.customLegend}>
					<div className={styles.legendItem}>
						<span 
							className={styles.legendColor} 
							style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.3)' }}
						></span>
						<span className={styles.legendText}>
							Selected Range (Levels {fromLevel} - {toLevel})
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default CookingBurnRateGraph;