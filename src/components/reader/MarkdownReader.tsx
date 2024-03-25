import React, { FC, useEffect, useRef, useState } from "react"
import { useLocalStorage } from "../../hooks"

export const MarkdownReader: FC = () => {
    const [innerHtml, setInnerHtml] = React.useState("")
    const [src, saveSrc] = useLocalStorage("markdownCode", "")
    const textRef = useRef<HTMLTextAreaElement>(null)
    const elemRef = useRef<HTMLDivElement>(null)
    const [mode, setMode] = useState<"editor" | "reader">("reader")

    const markdownCodeEditor = (
        <div className="markdown-reader-code">
            <textarea ref={textRef} />
        </div>
    )

    const titleColumn = <div />

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
    }, [src, mode])

    useEffect(() => {
        if (elemRef.current) {
            elemRef.current.querySelectorAll("code.language-math").forEach((elem) => {
                let text = elem.textContent ?? ""
                window.katex.render(text, elem as HTMLElement, { throwOnError: false })
            })
        }
    }, [innerHtml])

    useEffect(() => {
        document.onkeydown = (e) => {
            if (e.key == "F2") {
                setMode(mode == "editor" ? "reader" : "editor")
            }
        }
        return () => {
            document.onkeydown = null
        }
    }, [mode])

    return (
        <div className="markdown-reader">
            {mode == "editor" ? markdownCodeEditor : titleColumn}
            <div className="markdown-reader-rendered">
                <div className="markdown-body" ref={elemRef} dangerouslySetInnerHTML={{ __html: innerHtml }} />
            </div>
        </div>
    )
}
