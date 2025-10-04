import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { meetingActions } from '../../store/slices/MeetingSlice';
import assets from '../../constants/icon';
import { Button } from '../../components/ui/button';

function RoomButtonsController({ onLeave, onToggleMic, onToggleCam, isMicOn, isCamOn }) {
    const dispatch = useDispatch();

    const handleWhiteBoardToggle = () => {
        dispatch(meetingActions.toggleWhiteBoardMode());
    };

    return (
        <div className="flex items-center gap-4 justify-center my-2">
            <Button className="rounded-3xl w-16 h-16 bg-headline" onClick={handleWhiteBoardToggle}>
                <img src={assets.icon.whiteBoard} alt="" />
            </Button>
            <Button className="rounded-3xl w-16 h-16 bg-headline" onClick={onToggleMic}>
                <FontAwesomeIcon
                    icon={isMicOn ? assets.icon.mic : assets.icon.micOff}
                    className="text-gray-500"
                    size="xl"
                />
            </Button>
            <Button className="rounded-3xl w-20 h-20 bg-tertiary" onClick={onLeave}>
                <img src={assets.icon.meetingEnd} alt="" />
            </Button>
            <Button className="rounded-3xl w-16 h-16 bg-headline" onClick={onToggleCam}>
                <FontAwesomeIcon
                    icon={isCamOn ? assets.icon.video : assets.icon.videoOff}
                    className="text-gray-500"
                    size="xl"
                />
            </Button>
            <Button className="rounded-3xl w-16 h-16 bg-headline">
                <FontAwesomeIcon icon={assets.icon.screen} className="text-gray-500" size="xl" />
            </Button>
        </div>
    );
}

export default RoomButtonsController;
