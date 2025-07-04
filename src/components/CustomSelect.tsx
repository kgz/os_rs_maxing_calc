import React, { useState, useRef, useEffect } from 'react';
import styles from './CustomSelect.module.css';

export interface CustomSelectProps<T> {
    options: T[];  // Change this from T to T[]
    getOptionLabel: (option: T) => string;
    getOptionValue?: (option: T) => string | number;
    renderOption?: (option: T, isSelected: boolean) => React.ReactNode;
    renderSelectedValue?: (option: T | T[]) => React.ReactNode;
    placeholder?: string;
    disabled?: boolean;
    showSearch?: boolean;
    searchFn?: (option: T, searchText: string) => boolean;
    searchPlaceholder?: string;
}

interface CustomSingleSelectProps<T> extends CustomSelectProps<T> {
    value: T | undefined;
    multiple?: false;
    onChange: (value: T, index: number) => void;
	renderTags: (selectedOptions: T[]) => React.ReactNode;
}

interface CustomMultipleSelectProps<T> extends CustomSelectProps<T> {
    multiple?: true;
    onChange: (value: T[], index: number) => void;
    value: T[] | undefined;
    renderTags?: (selectedOptions: T[]) => React.ReactNode;
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
    searchPlaceholder = 'Search...',
    multiple = false,
	renderTags = undefined,
}: CustomSingleSelectProps<T> | CustomMultipleSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
    const selectRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const selectedOptionRef = useRef<HTMLDivElement>(null);

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

    // Determine dropdown position when opening
    useEffect(() => {
        if (isOpen && selectRef.current) {
            const selectRect = selectRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Check if the select is in the bottom half of the viewport
            const isInBottomHalf = selectRect.top > viewportHeight / 2;
            
            setDropdownPosition(isInBottomHalf ? 'top' : 'bottom');
        }
    }, [isOpen]);

    // Scroll to the selected option when dropdown opens
    useEffect(() => {
        if (isOpen && selectedOptionRef.current) {
            setTimeout(() => {
                selectedOptionRef.current?.scrollIntoView({ 
                    block: 'nearest',
                    inline: 'nearest'
                });
            }, 0);
        }
    }, [isOpen]);

    const handleSelect = (option: T, index: number) => {
        if (multiple) {
            // We know we're in multiple mode, so cast to the appropriate type
            const multipleProps = { multiple, value, onChange } as CustomMultipleSelectProps<T>;
            const currentValue = multipleProps.value || [];
            const isSelected = currentValue.some(item => getOptionValue(item) === getOptionValue(option));
            
            let newValue: T[];
            if (isSelected) {
                // Remove the option if already selected
                newValue = currentValue.filter(item => getOptionValue(item) !== getOptionValue(option));
            } else {
                // Add the option if not already selected
                newValue = [...currentValue, option];
            }
            
            multipleProps.onChange(newValue, index);
            // Don't close dropdown for multiple select
        } else {
            // We know we're in single mode, so cast to the appropriate type
            const singleProps = { value, onChange } as CustomSingleSelectProps<T>;
            singleProps.onChange(option, index);
            setIsOpen(false);
        }
    };

    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const isOptionSelected = (option: T) => {
        if (multiple && Array.isArray(value)) {
            return value.some(item => getOptionValue(item) === getOptionValue(option));
        }
        return value && getOptionValue(option) === getOptionValue(value as T);
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
                        <div className={styles.selectedValue}>
                            {multiple && Array.isArray(value) ? (
                                multiple && renderTags ? 
                                    renderTags(value) :
                                    value.length > 0 ? 
                                        `${value.length} selected` : 
                                        placeholder
                            ) : (
                                getOptionLabel(value as T)
                            )}
                        </div>
                    )
                ) : (
                    <div className={styles.placeholder}>{placeholder}</div>
                )}
                <div className={styles.arrow}>▼</div>
            </div>

            {isOpen && (
                <div 
                    ref={dropdownRef}
                    className={`${styles.dropdown} ${dropdownPosition === 'top' ? styles.dropdownTop : ''}`}
                >
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
                        filteredOptions.map((option, index) => {
                            const selected = isOptionSelected(option);
                            return (
                                <div
                                    key={`${getOptionValue(option)}-${index}`}
                                    ref={selected && !multiple ? selectedOptionRef : null}
                                    className={`${styles.option} ${selected ? styles.selected : ''}`}
                                    onClick={() => handleSelect(option, index)}
                                >
                                    {multiple && (
                                        <span className={styles.checkbox}>
                                            {selected ? '✓' : ''}
                                        </span>
                                    )}
                                    {renderOption ? (
                                        renderOption(option, selected === true)
                                    ) : (
                                        getOptionLabel(option)
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className={styles.noOptions}>No options found</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CustomSelect;