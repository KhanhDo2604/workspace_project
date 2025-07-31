import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { meetingActions } from '../../store/slices/MeetingSlice';
import Button from '../../components/Button';
import assets from '../../constants/icon';

function RoomButtonsController() {
    const dispatch = useDispatch();

    const handleWhiteBoardToggle = () => {
        dispatch(meetingActions.toggleWhiteBoardMode());
    };

    return (
        <div className="flex items-center gap-4 justify-center my-2">
            <Button className="rounded-3xl w-16 h-16 bg-headline" onClick={handleWhiteBoardToggle}>
                <img src={assets.icon.whiteBoard} alt="" />
            </Button>
            <Button className="rounded-3xl w-16 h-16 bg-headline">
                <FontAwesomeIcon icon={assets.icon.mic} className="text-gray-500" size="xl" />
            </Button>
            <Button className="rounded-3xl w-20 h-20 bg-tertiary">
                <img src={assets.icon.meetingEnd} alt="" />
            </Button>
            <Button className="rounded-3xl w-16 h-16 bg-headline">
                <FontAwesomeIcon icon={assets.icon.video} className="text-gray-500" size="xl" />
            </Button>
            <Button className="rounded-3xl w-16 h-16 bg-headline">
                <FontAwesomeIcon icon={assets.icon.setting} className="text-gray-500" size="xl" />
            </Button>
        </div>
    );
}

export default RoomButtonsController;
