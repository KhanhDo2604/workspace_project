import { useState } from 'react';
import Button from '../../components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import assets from '../../constants/icon';

function ParticipantsVideo({ participants = [] }) {
    const [selected, setSelected] = useState(0);

    const randomColor = `bg-${Math.floor(Math.random() * 360)}-500`;

    return (
        <div className={`w-full flex flex-col gap-6 h-full`}>
            <div className="flex items-center justify-center gap-2">
                <Button className="text-xl p-2 rounded-lg size-16">
                    <FontAwesomeIcon icon={assets.icon.leftChevron} />
                </Button>
                {participants.map((p, i) => (
                    <div
                        className={`${randomColor} rounded-2xl relative w-1/4 h-42 cursor-pointer ${
                            selected === i ? 'border-2 border-button' : ''
                        }`}
                        onClick={() => setSelected(i)}
                    >
                        <div className="absolute bottom-0 left-0 rounded-xl px-3 py-2 bg-black/25 size-fit">
                            <p className="text-white font-semibold text-lg">{p.userName}</p>
                        </div>
                    </div>
                ))}
                <Button className="text-xl p-2 rounded-lg size-16">
                    <FontAwesomeIcon icon={assets.icon.rightChevron} />
                </Button>
            </div>

            {/* Main video */}
            <div className="relative rounded-xl overflow-hidden border-2 border-button w-3/4 flex-1 flex mb-4 mx-auto">
                {/*  */}
                <div className={`${randomColor} rounded-2xl relative size-full`}>
                    <div className="absolute bottom-0 left-0 rounded-xl px-3 py-2 bg-black/25 size-fit">
                        <p className="text-white font-semibold text-lg">{participants[selected]?.userName}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ParticipantsVideo;
