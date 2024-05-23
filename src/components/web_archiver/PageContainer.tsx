import React, { FC, useEffect, useRef } from "react"

interface PageContainerProps {
    url: string
    html: string
}

export const PageContainer: FC<PageContainerProps> = (props) => {
    const ifrRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        const setIframeContent = (body: HTMLElement) => {
            const ifr = ifrRef.current
            if (ifr) {
                const doc = ifr.contentWindow?.document
                if (doc) {
                    doc.open()
                    doc.write(props.html)
                    doc.close()
                }
            }
        }
        setIframeContent(document.body)
    }, [props])

    return (
        <div className="page-container">
            <div className="page-container-bar">
                <div className="page-container-bar-address">
                    {[1, 2, 3].map((_, i) => (
                        <span key={i} className="page-container-bar-address-dot" />
                    ))}
                    <input id="page-container-address-input" className="page-container-bar-address-input" type="text" size={100} defaultValue={props.url} />
                </div>
                {/* <div className="page-container-bar-btns">
                    <button className="page-container-bar-btns-btn">
                        <SaveIcon />
                    </button>
                    <button className="page-container-bar-btns-btn">
                        <UpRightArrow />
                    </button>
                </div> */}
            </div>
            <iframe className="page-container-iframe" ref={ifrRef} />
        </div>
    )
}
