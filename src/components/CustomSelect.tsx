import React, { useState, useRef, useEffect } from 'react';
import styles from './CustomSelect.module.css';

export interface CustomSelectProps<T> {
	options: T[];
	value: T;
	onChange: (value: T) => void;
	getOptionLabel: (option: T) => string;
	getOptionValue?: (option: T) => string | number;
	renderOption?: (option: T, isSelected: boolean) => React.ReactNode;
	renderSelectedValue?: (option: T) => React.ReactNode;
	placeholder?: string;
	disabled?: boolean;
	showSearch?: boolean;
	searchFn?: (option: T, searchText: string) => boolean;
	searchPlaceholder?: string;
}

function CustomSelect<T>({
	options,
	value,
	onChange,
	getOptionLabel,
	getOptionValue = (option: T) => getOptionLabel(option),
	renderOption,
	renderSelectedValue,
	placeholder = 'Select...',
	disabled = false,
	showSearch = false,
	searchFn = (option: T, searchText: string) =>
		getOptionLabel(option).toLowerCase().includes(searchText.toLowerCase()),
	searchPlaceholder = 'Search...'
}: CustomSelectProps<T>) {
	const [isOpen, setIsOpen] = useState(false);
	const [searchText, setSearchText] = useState('');
	const selectRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Focus search input when dropdown opens
	useEffect(() => {
		if (isOpen && showSearch && searchInputRef.current) {
			setTimeout(() => {
				searchInputRef.current?.focus();
			}, 10);
		}
	}, [isOpen, showSearch]);

	// Reset search when dropdown closes
	useEffect(() => {
		if (!isOpen) {
			setSearchText('');
		}
	}, [isOpen]);

	const handleSelect = (option: T) => {
		onChange(option);
		setIsOpen(false);
	};

	const toggleDropdown = () => {
		if (!disabled) {
			setIsOpen(!isOpen);
		}
	};

	const isOptionSelected = (option: T) => {
		return getOptionValue(option) === getOptionValue(value);
	};

	const filteredOptions = showSearch && searchText
		? options.filter(option => searchFn(option, searchText))
		: options;

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value);
	};

	const handleSearchKeyDown = (e: React.KeyboardEvent) => {
		// Prevent dropdown from closing when typing in search box
		e.stopPropagation();
	};

	return (
		<div
			className={`${styles.selectContainer} ${disabled ? styles.disabled : ''}`}
			ref={selectRef}
		>
			<div
				className={`${styles.selectControl} ${isOpen ? styles.open : ''}`}
				onClick={toggleDropdown}
			>
				{value ? (
					renderSelectedValue ? (
						renderSelectedValue(value)
					) : (
						<div className={styles.selectedValue}>{getOptionLabel(value)}</div>
					)
				) : (
					<div className={styles.placeholder}>{placeholder}</div>
				)}
				<div className={styles.arrow}>▼</div>
			</div>

			{isOpen && (
				<div className={styles.dropdown}>
					{showSearch && (
						<div className={styles.searchContainer} onClick={(e) => e.stopPropagation()}>
							<input
								ref={searchInputRef}
								type="text"
								className={styles.searchInput}
								value={searchText}
								onChange={handleSearchChange}
								onKeyDown={handleSearchKeyDown}
								placeholder={searchPlaceholder}
								autoComplete="off"
							/>
						</div>
					)}

					{filteredOptions.length > 0 ? (
						filteredOptions.map((option, index) => (
							<div
								key={`${getOptionValue(option)}-${index}`}
								className={`${styles.option} ${isOptionSelected(option) ? styles.selected : ''}`}
								onClick={() => handleSelect(option)}
							>
								{renderOption ? (
									renderOption(option, isOptionSelected(option))
								) : (
									getOptionLabel(option)
								)}
							</div>
						))
					) : (
						<div className={styles.noOptions}>No options found</div>
					)}
				</div>
			)}
		</div>
	);
}

export default CustomSelect;