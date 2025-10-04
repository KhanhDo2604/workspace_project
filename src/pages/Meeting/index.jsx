import ParticipantTag from './ParticipantTag';
import RoomButtonsController from './RoomButtonsController';
import ParticipantsVideo from './ParticipantsVideo';
import { useSelector } from 'react-redux';
import Whiteboard from './Whiteboard';
import { useEffect, useRef, useState } from 'react';
import ChatSection from './ChatSection';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

function MeetingPage() {
    const whiteBoardMode = useSelector((state) => state.meeting.whiteBoardMode);
    const currentUser = useSelector((state) => state.auth.user);
    const currentProject = useSelector((state) => state.project.currentProject);

    const [userList, setUserList] = useState([]);

    const socketRef = useRef(null);
    const localStreamRef = useRef(null);
    const pcRef = useRef({});
    const navigate = useNavigate();

    const server = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3500';

    useEffect(() => {
        async function init() {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;

            setUserList([
                {
                    peerId: currentUser.id,
                    userName: currentUser.name,
                    avatar: currentUser.avatar,
                    stream,
                    isMicOn: true,
                    isCamOn: true,
                },
            ]);

            const socket = io(server);
            socketRef.current = socket;

            socket.emit('join-room', {
                roomId: currentProject.id,
                peerId: currentUser.id,
                userName: currentUser.name,
                avatar: currentUser.avatar,
            });

            socket.on('room-users', (users) => {
                setUserList((prev) => {
                    const me = prev.find((u) => u.peerId === currentUser.id);
                    const remotes = users.filter((u) => u.peerId !== currentUser.id);
                    return me ? [me, ...remotes] : remotes;
                });
            });

            socket.on('user-connected', async ({ peerId, userName, avatar, isMicOn, isCamOn }) => {
                setUserList((prev) =>
                    prev.find((u) => u.peerId === peerId)
                        ? prev
                        : [...prev, { peerId, userName, avatar, isMicOn, isCamOn }],
                );

                const pc = createPeerConnection(socket, peerId);
                localStreamRef.current.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current));

                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit('offer', { to: peerId, offer });
            });

            socket.on('offer', async ({ from, offer }) => {
                const pc = createPeerConnection(socket, from);
                localStreamRef.current.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current));

                await pc.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit('answer', { to: from, answer });
            });

            socket.on('answer', async ({ from, answer }) => {
                await pcRef.current[from]?.setRemoteDescription(new RTCSessionDescription(answer));
            });

            socket.on('candidate', async ({ from, candidate }) => {
                await pcRef.current[from]?.addIceCandidate(new RTCIceCandidate(candidate));
            });

            socket.on('user-status-updated', ({ peerId, isMicOn, isCamOn }) => {
                setUserList((prev) =>
                    prev.map((u) =>
                        u.peerId === peerId
                            ? {
                                  ...u,
                                  ...(typeof isMicOn === 'boolean' ? { isMicOn } : {}),
                                  ...(typeof isCamOn === 'boolean' ? { isCamOn } : {}),
                              }
                            : u,
                    ),
                );
            });

            socket.on('user-disconnected', ({ peerId }) => {
                setUserList((prev) => prev.filter((u) => u.peerId !== peerId));
                if (pcRef.current[peerId]) {
                    pcRef.current[peerId].close();
                    delete pcRef.current[peerId];
                }
            });
        }

        init();
        return () => releaseDevices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function createPeerConnection(socket, peerId) {
        if (pcRef.current[peerId]) return pcRef.current[peerId];

        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        pc.ontrack = (event) => {
            setUserList((prev) => prev.map((u) => (u.peerId === peerId ? { ...u, stream: event.streams[0] } : u)));
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) socket.emit('candidate', { to: peerId, candidate: event.candidate });
        };

        pcRef.current[peerId] = pc;
        return pc;
    }

    const releaseDevices = async () => {
        localStreamRef.current?.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;

        Object.entries(pcRef.current).forEach(([peerId, pc]) => {
            try {
                pc.close();
                console.log(`🔌 Closed PeerConnection with ${peerId}`);
            } catch {
                console.log(`❌ Failed to close PeerConnection with ${peerId}`);
            }
        });
        pcRef.current = {};

        socketRef.current?.disconnect();
        socketRef.current = null;

        setUserList([]);
    };

    const handleLeaveMeeting = async () => {
        await releaseDevices();
        navigate(`/task-board/${currentProject.id}`, { replace: true });
    };

    const toggleMic = () => {
        const audioTrack = localStreamRef.current?.getAudioTracks()[0];
        if (!audioTrack) return;

        const newState = !audioTrack.enabled;
        audioTrack.enabled = newState;

        setUserList((prev) => prev.map((u) => (u.peerId === currentUser.id ? { ...u, isMicOn: newState } : u)));

        socketRef.current?.emit('update-status', {
            roomId: currentProject.id,
            peerId: currentUser.id,
            isMicOn: newState,
        });
    };

    const toggleCam = () => {
        const videoTrack = localStreamRef.current?.getVideoTracks()[0];
        if (!videoTrack) return;

        const newState = !videoTrack.enabled;
        videoTrack.enabled = newState;

        setUserList((prev) => prev.map((u) => (u.peerId === currentUser.id ? { ...u, isCamOn: newState } : u)));

        socketRef.current?.emit('update-status', {
            roomId: currentProject.id,
            peerId: currentUser.id,
            isCamOn: newState,
        });
    };

    const me = userList.find((u) => u.peerId === currentUser.id);

    return (
        <div className="w-full h-screen grid grid-cols-20">
            {/* LEFT: MEETING ROOM */}
            <div className="col-span-15 bg-secondary p-6 flex flex-col h-full overflow-hidden">
                <h1 className="font-bold text-3xl mb-4 shrink-0">Weekly General Team Meeting</h1>
                <div className="flex-1 flex flex-col overflow-hidden">
                    {whiteBoardMode ? <Whiteboard /> : <ParticipantsVideo participants={userList} />}
                    <RoomButtonsController
                        onLeave={handleLeaveMeeting}
                        onToggleMic={toggleMic}
                        onToggleCam={toggleCam}
                        isMicOn={!!me?.isMicOn}
                        isCamOn={!!me?.isCamOn}
                    />
                </div>
            </div>

            {/* RIGHT: PARTICIPANTS & CHAT */}
            <div className="col-span-5 rounded-l-3xl h-screen flex flex-col">
                <div className="border-b border-gray-200 px-8 pt-8 pb-2 flex flex-col">
                    <div className="mb-4 flex justify-between">
                        <div className="flex gap-2">
                            <h1 className="text-2xl font-bold">Participants</h1>
                            <p className="text-2xl text-gray-500">{userList.length}</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                        {userList.map((u, i) => (
                            <ParticipantTag
                                key={i}
                                userIcon={u.avatar}
                                userName={u.userName}
                                isHost={u.peerId === currentUser.id}
                                canControl={u.peerId === currentUser.id}
                                onToggleMic={u.peerId === currentUser.id ? toggleMic : undefined}
                                onToggleCam={u.peerId === currentUser.id ? toggleCam : undefined}
                                isMicOn={u.isMicOn}
                                isCamOn={u.isCamOn}
                            />
                        ))}
                    </div>
                </div>

                <ChatSection />
            </div>
        </div>
    );
}

export default MeetingPage;
