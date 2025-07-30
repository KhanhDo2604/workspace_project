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
        <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
            {label && <label className="block text-lg mb-1 text-gray-600">{label}</label>}

            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`flex items-center justify-between px-4 py-2 rounded-lg min-w-[150px] text-lg transition ${selectedStyle}`}
            >
                <span>{selected?.label || placeholder}</span>
                <FontAwesomeIcon icon={assets.icon.dropdown} className="w-6 h-6" />
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-2 w-full rounded-lg bg-white ring-1 ring-black ring-opacity-5">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onSelect(option);
                                setIsOpen(false);
                            }}
                            className="flex w-full px-4 py-2 text-left hover:bg-gray-100 text-lg text-gray-800"
                        >
                            {option.icon && <option.icon className="w-6 h-6 mr-2 text-gray-500" />}
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
};

export default Dropdown;
