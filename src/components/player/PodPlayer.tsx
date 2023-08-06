import React, { ReactNode, FC, useRef, useEffect } from 'react';

interface ReactAudioPlayerProps {
    autoPlay?: boolean
    children?: ReactNode
    className?: string
    controls?: boolean
    controlsList?: string
    id?: string
    listenInterval?: number
    loop?: boolean
    muted?: boolean
    onAbort?: (e: Event) => void
    onCanPlay?: (e: Event) => void
    onCanPlayThrough?: (e: Event) => void
    onEnded?: (e: Event) => void
    onError?: (e: Event) => void
    onListen?: (time: number) => void
    onLoadedMetadata?: (e: Event) => void
    onPause?: (e: Event) => void
    onPlay?: (e: Event) => void
    onSeeked?: (e: Event) => void
    onVolumeChanged?: (e: Event) => void
    preload?: '' | 'none' | 'metadata' | 'auto'
    src?: string, // Not required b/c can use <source>
    title?: string
    volume: number
}

export const PodPlayer: FC<ReactAudioPlayerProps> = props => {

    const audioEl = useRef<HTMLAudioElement>(null);

    return (
        <audio
            autoPlay={props.autoPlay}
            className="audio"
            controls={props.controls}
            id={props.id}
            loop={props.loop}
            muted={props.muted}
            preload={props.preload}
            ref={audioEl}
            src={props.src}
            title={props.title ?? props.src}
        />
    );
}
