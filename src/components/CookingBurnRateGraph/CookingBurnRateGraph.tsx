import React, { useEffect, useRef } from 'react';
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // X-axis labels (levels)
    for (let i = 0; i <= 10; i++) {
      const level = Math.floor(i * 10);
      const x = padding + (i * graphWidth) / 10;
      ctx.fillText(level.toString(), x, height - padding + 15);
    }

    // Y-axis labels (success rate)
    ctx.textAlign = 'right';
    for (let i = 0; i <= 10; i++) {
      const rate = i / 10;
      const y = height - padding - (rate * graphHeight);
      ctx.fillText((rate * 100).toFixed(0) + '%', padding - 5, y + 4);
    }

    // Title
    ctx.textAlign = 'center';
    ctx.font = '14px Arial';
    ctx.fillText(`${foodName} Cooking Success Rate`, width / 2, padding - 15);

    // Draw grid lines
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    
    // Horizontal grid lines
    for (let i = 1; i <= 10; i++) {
      const y = height - padding - (i / 10 * graphHeight);
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
    }
    
    // Vertical grid lines
    for (let i = 1; i <= 10; i++) {
      const x = padding + (i / 10 * graphWidth);
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
    }
    ctx.stroke();

    // Draw success rate line
    ctx.beginPath();
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;

    for (let level = 1; level <= 99; level++) {
      const successRate = getCookSuccessRate(level, baseLevel, maxLevel, minRate, maxRate);
      const modifiedRate = applyCookingModifiers(successRate, selectedModifiers);
      
      const x = padding + ((level - 1) / 98) * graphWidth;
      const y = height - padding - (modifiedRate * graphHeight);
      
      // Make line more transparent for levels below the base level
      if (level < baseLevel) {
        ctx.globalAlpha = 0.3;
      } else {
        ctx.globalAlpha = 1.0;
      }
      
      if (level === 1) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // Add legend
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(width - padding - 100, padding, 10, 10);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.fillText('Success Rate', width - padding - 85, padding + 9);

  }, [baseLevel, maxLevel, minRate, maxRate, selectedModifiers, foodName]);

  return (
    <div className={styles.graphContainer}>
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={300} 
        className={styles.graph}
      />
    </div>
  );
};

export default CookingBurnRateGraph;