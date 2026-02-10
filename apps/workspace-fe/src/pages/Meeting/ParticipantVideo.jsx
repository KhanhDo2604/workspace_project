import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import VideoPlayer from './VideoPlayer';
import assets from '../../constants/icon';

export function ParticipantVideo({ stream, userName, avatar, selected, onClick, isMicOn, isCamOn }) {
    return (
        <div
            className={`relative w-64 h-full rounded-lg cursor-pointer ${selected ? 'border-2 border-button' : ''}`}
            onClick={onClick}
        >
            <VideoPlayer
                stream={stream}
                muted
                userName={userName}
                avatar={avatar}
                className="w-full h-full rounded-lg"
                isCamOn={isCamOn}
            />
            <div className="absolute bottom-0 left-0 bg-black/50 px-2 py-1 text-xs text-white rounded-lg">
                {!isMicOn && <FontAwesomeIcon icon={assets.icon.micOff} className="mr-1" />}
                {userName}
            </div>
        </div>
    );
}
