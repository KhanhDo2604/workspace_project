import { useEffect, useState } from 'react';
import ChatCard from '../../components/ChatCard';
import ChatEditor from '../../components/ChatEditor';
import ProjectHeader from '../../components/ProjectHeader';
import assets from '../../constants/icon';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

function ChatScreen() {
    const currentUser = useSelector((state) => state.auth.user);
    const currentProject = useSelector((state) => state.project.currentProject);

    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [activity, setActivity] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const newSocket = io('ws://localhost:3500', { autoConnect: true });
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
    }, [socket, currentUser, currentProject]);

    useEffect(() => {
        if (!socket) return;

        let timer;

        const handleMessage = (data) => {
            setActivity('');
            setMessages((prev) => [...prev, data]);
        };

        const handleActivity = (name) => {
            setActivity(`${name} is typing...`);
            clearTimeout(timer);
            timer = setTimeout(() => setActivity(''), 3000);
        };

        const handleUserList = ({ users }) => {
            const userArray = Object.values(users);

            setUsers(userArray);
        };

        socket.on('message', handleMessage);
        socket.on('activity', handleActivity);
        socket.on('userList', handleUserList);

        return () => {
            socket.off('message', handleMessage);
            socket.off('activity', handleActivity);
            socket.off('userList', handleUserList);
        };
    }, [socket]);

    const handleSend = (text) => {
        if (!text || typeof text !== 'string') return;
        if (!text.trim()) return;

        socket.emit('message', {
            name: currentUser.name,
            text: text,
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

            {/* Danh sách thành viên đang onl nên xuất hiện ở header*/}
            {/* <div className="px-6 py-2 text-sm text-gray-600">
                <span className="font-medium">Members:</span>{' '}
                {users.map((u, i) => (
                    <span key={u.id}>
                        {u.name}
                        {i < users.length - 1 ? ', ' : ''}
                    </span>
                ))}
            </div> */}

            {/* Khu vực chat */}
            <div className="relative overflow-y-auto flex-1 p-6">
                <div className="space-y-4">
                    {messages.map((msg, index) => {
                        return (
                            <ChatCard
                                key={index}
                                userIcon={assets.image.userTemp}
                                userName={msg.name}
                                content={msg.text}
                                timestamp={msg.time}
                                isMe={msg.name === currentUser.name}
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
