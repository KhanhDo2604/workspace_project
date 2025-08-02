// components/Dropdown.js
import { useState, useRef, useEffect } from 'react';
import assets from '../../constants/icon';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Dropdown = ({
    label,
    options,
    onSelect,
    selected,
    placeholder = 'Select an option',
    className = '',
    variant = 'secondary',
    size = 'md',
    isRequired = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const variantClasses = {
        primary: 'bg-button text-headline',
        secondary: 'bg-white text-black hover:bg-gray-50',
    };

    const borderClasses = {
        primary: 'border border-button',
        secondary: 'border border-gray-300',
    };

    const selectedStyle = `${variantClasses[variant]} ${borderClasses[variant]}`;

    return (
        <div className={`relative inline-block ${className}`} ref={dropdownRef}>
            {label && <label className="block text-lg mb-1 text-gray-600">{label}</label>}

            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`flex items-center justify-between gap-2 px-4 ${
                    size === 'lg' ? 'py-5' : 'py-2'
                } rounded-xl min-w-[100px] text-lg transition ${selectedStyle} w-full`}
            >
                <span>{selected || placeholder}</span>
                <FontAwesomeIcon icon={assets.icon.dropdown} className="w-6 h-6" />
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-3 inline-block min-w-max rounded-xl bg-white shadow-lg right-0">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onSelect(option);
                                setIsOpen(false);
                            }}
                            className="flex w-full px-4 py-2 text-left hover:bg-gray-100 text-lg hover:rounded-xl text-gray-800 items-center"
                        >
                            {option.icon && (
                                <FontAwesomeIcon icon={option.icon} className="w-6 h-6 mr-2 text-gray-500" />
                            )}
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

Dropdown.propTypes = {
    label: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.any.isRequired,
            icon: PropTypes.elementType,
        }),
    ).isRequired,
    onSelect: PropTypes.func.isRequired,
    selected: PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any,
    }),
    placeholder: PropTypes.string,
    className: PropTypes.string,
    variant: PropTypes.oneOf(['primary', 'secondary']),
    size: PropTypes.oneOf(['md', 'lg']),
    isRequired: PropTypes.bool,
};

export default Dropdown;
