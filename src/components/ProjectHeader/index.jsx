import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../Button';
import assets from '../../constants/icon';
import Dropdown from '../Dropdown';
import { useDispatch } from 'react-redux';
import { dialogActions } from '../../store/slices/DialogSlice';

function ProjectHeader({ teamName, teamDescription, teamMembers }, onlineUsers) {
    const dispatch = useDispatch();
    console.log('Online users:', onlineUsers);

    const maxShown = 3;
    const collapseThreshold = 5;
    const shouldCollapse = onlineUsers.length > collapseThreshold;
    const displayed = shouldCollapse ? onlineUsers.slice(0, maxShown) : onlineUsers;

    return (
        <div className="w-full flex flex-col bg-white shadow-sm">
            {/* Left: Team info */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 p-3">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <span>#{teamName}</span>
                    <span className="text-base text-gray-500 font-medium">{teamDescription}</span>
                </div>
                {/* <div className="flex items-center -space-x-2">
                    {displayed.map((member, idx) => (
                        <img
                            key={member.id ?? member.email ?? idx}
                            src={member.avatar}
                            alt={member.name ?? 'user'}
                            title={member.name}
                            className="w-8 h-8 rounded-full border-2 border-white"
                        />
                    ))}

                    {shouldCollapse && (
                        <span className="text-sm text-gray-600 ml-2">+{onlineUsers.length - maxShown}</span>
                    )}
                </div> */}
            </div>

            {/* Middle: App icons */}
            <div className="flex items-center justify-between px-4 p-2">
                <div className="flex items-center gap-3">
                    <Button
                        variant="text"
                        startIcon={<FontAwesomeIcon icon={assets.icon.trello} size="lg" />}
                        to={'task-board'}
                        className="hover:shadow-white"
                    >
                        <span className="text-base text-gray-600">To do</span>
                    </Button>
                    <Button
                        variant="text"
                        startIcon={<FontAwesomeIcon icon={assets.icon.jira} size="lg" />}
                        to={'time-line'}
                        className="hover:shadow-white"
                    >
                        <span className="text-base text-gray-600">Jira board</span>
                    </Button>
                </div>
                <Dropdown
                    options={[
                        { label: 'Instant meeting', value: 'instant_meeting', icon: assets.icon.video },
                        { label: 'Scheduled meeting', value: 'scheduled_meeting', icon: assets.icon.clock },
                    ]}
                    onSelect={(option) => {
                        if (option.value === 'scheduled_meeting') {
                            dispatch(dialogActions.openAddScheduleDialog());
                        } else {
                            // Handle instant meeting
                        }
                    }}
                    placeholder="Create Meeting"
                    variant="primary"
                    className="hover:shadow-lg"
                />
            </div>
        </div>
    );
}

export default ProjectHeader;
