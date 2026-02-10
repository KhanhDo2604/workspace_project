import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/**
 * Renders a single user’s video stream in a meeting room.
 * Supports conditional display of avatar when the user's camera is off.
 *
 * @component
 * @param {MediaStream} stream - The media stream object from WebRTC.
 * @param {boolean} [muted=false] - Whether the video is muted.
 * @param {boolean} [autoPlay=true] - Whether the video should play automatically.
 * @param {boolean} [playsInline=true] - Enables inline playback on mobile devices.
 * @param {string} [className=''] - Additional CSS classes for styling.
 * @param {string} userName - The display name of the participant.
 * @param {string} avatar - URL for the participant's avatar image.
 * @param {boolean} [isMain=false] - Whether the video is displayed as the main (focused) video.
 * @param {boolean} [isCamOn=true] - Indicates if the user's camera is currently on.
 *
 * @description
 * This component dynamically updates the <video> element when the media stream changes.
 * It also monitors the status of video tracks (live, muted, or ended) and automatically switches between showing the video or a fallback avatar.
 */
function VideoPlayer({
    stream,
    muted = false,
    autoPlay = true,
    playsInline = true,
    className = '',
    userName,
    avatar,
    isMain = false,
    isCamOn = true,
}) {
    const videoRef = useRef(null);
    const [hasVideo, setHasVideo] = useState(false);

    // Update video element's srcObject when stream changes
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream || null;
        }
    }, [stream]);

    // Monitor stream's video tracks to update hasVideo state
    useEffect(() => {
        const compute = () => {
            const ok = !!stream && stream.getVideoTracks().some((t) => t.readyState === 'live' && t.enabled);
            setHasVideo(ok && !!isCamOn);
        };

        compute();

        // Attach event listeners to track state changes
        const tracks = stream?.getVideoTracks() ?? [];
        tracks.forEach((t) => {
            const handler = () => compute();
            t.addEventListener('ended', handler);
            t.addEventListener('mute', handler);
            t.addEventListener('unmute', handler);
        });
        return () => {
            tracks.forEach((t) => {
                t.removeEventListener('ended', () => {});
                t.removeEventListener('mute', () => {});
                t.removeEventListener('unmute', () => {});
            });
        };
    }, [stream, isCamOn]);

    /**
     * Renders either the live video stream or a placeholder
     * avatar when no active video track is detected.
     */
    return (
        <div className={`relative ${className}`}>
            <video
                ref={videoRef}
                muted={muted}
                autoPlay={autoPlay}
                playsInline={playsInline}
                className={`w-full h-full ${isMain ? 'object-contain bg-black' : 'object-cover'} rounded-lg`}
            />
            {!hasVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-700 rounded-lg">
                    <Avatar className="w-20 h-20 rounded-full">
                        <AvatarImage src={avatar} />
                        <AvatarFallback>{userName?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>
            )}
        </div>
    );
}

export default VideoPlayer;
