import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/Button';
import assets from '../../constants/icon';
import ParticipantTag from './ParticipantTag';
import ChatCard from '../../components/ChatCard';
import FormField from '../../components/FormField';
import RoomButtonsController from './RoomButtonsController';
import ParticipantsVideo from './ParticipantsVideo';
import { useSelector } from 'react-redux';
import Whiteboard from './Whiteboard';

function MeetingPage() {
    const whiteBoardMode = useSelector((state) => state.meeting.whiteBoardMode);

    const chatData = [
        {
            userIcon: assets.image.userTemp,
            userName: 'John Doe',
            content: 'Hello everyone! Looking forward to the meeting.',
            timestamp: '10:00 AM',
            isMe: false,
        },
        {
            userIcon: assets.image.userTemp,
            userName: 'Jane Smith',
            content: 'Hi John! Me too.',
            timestamp: '10:01 AM',
            isMe: false,
        },
        {
            userIcon: assets.image.userTemp,
            userName: 'Alice Johnson',
            content: 'Good morning all!',
            timestamp: '10:02 AM',
            isMe: false,
        },
        {
            userIcon: assets.image.userTemp,
            userName: 'Bob Brown',
            content: 'Ready to start when you are.',
            timestamp: '10:03 AM',
            isMe: false,
        },
        {
            userIcon: assets.image.userTemp,
            userName: 'Charlie White',
            content: 'Let’s get this meeting going!',
            timestamp: '10:04 AM',
            isMe: true,
        },
        {
            userIcon: assets.image.userTemp,
            userName: 'John Doe',
            content: 'Great! Let’s begin with the agenda.',
            timestamp: '10:05 AM',
            isMe: false,
        },
        {
            userIcon: assets.image.userTemp,
            userName: 'Jane Smith',
            content: 'Sounds good to me.',
            timestamp: '10:06 AM',
            isMe: false,
        },
        {
            userIcon: assets.image.userTemp,
            userName: 'Alice Johnson',
            content: 'I have some updates to share.',
            timestamp: '10:07 AM',
            isMe: false,
        },
    ];

    const Participants = [
        { userIcon: assets.image.userTemp, userName: 'John Doe', isHost: true },
        { userIcon: assets.image.userTemp, userName: 'Jane Smith', isHost: false },
        { userIcon: assets.image.userTemp, userName: 'Alice Johnson', isHost: false },
        { userIcon: assets.image.userTemp, userName: 'Bob Brown', isHost: false },
        { userIcon: assets.image.userTemp, userName: 'Charlie White', isHost: false },
    ];

    const handleAvailableSpace = Participants.length > 4 ? 'h-1/3' : 'h-fit';

    return (
        <div className="w-full h-screen grid grid-cols-20">
            {/* Left Sidebar */}
            <div className="col-span-15 bg-secondary p-12">
                <h1 className="font-bold text-3xl mb-2">Weekly General Team Meeting</h1>
                <div className="w-full h-full flex flex-col justify-between">
                    {whiteBoardMode ? <Whiteboard /> : <ParticipantsVideo participants={Participants} />}
                    <RoomButtonsController />
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="col-span-5 rounded-l-3xl h-screen flex flex-col">
                {/* Participants Section */}
                <div className={`border-b border-gray-200 px-8 pt-8 pb-2 flex flex-col ${handleAvailableSpace}`}>
                    <div className="mb-4 flex justify-between">
                        <div className="flex gap-2">
                            <h1 className="text-2xl font-bold">Participants</h1>
                            <p className="text-2xl text-gray-500">(5)</p>
                        </div>
                        <Button variant="text">
                            <FontAwesomeIcon icon={assets.icon.more} />
                        </Button>
                    </div>

                    {/* Danh sách có thể scroll */}
                    <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                        {Participants.map((participant, index) => (
                            <ParticipantTag
                                key={index}
                                userIcon={participant.userIcon}
                                userName={participant.userName}
                                isHost={participant.isHost}
                            />
                        ))}
                    </div>
                </div>

                {/* Chat Section */}
                <div className="flex-1 p-8 flex flex-col h-4">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold">Chat</h1>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1">
                        {chatData.map((chat, index) => (
                            <ChatCard
                                key={index}
                                userIcon={chat.userIcon}
                                userName={chat.userName}
                                content={chat.content}
                                timestamp={chat.timestamp}
                                isMe={chat.isMe}
                            />
                        ))}
                    </div>

                    {/* Input message */}
                    <div className="mt-4 flex items-center justify-between gap-2 w-full">
                        <div className="flex-1">
                            <FormField
                                placeholder="Message..."
                                borderColor="border-gray-300"
                                borderRadius="rounded-full"
                            />
                        </div>
                        <Button variant="primary" className="rounded-full w-12 h-12">
                            <FontAwesomeIcon icon={assets.icon.send} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MeetingPage;
