function ChatCard({ userIcon, userName, content, createdAt, isMe }) {
    const side = isMe ? 'justify-end' : 'justify-start';

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div className={`flex ${side} items-start gap-4 mb-4`}>
            {!isMe && <img src={userIcon} alt="" className="w-10 h-10 rounded-full" />}
            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-xs`}>
                {!isMe && <h2 className={`text-xl font-semibold text`}>{userName}</h2>}
                <div className={`${isMe ? 'bg-button' : 'bg-gray-100'} px-4 py-2 rounded-xl`}>
                    <p className="text-lg">{content}</p>
                </div>
                <span className="text-sm mt-2">{formatTime(createdAt)}</span>
            </div>
        </div>
    );
}

export default ChatCard;
