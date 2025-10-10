import { useDispatch, useSelector } from 'react-redux';
import ChatCard from '../../components/ChatCard';
import ChatEditor from '../../components/ChatEditor';
import { useEffect, useState } from 'react';
import ChatModel from '../../model/ChatModel';
import { io } from 'socket.io-client';

function ChatSection() {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.user);
    const currentProject = useSelector((state) => state.project.currentProject);

    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_WEBSOCKET_URL, { autoConnect: true });
        setSocket(newSocket);

        console.log('⚡ Socket connected');

        return () => {
            console.log('🛑 Disconnect socket');
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.emit('enterRoom', {
            name: currentUser.email,
            room: currentProject.id,
        });
    }, [socket, currentUser, currentProject, dispatch]);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (data) => {
            const chatData = new ChatModel({
                projectId: data.projectId,
                userId: data.userId,
                message: data.text,
                avatar: data.avatar,
                createdAt: data.createdAt,
                name: data.name,
            });
            setMessages((prev) => [...prev, chatData]);
        };

        socket.on('message', handleMessage);

        return () => {
            socket.off('message', handleMessage);
        };
    }, [socket, currentUser, currentProject]);

    const handleSend = (text) => {
        if (!text || typeof text !== 'string') return;
        if (!text.trim()) return;
        console.log(currentUser);

        socket.emit('message', {
            userId: currentUser.id,
            projectId: currentProject.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
            text: text,
            createdAt: new Date().getTime(),
        });
    };

    return (
        <div className="flex-1 p-8 flex flex-col h-4">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">Chat</h1>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
                {messages.map((chat, index) => (
                    <ChatCard
                        key={index}
                        userIcon={chat.avatar}
                        userName={chat.name}
                        content={chat.message}
                        timestamp={chat.createdAt}
                        isMe={chat.userId === currentUser.id}
                    />
                ))}
            </div>

            {/* Input message */}
            <ChatEditor
                placeholder="Message..."
                onSend={handleSend}
                onChange={(val) => console.log('Typing:', val)}
                className={'border-gray-300 border rounded-full w-full mt-4'}
            />
        </div>
    );
}

export default ChatSection;
