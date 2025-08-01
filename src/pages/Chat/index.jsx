import { useSelector } from 'react-redux';
import ChatCard from '../../components/ChatCard';
import ChatEditor from '../../components/ChatEditor';
import ProjectHeader from '../../components/ProjectHeader';
import assets from '../../constants/icon';
import AddScheduleDialog from './AddScheduleDialog';

function ChatScreen() {
    const isOpenAddScheduleDialog = useSelector((state) => state.dialog.openAddScheduleDialog);

    const teamInfo = {
        teamName: 'Team Alpha',
        teamDescription: 'Track and coordinate social media',
        teamMembers: [{ avatar: '/user1.jpg' }, { avatar: '/user2.jpg' }, { avatar: '/user3.jpg' }],
    };

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

    const handleSend = () => {
        console.log('Sent!');
    };

    return (
        <div className="bg-secondary h-screen flex flex-col">
            <ProjectHeader {...teamInfo} />
            <div className="relative">{isOpenAddScheduleDialog && <AddScheduleDialog />}</div>
            <div className="flex-1 p-6 overflow-y-auto">
                {/* Chat messages will go here */}
                <div className="space-y-4">
                    {chatData.map((message, index) => (
                        <ChatCard
                            key={index}
                            userIcon={message.userIcon}
                            userName={message.userName}
                            content={message.content}
                            timestamp={message.timestamp}
                            isMe={message.isMe}
                        />
                    ))}
                </div>
            </div>
            <div className="p-4 w-full">
                {/* Chat editor will go here */}
                <ChatEditor
                    placeholder="Message #social-media"
                    onSend={handleSend}
                    onChange={(val) => console.log('Typing:', val)}
                    showOptions={true}
                    className={'bg-white w-full shadow-sm rounded-lg'}
                />
            </div>
        </div>
    );
}

export default ChatScreen;
