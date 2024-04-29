import React, { FC, useEffect, useRef, useState } from "react"
import { useIndexedDb } from "../../utilities/hooks"
import { LOADING_IMAGE } from "../../utilities/constants"
import { MarkdownEditor } from "./MarkdownEditor"

interface MarkdownReaderProps {
    id: number
}

export const MarkdownReader: FC<MarkdownReaderProps> = (props) => {
    const [innerHtml, setInnerHtml] = React.useState("")
    const md_db = useIndexedDb("STORE_MARKDOWN")
    const [src, setSrc] = useState("")
    const elemRef = useRef<HTMLDivElement>(null)
    const [mode, setMode] = useState<"editor" | "reader">("editor")
    const image_db = useIndexedDb("STORE_IMAGE")
    const image_p = (
        <p>
            <img className="store-image" src={LOADING_IMAGE} store-id="2" />
        </p>
    )

    useEffect(() => {
        const fetchSrc = async () => {
            let item = await md_db.getByID(props.id)
            setSrc(item.content)
        }
        fetchSrc()
    }, [])

    useEffect(() => {
        let html = window.markdownToHtml(src)
        setInnerHtml(html)
    }, [src, mode])

    useEffect(() => {
        if (elemRef.current) {
            elemRef.current.querySelectorAll("code.language-math").forEach((elem) => {
                let text = elem.textContent ?? ""
                window.katex.render(text, elem as HTMLElement, { throwOnError: false })
            })
            elemRef.current.querySelectorAll("img.store-image").forEach((elem) => {
                let id = elem.getAttribute("store-id")
                let num = parseInt(id ?? "0")
                image_db.getByID(num).then((item) => {
                    let base64 = item?.base64
                    if (base64) {
                        elem.setAttribute("src", base64)
                    }
                })
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

    const titleColumn = <div />
    const editor = (
        <MarkdownEditor
            initialText={src}
            onEdited={(txt) => {
                setSrc(txt)
            }}
            onSaved={(txt) => {
                console.log(src)
                md_db.update({
                    id: props.id,
                    title: "title",
                    content: txt,
                    tags: [],
                    deleted: false,
                })
            }}
        />
    )

    return (
        <div className="markdown-reader">
            {mode == "editor" ? editor : titleColumn}
            <div className="markdown-reader-rendered">
                <div className="markdown-body" ref={elemRef} dangerouslySetInnerHTML={{ __html: innerHtml }} />
            </div>
        </div>
    )
}
