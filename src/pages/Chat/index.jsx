import { useEffect, useRef, useState } from 'react';
import ChatCard from '../../components/ChatCard';
import ChatEditor from '../../components/ChatEditor';
import ProjectHeader from '../../components/ProjectHeader';
import assets from '../../constants/icon';

import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

function ChatScreen() {
    const user = useSelector((state) => state.auth.user);
    const teamInfo = {
        teamId: 'team123',
        teamName: 'Team Alpha',
        teamDescription: 'Track and coordinate social media',
        teamMembers: [{ avatar: '/user1.jpg' }, { avatar: '/user2.jpg' }, { avatar: '/user3.jpg' }],
    };

    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [room] = useState(teamInfo.teamId);
    const [activity, setActivity] = useState('');
    const chatDisplayRef = useRef(null);

    // Kết nối socket khi component mount
    useEffect(() => {
        const newSocket = io('ws://localhost:3500');
        setSocket(newSocket);

        // Lắng nghe tin nhắn
        newSocket.on('message', (data) => {
            setActivity('');
            setMessages((prev) => [
                ...prev,
                {
                    userIcon: assets.image.userTemp,
                    userName: data.name,
                    content: data.text,
                    timestamp: data.time,
                    isMe: data.name === user.name,
                },
            ]);
        });

        // Lắng nghe hoạt động đang gõ
        newSocket.on('activity', (name) => {
            setActivity(`${name} is typing...`);

            // Xóa sau 3 giây
            setTimeout(() => {
                setActivity('');
            }, 3000);
        });

        // // Lắng nghe danh sách người dùng
        // newSocket.on('userList', ({ users }) => {
        //     setUsers(users);
        // });

        // // Lắng nghe danh sách phòng
        // newSocket.on('roomList', ({ rooms }) => {
        //     setRooms(rooms);
        // });

        return () => newSocket.close();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Cuộn xuống dưới cùng khi có tin nhắn mới
    useEffect(() => {
        if (chatDisplayRef.current) {
            chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
        }
    }, [messages]);

    //when user added into project
    // const handleJoinRoom = (e) => {
    //     e.preventDefault();
    //     if (username && room) {
    //         socket.emit('enterRoom', {
    //             name: username,
    //             room: room,
    //         });
    //         setJoined(true);
    //     }
    // };

    const handleSendMessage = (messageText) => {
        if (user.name && messageText && room) {
            socket.emit('message', {
                name: user.name,
                text: messageText,
            });
        }
    };

    const handleTyping = () => {
        if (user.name) {
            socket.emit('activity', user.name);
        }
    };

    return (
        <div className="bg-secondary h-screen flex flex-col">
            <ProjectHeader {...teamInfo} />
            <div className={`relative overflow-y-auto h-full`}>
                <div className="flex-1 p-6">
                    {/* Chat messages */}
                    <div className="space-y-4">
                        {messages.map((message, index) => (
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
            </div>
            {activity && <div className="px-4 py-2 italic text-gray-500 text-sm">{activity}</div>}

            <div className="p-4 w-full">
                <ChatEditor
                    placeholder="Message #social-media"
                    onSend={handleSendMessage}
                    onChange={handleTyping}
                    showOptions={true}
                    className={'bg-white w-full shadow-sm rounded-lg'}
                />
            </div>
        </div>
    );
}

export default ChatScreen;
