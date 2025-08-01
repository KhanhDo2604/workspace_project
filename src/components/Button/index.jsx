import PropTypes from 'prop-types';
import assets from '../../constants/icon';
import { Link } from 'react-router-dom';

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    onClick,
    disabled = false,
    fullWidth = false,
    type = 'button',
    startIcon,
    endIcon,
    isLoading = false,
    className = '',
    to,
}) => {
    // Base button classes
    let baseClasses = 'flex items-center justify-center font-medium transition-colors hover:cursor-pointer';

    let Element = to ? Link : 'button';

    // Size classes
    const sizeClasses = {
        small: 'px-3 py-1.5 text-sm',
        medium: 'px-4 py-2 text-lg',
        large: 'px-6 py-3 text-xl',
    };

    // Variant classes
    const variantClasses = {
        primary: 'text-headline bg-button',
        secondary: 'text-button border border-1 border-button',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
        text: 'text-button p-0 text-lg',
    };

    const disabledClasses = 'opacity-50 cursor-not-allowed';

    const fullWidthClass = 'w-full';

    // Combine all classes
    const classes = [
        baseClasses,
        variant === 'text' ? '' : sizeClasses[size],
        variantClasses[variant],
        disabled || isLoading ? disabledClasses : '',
        fullWidth ? fullWidthClass : '',
        className,
    ].join(' ');

    const googleIcon = variant === 'google' && !startIcon ? <img src={assets.icon.google} alt="Google Icon" /> : null;

    return (
        <Element type={type} className={classes} onClick={onClick} disabled={disabled || isLoading} to={to}>
            <>
                {googleIcon}
                {startIcon && <span className="mr-2 w-6 h-6 ">{startIcon}</span>}
                {children}
                {endIcon && <span className="ml-2 w-6 h-6">{endIcon}</span>}
            </>
        </Element>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'text']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    startIcon: PropTypes.node,
    endIcon: PropTypes.node,
    isLoading: PropTypes.bool,
    className: PropTypes.string,
    to: PropTypes.string,
};

export default Button;
