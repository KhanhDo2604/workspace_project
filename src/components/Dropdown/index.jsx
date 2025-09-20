// components/Dropdown.js
import assets from '../../constants/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

const Dropdown = ({
    label,
    options,
    onSelect,
    selected,
    placeholder = 'Select an option',
    className = '',
    variant = 'secondary',
    size = 'md',
}) => {
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
        <DropdownMenu className={`relative inline-block ${className}`}>
            {label && <label className="block text-lg mb-1 text-gray-600">{label}</label>}
            <DropdownMenuTrigger asChild>
                <Button
                    className={`flex items-center justify-between gap-2 px-4 ${
                        size === 'lg' ? 'py-5' : 'py-2'
                    } rounded-xl min-w-[100px] text-lg transition ${selectedStyle} w-full`}
                >
                    <span>{selected || placeholder}</span>
                    <FontAwesomeIcon icon={assets.icon.dropdown} className="w-6 h-6" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    {options.map((option) => (
                        <DropdownMenuItem key={option.value} onClick={() => onSelect(option)}>
                            {option.icon && (
                                <FontAwesomeIcon icon={option.icon} className="w-6 h-6 mr-2 text-gray-500" />
                            )}
                            {option.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Dropdown;
