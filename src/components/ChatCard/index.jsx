function ChatCard({ userIcon, userName, content, timestamp, isMe }) {
    const randomColor = () => {
        const colors = ['text-blue-600', 'text-green-600', 'text-yellow-600', 'text-red-600'];
        return colors[Math.floor(Math.random() * colors.length)];
    };
    const side = isMe ? 'justify-end' : 'justify-start';

    return (
        <div className={`flex ${side} items-start gap-4 mb-4`}>
            {!isMe && <img src={userIcon} alt="" className="w-10 h-10 rounded-full" />}
            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-xs`}>
                {!isMe && <h2 className={`text-xl font-semibold ${randomColor()} text`}>{userName}</h2>}
                <div className={`${isMe ? 'bg-button/30' : 'bg-gray-100'} px-4 py-2 rounded-xl`}>
                    <p className="text-lg">{content}</p>
                </div>
                <span className="text-sm mt-2">{timestamp}</span>
            </div>
        </div>
    );
}

export default ChatCard;
