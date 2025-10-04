import { useState } from 'react';
import { ParticipantVideo } from './ParticipantVideo';
import VideoPlayer from './VideoPlayer';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import assets from '../../constants/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ParticipantsVideo({ participants = [] }) {
    const [selected, setSelected] = useState(0);
    const currentUser = useSelector((s) => s.auth.user);
    const p = participants[selected];

    return (
        <div className="flex flex-col h-full overflow-hidden gap-3">
            {/* Thumbnails */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto shrink-0 h-44">
                {participants.map((u, i) => (
                    <ParticipantVideo
                        key={u.peerId || i}
                        stream={u.stream}
                        userName={u.userName}
                        avatar={u.avatar}
                        selected={selected === i}
                        onClick={() => setSelected(i)}
                        isCamOn={u.isCamOn}
                        isMicOn={u.isMicOn}
                    />
                ))}
            </div>

            {/* Main video */}
            <div className="flex-1 flex items-center justify-center">
                <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden border-2 border-button">
                    {p ? (
                        <VideoPlayer
                            stream={p.stream}
                            userName={p.userName}
                            avatar={p.avatar}
                            isMain={true}
                            className="w-full h-full"
                            isCamOn={p.isCamOn}
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-700">
                            <Avatar className="w-20 h-20 rounded-full">
                                <AvatarImage src={currentUser?.avatar} />
                                <AvatarFallback>{currentUser?.userName?.[0]?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </div>
                    )}

                    <div className="absolute bottom-0 left-0 bg-black/50 px-3 py-1 text-sm text-white rounded-tr-lg">
                        <FontAwesomeIcon icon={!p?.isMicOn && assets.icon.micOff} />
                        {p?.userName || 'You'}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ParticipantsVideo;
