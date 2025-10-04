import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream || null;
        }
    }, [stream]);

    useEffect(() => {
        const compute = () => {
            const ok = !!stream && stream.getVideoTracks().some((t) => t.readyState === 'live' && t.enabled);
            setHasVideo(ok && !!isCamOn);
        };

        compute();

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
