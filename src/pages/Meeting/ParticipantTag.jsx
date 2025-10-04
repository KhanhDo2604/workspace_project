import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/Button';
import assets from '../../constants/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function ParticipantTag({
    userIcon,
    userName,
    canControl = false,
    isHost,
    onToggleMic,
    onToggleCam,
    isMicOn,
    isCamOn,
}) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <Avatar className="w-10 h-10 rounded-full">
                    <AvatarImage src={userIcon} />
                    <AvatarFallback>{userName?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h2 className="text-lg font-semibold">{userName}</h2>
            </div>

            <div className="flex items-center gap-2">
                {isHost && <h2 className="text-lg font-semibold text-button">Host</h2>}
                <Button variant="text" onClick={onToggleMic} disabled={!canControl}>
                    <FontAwesomeIcon
                        icon={isMicOn ? assets.icon.mic : assets.icon.micOff}
                        className={!isMicOn && 'text-gray-500'}
                        size="lg"
                    />
                </Button>
                <Button variant="text" onClick={onToggleCam} disabled={!canControl}>
                    <FontAwesomeIcon
                        icon={isCamOn ? assets.icon.video : assets.icon.videoOff}
                        className={!isCamOn && 'text-gray-500'}
                        size="lg"
                    />
                </Button>
            </div>
        </div>
    );
}

export default ParticipantTag;
