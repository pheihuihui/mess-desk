import React, { FC, useEffect, useRef, useState } from "react";

interface TweetProps {
    tweetId: string
    options?: object
    placeholder?: string | React.ReactNode
    protocol?: 'http' | 'https'
    onTweetLoadSuccess?: (twitterWidgetElement: HTMLElement) => any
    onTweetLoadError?: (err: Error) => any
    width?: number
}

export const Tweet: FC<TweetProps> = props => {

    const [isLoaded, setIsLoaded] = useState(false)
    const [callbacks, setCallbacks] = useState<Array<() => void>>([])
    const divRef = useRef<HTMLDivElement>(null)

    function loadTweetFromProps(props: TweetProps) {
        const renderTweet = () => {
            const twttr = window['twttr']
            // @ts-ignore
            twttr.ready().then(({ widgets }) => {

                if (divRef.current) {
                    divRef.current.innerHTML = ''
                }

                const { options, onTweetLoadSuccess, onTweetLoadError } = props
                widgets
                    .createTweetEmbed(props.tweetId, divRef.current, options)
                    // @ts-ignore
                    .then((twitterWidgetElement) => {
                        setIsLoaded(true)
                        onTweetLoadSuccess && onTweetLoadSuccess(twitterWidgetElement)
                    })
                    .catch(onTweetLoadError)
            })
        }
        const twttr = window['twttr']
        if (!(twttr && twttr.ready)) {
            const isLocal = window.location.protocol.indexOf('file') >= 0
            const protocol = isLocal ? props.protocol : ''
            addScript(`${protocol}//platform.twitter.com/widgets.js`, renderTweet)
        } else {
            renderTweet()
        }
    }

    function addScript(src: string, cb: () => any) {
        if (callbacks.length == 0) {
            callbacks.push(cb)
            let s = document.createElement('script')
            s.setAttribute('src', src)
            s.addEventListener('load', () => callbacks.forEach((cb) => cb()), false)
            document.body.appendChild(s)
        } else {
            callbacks.push(cb)
        }
    }

    useEffect(() => {
        loadTweetFromProps(props)
    }, [])

    return (
        <div ref={divRef}>
            {!isLoaded ?? props.placeholder}
        </div>
    )
}
