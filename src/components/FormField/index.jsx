import { useState } from 'react';
import PropTypes from 'prop-types';
import assets from '../../constants/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FormField = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    icon: icon,
    error,
    borderColor = 'border-button/50',
    borderRadius = 'rounded-lg',
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const isTextarea = type === 'textarea';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const baseClass = 'flex-1 py-3 outline-none bg-transparent text-lg placeholder-gray-400';

    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={name} className="block text-lg mb-1 text-gray-700">
                    {label}
                </label>
            )}

            <div
                className={`flex items-center gap-2 px-3 py-2 border ${borderRadius} ${
                    error ? 'border-tertiary' : borderColor
                } focus-within:ring-2 focus-within:ring-button ${isTextarea ? 'items-start' : ''}`}
            >
                {icon === assets.icon.lock && icon ? (
                    <img src={icon} alt="icon" className="mr-3 w-8 h-8 text-gray-400" />
                ) : (
                    <FontAwesomeIcon icon={icon} className="mr-3 text-gray-400" />
                )}

                {isTextarea ? (
                    <textarea
                        id={name}
                        name={name}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        className={`${baseClass} resize-none h-24`}
                    />
                ) : (
                    <input
                        id={name}
                        name={name}
                        type={inputType}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        className={baseClass}
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

FormField.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'password', 'textarea', 'select', 'email', 'number']),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    icon: PropTypes.elementType,
    error: PropTypes.string,
    borderColor: PropTypes.string,
    borderRadius: PropTypes.string,
};

export default FormField;
