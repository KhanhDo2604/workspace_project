import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../Button';
import assets from '../../constants/icon';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuGroup, DropdownMenuItem } from '../ui/dropdown-menu';
import MeetingModal from '../MeetingModal';
import { useEffect, useState } from 'react';
import { getMeetingsByProjectId } from '../../store/slices/MeetingSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { io } from 'socket.io-client';

function ProjectHeader({ teamName, teamDescription, teamMembers }) {
    const dispatch = useDispatch();
    const { projectId } = useParams();
    const [meetingRoom, setMeetingRoom] = useState(null);
    const projectMeetings = useSelector((state) => state.meeting.projectMeetings);
    const userList = teamMembers || [];
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const fetchProjectMeetings = async () => {
            await dispatch(getMeetingsByProjectId(projectId)).unwrap();
        };

        fetchProjectMeetings();
    }, [dispatch, projectId]);

    useEffect(() => {
        const socket = io(import.meta.env.VITE_WEBSOCKET_URL, { transports: ['websocket'] });
        setSocket(socket);

        socket.emit('join_project', projectId);

        socket.on('meeting_state_update', (state) => {
            console.log('📡 Meeting state updated:', state);
            setMeetingRoom(state);
        });

        return () => socket.disconnect();
    }, [projectId]);

    return (
        <div className="w-full flex flex-col bg-white shadow-sm">
            {/* Left: Team info */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 p-3">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <span>#{teamName}</span>
                    <span className="text-base text-gray-500 font-medium">{teamDescription}</span>
                </div>
                {/* show online users lists */}
                <div className="flex items-center -space-x-2">
                    {userList.slice(0, 3).map((user, idx) => {
                        return (
                            <Avatar
                                className="w-10 h-10 rounded-full border-2 border-white"
                                key={user.id ?? user.email ?? idx}
                            >
                                <AvatarImage src={user.avatar || assets.image.defaultAvatar} />
                                <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        );
                    })}
                    {userList.length > 3 && (
                        <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-white bg-gray-300 text-xs font-bold text-gray-700">
                            +{userList.length - 3}
                        </div>
                    )}
                </div>
            </div>

            {/* Middle: App icons */}
            <div className="flex items-center justify-between px-4 p-2">
                <div className="flex items-center gap-3">
                    <Button
                        variant="text"
                        startIcon={<FontAwesomeIcon icon={assets.icon.trello} size="lg" />}
                        to={`/task-board/${projectId}`}
                        className="hover:shadow-white"
                        onClick={() => {
                            dispatch({ type: 'sideBar/setCurrentTab', payload: `/task-board/${projectId}` });
                        }}
                    >
                        <span className="text-base text-gray-600">To do</span>
                    </Button>
                    <Button
                        variant="text"
                        startIcon={<FontAwesomeIcon icon={assets.icon.jira} size="lg" />}
                        to={`/task-board/time-line/${projectId}`}
                        className="hover:shadow-white"
                    >
                        <span className="text-base text-gray-600">Jira board</span>
                    </Button>
                </div>
                <div className="flex items-center gap-3">
                    {meetingRoom && (
                        <Button className="rounded-lg bg-tertiary text-headline" to={`/meeting/${projectId}`}>
                            Join meeting room
                        </Button>
                    )}

                    {projectMeetings.map(
                        (meeting) =>
                            Date.now() >= meeting.startTime * 1000 && (
                                <Button className="rounded-lg bg-tertiary text-headline" to={`/meeting/${projectId}`}>
                                    Join meeting room
                                </Button>
                            ),
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button className="rounded-lg min-w-[100px] text-lg text-headline">Create Meeting</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white rounded-md" sideOffset={5} align="end">
                            <DropdownMenuGroup className="border border-gray-300 rounded-md">
                                <DropdownMenuItem
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => socket.emit('toggle_instant_meeting', projectId)}
                                >
                                    <div className="flex items-center text-base">
                                        <FontAwesomeIcon
                                            icon={assets.icon.video}
                                            className="w-6 h-6 mr-2 text-gray-500"
                                            size="lg"
                                        />
                                        <p>Instant meeting</p>
                                    </div>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100">
                                    <MeetingModal
                                        triggerBtn={
                                            <div className="flex items-center justify-center text-base p-2 cursor-pointer">
                                                <FontAwesomeIcon
                                                    icon={assets.icon.clock}
                                                    className="w-6 h-6 mr-2 text-gray-500"
                                                    size="lg"
                                                />
                                                <p>Scheduled meeting</p>
                                            </div>
                                        }
                                    />
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}

export default ProjectHeader;
