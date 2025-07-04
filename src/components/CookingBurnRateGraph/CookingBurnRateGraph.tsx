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
}

const getCookSuccessRate = (currentLevel: number, baseLevel: number, maxLevel: number, minRate: number = 0.6, maxRate: number = 1.0) => {
  if (currentLevel >= maxLevel) return maxRate;
  if (currentLevel <= baseLevel) return minRate;

  // Linear interpolation between min and max rates
  const levelRange = maxLevel - baseLevel;
  const levelProgress = currentLevel - baseLevel;
  return minRate + (maxRate - minRate) * (levelProgress / levelRange);
};

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
  foodName
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Define all possible modifier combinations
  const modifierCombinations = [
    { name: 'No modifiers', modifiers: [] },
    { name: 'Cooking gauntlets', modifiers: ['gauntlets'] },
    { name: 'Hosidius (Easy)', modifiers: ['hosidius_easy'] },
    { name: 'Hosidius (Elite)', modifiers: ['hosidius_elite'] },
    { name: 'Gauntlets + Hosidius (Easy)', modifiers: ['gauntlets', 'hosidius_easy'] },
    { name: 'Gauntlets + Hosidius (Elite)', modifiers: ['gauntlets', 'hosidius_elite'] }
  ];

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
    if (!chartRef.current) return;

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Generate data points for each level
    const labels = [];
    for (let level = baseLevel; level <= maxLevel; level++) {
      labels.push(level);
    }

    // Generate datasets for each modifier combination
    const datasets = modifierCombinations
      .filter(combo => {
        // Filter out combinations that aren't applicable for this food
        if ((combo.modifiers.includes('hosidius_easy') || combo.modifiers.includes('hosidius_elite')) && 
            foodName === 'Shark') {
          return false;
        }
        return true;
      })
      .map((combo, index) => {
        // Check if this combination matches the selected modifiers
        const isSelected = selectedModifiers.length === combo.modifiers.length && 
                          combo.modifiers.every(mod => selectedModifiers.includes(mod));
        
        // Generate data points for this modifier combination
        const data = labels.map(level => {
          const successRate = getCookSuccessRate(level, baseLevel, maxLevel, minRate, maxRate);
          return applyCookingModifiers(successRate, combo.modifiers) * 100; // Convert to percentage
        });

        return {
          label: combo.name,
          data: data,
          borderColor: colors[index],
          backgroundColor: colors[index],
          borderWidth: isSelected ? 3 : 1.5,
          pointRadius: 0,
          tension: 0.1,
          fill: false,
          borderDash: isSelected ? [] : [5, 5]
        };
      });

    // Create the chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
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
            position: 'top',
            labels: {
              color: '#ddd',
              usePointStyle: true,
              padding: 15
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
              }
            }
          },
          annotation: {
            annotations: {
              stopBurningLine: {
                type: 'line',
                yMin: maxRate * 100,
                yMax: maxRate * 100,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                borderWidth: 1,
                borderDash: [5, 5],
                label: {
                  content: `Stop burning at level ${maxLevel}`,
                  enabled: true,
                  position: 'end',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: '#fff',
                  font: {
                    size: 10
                  }
                }
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
            min: 0,
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

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [baseLevel, maxLevel, minRate, maxRate, selectedModifiers, foodName]);

  return (
    <div className={styles.graphContainer}>
      <canvas ref={chartRef} className={styles.graph} />
    </div>
  );
};

export default CookingBurnRateGraph;