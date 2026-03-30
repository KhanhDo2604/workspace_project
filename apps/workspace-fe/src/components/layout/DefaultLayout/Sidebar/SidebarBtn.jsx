import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { colors } from '../../../../constants/color';
import { forwardRef } from 'react';

const SidebarBtn = forwardRef(({ icon, label, endIcon, to, isActive, onClick }, ref) => {
    let Element = to ? Link : 'button';

    const className = isActive
        ? 'bg-secondary text-headline rounded-lg'
        : 'hover:bg-secondary hover:text-headline hover:rounded-lg text-main';

    return (
        <Element
            ref={ref}
            className={`flex items-center justify-between mb-2 py-2 px-2 text-xl w-full ${className}`}
            to={to}
            onClick={onClick}
        >
            <div className="flex items-center">
                <FontAwesomeIcon icon={icon} className="mr-3 " color={colors.button} size="lg" />
                <p className="text-2xl">{label}</p>
            </div>
            {endIcon !== undefined ? (
                <div className="ml-auto">
                    <FontAwesomeIcon icon={endIcon} color={colors.button} size="lg" />
                </div>
            ) : null}
        </Element>
    );
});

export default SidebarBtn;
