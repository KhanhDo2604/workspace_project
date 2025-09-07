import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPaperclip,
    faBolt,
    faBold,
    faItalic,
    faStrikethrough,
    faCode,
    faLink,
    faListUl,
    faListOl,
    faClipboard,
    faSmile,
} from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import assets from '../../constants/icon';

export default function ChatEditor({ placeholder, value, onChange, onSend, showOptions = false, className }) {
    const [message, setMessage] = useState(value || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSend(message);
            setMessage('');
        }
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        setMessage(val);
        if (onChange) onChange(val);
    };

    return (
        <form className={className} onSubmit={handleSubmit}>
            {/* Input area */}
            <div className="flex items-start justify-between p-3 ">
                <textarea
                    placeholder={placeholder || 'Message...'}
                    rows={1}
                    value={message}
                    onChange={handleInputChange}
                    className="w-full resize-none border-none outline-none px-3 py-2 text-lg"
                />
                <Button variant="primary" className="rounded-full w-10 h-10" onClick={onSend}>
                    <FontAwesomeIcon icon={assets.icon.send} size="sm" className="text-headline" />
                </Button>
            </div>

            {/* Toolbar */}
            {showOptions && (
                <div className="flex items-center justify-between border-t text-base text-gray-500 p-3">
                    <div className="flex gap-3 items-center">
                        <button className="hover:text-gray-800">
                            <FontAwesomeIcon icon={faBolt} />
                        </button>
                        <button className="hover:text-gray-800">
                            <FontAwesomeIcon icon={faBold} />
                        </button>
                        <button className="hover:text-gray-800">
                            <FontAwesomeIcon icon={faItalic} />
                        </button>
                        <button className="hover:text-gray-800">
                            <FontAwesomeIcon icon={faStrikethrough} />
                        </button>
                        <button className="hover:text-gray-800">
                            <FontAwesomeIcon icon={faCode} />
                        </button>
                        <button className="hover:text-gray-800">
                            <FontAwesomeIcon icon={faLink} />
                        </button>
                        <button className="hover:text-gray-800">
                            <FontAwesomeIcon icon={faListUl} />
                        </button>
                        <button className="hover:text-gray-800">
                            <FontAwesomeIcon icon={faListOl} />
                        </button>
                        <button className="hover:text-gray-800">
                            <FontAwesomeIcon icon={faClipboard} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                            <FontAwesomeIcon icon={faSmile} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                            <FontAwesomeIcon icon={faPaperclip} />
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
}
