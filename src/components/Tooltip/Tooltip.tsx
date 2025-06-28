import React, { useState, useRef, useEffect } from 'react';
import './Tooltip.css';

type TooltipProps = {
	children: React.ReactNode;
	content: React.ReactNode;
	position?: 'top' | 'bottom' | 'left' | 'right';
	delay?: number;
};

export const Tooltip: React.FC<TooltipProps> = ({
	children,
	content,
	position = 'top',
	delay = 300,
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [coords, setCoords] = useState({ x: 0, y: 0 });
	const tooltipRef = useRef<HTMLDivElement>(null);
	const childRef = useRef<HTMLDivElement>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleMouseEnter = () => {
		timeoutRef.current = setTimeout(() => {
			if (childRef.current) {
				const rect = childRef.current.getBoundingClientRect();
				setCoords({
					x: rect.left + rect.width / 2,
					y: position === 'top' ? rect.top : rect.bottom,
				});
				setIsVisible(true);
			}
		}, delay);
	};

	const handleMouseLeave = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setIsVisible(false);
	};

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return (
		<>
			<div
				ref={childRef}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				style={{ display: 'inline-block' }}
			>
				{children}
			</div>
			{isVisible && (
				<div
					ref={tooltipRef}
					className={`tooltip tooltip-${position}`}
					style={{
						position: 'fixed',
						left: position === 'left' ? coords.x - 8 : position === 'right' ? coords.x + 8 : coords.x,
						top: position === 'top' ? coords.y - 8 : position === 'bottom' ? coords.y + 8 : coords.y,
						transform: `translate(-50%, ${position === 'top' ? '-100%' : '0'})`,
					}}
				>
					{content}
				</div>
			)}
		</>
	);
};