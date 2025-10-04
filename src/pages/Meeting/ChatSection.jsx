import ChatCard from '../../components/ChatCard';
import ChatEditor from '../../components/ChatEditor';
import assets from '../../constants/icon';

function ChatSection() {
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

    return (
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
            <ChatEditor
                placeholder="Message..."
                onSend={() => console.log('Sent!')}
                onChange={(val) => console.log('Typing:', val)}
                className={'border-gray-300 border rounded-full w-full mt-4'}
            />
        </div>
    );
}

export default ChatSection;
