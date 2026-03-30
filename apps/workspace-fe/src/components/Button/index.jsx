import { forwardRef } from 'react';
import assets from '../../constants/icon';
import { Link } from 'react-router-dom';

const Button = forwardRef(
    (
        {
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
        },
        ref,
    ) => {
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
            primary: ' bg-button', //text-headline
            secondary: 'text-button border border-1 border-button',
            outline: '',
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

        const googleIcon =
            variant === 'google' && !startIcon ? <img src={assets.icon.google} alt="Google Icon" /> : null;

        return (
            <Element
                ref={ref}
                type={type}
                className={`${classes} hover:shadow-md`}
                onClick={onClick}
                disabled={disabled || isLoading}
                to={to}
            >
                <>
                    {googleIcon}
                    {startIcon && <span className="mr-2 w-6 h-6 ">{startIcon}</span>}
                    {children}
                    {endIcon && <span className="ml-2 w-6 h-6">{endIcon}</span>}
                </>
            </Element>
        );
    },
);

export default Button;
