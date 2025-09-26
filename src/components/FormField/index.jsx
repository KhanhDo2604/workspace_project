import { useState } from 'react';
import assets from '../../constants/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from '../ui/input';

const FormField = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    onBlur,
    placeholder,
    icon: icon,
    error,
    borderColor = 'border-button/50',
    borderRadius = 'rounded-lg',
    className = '',
    isRequired = false,
    widthFull = false,
    disable = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const isTextarea = type === 'textarea';
    const isDate = type === 'date';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const baseClass = 'flex-1 py-3 outline-none bg-transparent text-lg placeholder-gray-400 border-none';

    return (
        <div className={`${widthFull ? 'w-full' : 'w-fit'}`}>
            {label && (
                <label htmlFor={name} className="block text-lg mb-1 text-gray-700">
                    {label}
                </label>
            )}

            <div
                className={`flex items-center gap-2 ${className} border ${borderRadius} ${
                    error ? 'border-tertiary' : borderColor
                } focus-within:ring-2 focus-within:ring-button ${isTextarea ? 'items-start' : ''}`}
            >
                {icon === assets.icon.lock && icon ? (
                    <img src={icon} alt="icon" className="w-8 h-8 text-gray-400" />
                ) : (
                    <FontAwesomeIcon icon={icon} className={` text-gray-400 ${isDate ? 'cursor-pointer' : ''}`} />
                )}

                {isTextarea ? (
                    <textarea
                        id={name}
                        name={name}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        required={isRequired}
                        className={`${baseClass} resize-none h-24`}
                        disabled={disable}
                    />
                ) : (
                    <Input
                        id={name}
                        name={name}
                        type={inputType}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        required={isRequired}
                        className={`${baseClass} ${isDate ? 'cursor-pointer' : ''}`}
                        disabled={disable}
                    />
                )}

                {isPassword && (
                    <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="text-gray-400">
                        {showPassword ? (
                            <FontAwesomeIcon icon={assets.icon.eyeOff} />
                        ) : (
                            <FontAwesomeIcon icon={assets.icon.eyeOpen} />
                        )}
                    </button>
                )}
            </div>

            {error && <p className="text-tertiary text-base mt-1">{error}</p>}
        </div>
    );
};

export default FormField;
