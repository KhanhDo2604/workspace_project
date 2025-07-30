import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/Button';
import assets from '../../constants/icon';
import { useState } from 'react';

function ParticipantTag({ userIcon, userName, isHost }) {
    const [isMicOn, setIsMicOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);

    const handleMicClick = () => {
        setIsMicOn(!isMicOn);
    };

    const handleVideoClick = () => {
        setIsVideoOn(!isVideoOn);
    };

    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <img src={userIcon} alt="avatar" className="w-10 h-10 rounded-full" />
                <h2 className="text-lg font-semibold">{userName}</h2>
            </div>

            <div className="flex items-center gap-2">
                {isHost && <h2 className="text-lg font-semibold text-button">Host</h2>}
                <Button variant="text" onClick={handleMicClick}>
                    <FontAwesomeIcon
                        icon={isMicOn ? assets.icon.mic : assets.icon.micOff}
                        className={!isMicOn && 'text-gray-500'}
                        size="lg"
                    />
                </Button>
                <Button variant="text" onClick={handleVideoClick}>
                    <FontAwesomeIcon
                        icon={isVideoOn ? assets.icon.video : assets.icon.videoOff}
                        className={!isVideoOn && 'text-gray-500'}
                        size="lg"
                    />
                </Button>
            </div>
        </div>
    );
}

export default ParticipantTag;
