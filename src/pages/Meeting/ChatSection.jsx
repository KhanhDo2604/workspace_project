import { useDispatch, useSelector } from 'react-redux';
import ChatCard from '../../components/ChatCard';
import ChatEditor from '../../components/ChatEditor';
import { useEffect, useState } from 'react';
import ChatModel from '../../model/ChatModel';
import { io } from 'socket.io-client';

/**
 * This component handles the real-time chat functionality
 * for each project room using Socket.IO.
 * It allows users to join a chat room, receive messages,
 * and send new messages to other participants.
 */
function ChatSection() {
    const dispatch = useDispatch();
    // Redux States
    const currentUser = useSelector((state) => state.auth.user);
    const currentProject = useSelector((state) => state.project.currentProject);

    // Store the socket instance and list of messages
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);

    // Connect to the WebSocket server on component mount
    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_WEBSOCKET_URL, { autoConnect: true });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Once socket is available, join the project room
    useEffect(() => {
        if (!socket) return;
        socket.emit('enterRoom', {
            name: currentUser.email,
            room: currentProject.id,
        });
    }, [socket, currentUser, currentProject, dispatch]);

    // Listen for "message" events and append new chat messages to local state
    useEffect(() => {
        if (!socket) return;

        // Handle incoming chat messages
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

    // Send a new chat message to the server
    const handleSend = (text) => {
        if (!text || typeof text !== 'string') return;
        if (!text.trim()) return;

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
                {messages.map((msg, index) => {
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

            {/* Input message */}
            <ChatEditor
                placeholder="Message..."
                onSend={handleSend}
                className={'border-gray-300 border rounded-full w-full mt-4'}
            />
        </div>
    );
}

export default ChatSection;
