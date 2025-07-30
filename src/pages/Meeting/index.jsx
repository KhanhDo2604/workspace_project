import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/Button';
import assets from '../../constants/icon';
import ParticipantTag from './ParticipantTag';
import ChatCard from '../../components/ChatCard';
import FormField from '../../components/FormField';

function MeetingPage() {
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
    ];

    return (
        <div className="w-full h-full grid grid-cols-20">
            {/* Left Sidebar */}
            <div className="col-span-15 bg-secondary p-9">
                <h1 className="font-bold text-3xl">Weekly General Team Meeting</h1>
                <div className="mt-4 w-full "></div>
                <div className="flex items-center gap-3">
                    <Button>
                        <img src={assets.icon.whiteBoard} alt="" />
                    </Button>
                    <Button>
                        <FontAwesomeIcon icon={assets.icon.mic} />
                    </Button>
                    <Button>
                        <img src={assets.icon.meetingEnd} alt="" />
                    </Button>
                    <Button>
                        <FontAwesomeIcon icon={assets.icon.video} />
                    </Button>
                    <Button>
                        <FontAwesomeIcon icon={assets.icon.setting} />
                    </Button>
                </div>
            </div>

            {/* Left Sidebar */}
            <div className="col-span-5 rounded-l-3xl h-full border-b border-gray-200">
                {/* Participants Section */}
                <div className="h-fit border-b border-gray-200 px-8 pt-8 pb-2">
                    <div className="mt-2 mb-4 flex justify-between">
                        <div className="flex gap-2">
                            <h1 className="text-2xl font-bold">Participants</h1>
                            <p className="text-2xl text-gray-500">(5)</p>
                        </div>
                        <Button variant="text">
                            <FontAwesomeIcon icon={assets.icon.more} />
                        </Button>
                    </div>

                    <div>
                        <ParticipantTag userIcon={assets.image.userTemp} userName="John Doe" isHost={true} />
                        <ParticipantTag userIcon={assets.image.userTemp} userName="Jane Smith" isHost={false} />
                        <ParticipantTag userIcon={assets.image.userTemp} userName="Alice Johnson" isHost={false} />
                        <ParticipantTag userIcon={assets.image.userTemp} userName="Bob Brown" isHost={false} />
                        <ParticipantTag userIcon={assets.image.userTemp} userName="Charlie White" isHost={false} />
                    </div>
                </div>

                {/* Chat Section */}
                <div className="p-8">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold">Chat</h1>
                    </div>
                    <div>
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
