import { useEffect, useState } from 'react';
import ChatCard from '../../components/ChatCard';
import ChatEditor from '../../components/ChatEditor';
import ProjectHeader from '../../components/ProjectHeader';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { getChatMessages } from '../../store/slices/ProjectSlice';
import ChatModel from '../../model/ChatModel';

function ChatScreen() {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.user);
    const currentProject = useSelector((state) => state.project.currentProject);

    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [activity, setActivity] = useState('');

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
        const fetchMessages = async () => {
            try {
                const data = await dispatch(getChatMessages(currentProject.id)).unwrap();

                setMessages(data);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        };
        fetchMessages();
        socket.emit('enterRoom', {
            name: currentUser.email,
            room: currentProject.id,
        });
    }, [socket, currentUser, currentProject, dispatch]);

    useEffect(() => {
        if (!socket) return;

        let timer;

        const handleMessage = (data) => {
            setActivity('');
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

        const handleActivity = (name) => {
            setActivity(`${name} is typing...`);
            clearTimeout(timer);
            timer = setTimeout(() => setActivity(''), 3000);
        };

        socket.on('message', handleMessage);
        socket.on('activity', handleActivity);

        return () => {
            socket.off('message', handleMessage);
            socket.off('activity', handleActivity);
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

    const handleTyping = () => {
        socket.emit('activity', currentUser.name);
    };

    return (
        <div className="bg-secondary h-screen flex flex-col">
            <ProjectHeader
                teamName={currentProject.title}
                teamDescription={currentProject.description}
                teamMembers={currentProject.participants}
            />

            <div className="relative overflow-y-auto flex-1 p-6">
                <div className="space-y-4">
                    {messages.map((msg, index) => {
                        console.log(msg);

                        return (
                            <ChatCard
                                key={index}
                                userIcon={msg.avatar}
                                userName={msg.name}
                                content={msg.message}
                                createdAt={msg.createdAt}
                                isMe={msg.userId === currentUser.id}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Editor */}
            <div className="p-4 w-full">
                {activity && <p className="text-sm italic text-gray-500 mt-2">{activity}</p>}

                <ChatEditor
                    placeholder={`Message #${currentProject.description}`}
                    onSend={handleSend}
                    onChange={handleTyping}
                    showOptions={true}
                    className="bg-white w-full shadow-sm rounded-lg"
                />
            </div>
        </div>
    );
}

export default ChatScreen;
