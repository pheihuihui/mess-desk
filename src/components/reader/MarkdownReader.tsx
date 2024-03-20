import React, { FC, useEffect, useRef } from "react"
import { useLocalStorage } from "../../hooks"

export const MarkdownReader: FC = () => {
    const [innerHtml, setInnerHtml] = React.useState("")
    const [src, saveSrc] = useLocalStorage("markdownCode", "")
    const textRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        let html = window.markdownToHtml(src)
        setInnerHtml(html)
        if (textRef.current) {
            textRef.current.value = src
            textRef.current.onkeydown = (e) => {
                if (e.ctrlKey && e.key == "s") {
                    e.preventDefault()
                    saveSrc(textRef.current?.value ?? "")
                }
            }
        }
        return () => {
            if (textRef.current) {
                textRef.current.onkeydown = null
            }
        }
    }, [src])

    return (
        <div className="markdown-reader">
            <div className="markdown-reader-code">
                <textarea ref={textRef} />
            </div>
            <div className="markdown-reader-rendered">
                <div className="markdown-body" dangerouslySetInnerHTML={{ __html: innerHtml }} />
            </div>
        </div>
    )
}
