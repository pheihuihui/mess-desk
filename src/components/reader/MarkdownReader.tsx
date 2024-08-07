import React, { FC, useEffect, useRef, useState } from "react"
import { useIndexedDb } from "../../utilities/hooks"
import { LOADING_IMAGE, SCRIPTS, STYLES } from "../../utilities/constants"
import { MarkdownEditor } from "./MarkdownEditor"
import { navigate } from "../../utilities/hash_location"

interface MarkdownReaderProps {
    id: number | string
}

export const MarkdownReader: FC<MarkdownReaderProps> = (props) => {
    const [innerHtml, setInnerHtml] = React.useState("")
    const md_db = useIndexedDb("STORE_MARKDOWN")
    const [src, setSrc] = useState("")
    const elemRef = useRef<HTMLDivElement>(null)
    const [mode, setMode] = useState<"editor" | "reader">("editor")
    const image_db = useIndexedDb("STORE_IMAGE")
    const [frozen, setFrozen] = React.useState(false)
    const image_p = (
        <p>
            <img className="store-image" src={LOADING_IMAGE} store-id="2" />
        </p>
    )

    useEffect(() => {
        const fetchSrc = async () => {
            if (props.id == "new") {
                setSrc("")
                return
            }
            let id = parseInt(props.id as string)
            let item = await md_db.getByID(id)
            setSrc(item.content)
        }
        fetchSrc()
    }, [])

    useEffect(() => {
        if (!window.markdownToHtml) {
            return
        }
        let html = window.markdownToHtml(src)
        setInnerHtml(html)
    }, [src, mode, window.markdownToHtml])

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
            frozen={frozen}
            onSaved={(txt) => {
                setFrozen(true)
                if (props.id == "new") {
                    md_db
                        .add({
                            title: "title",
                            content: txt,
                            tags: [],
                            relatedPersons: [],
                            deleted: false,
                        })
                        .then((id) => {
                            navigate(`/home/${id}`)
                        })
                } else {
                    let id = parseInt(props.id as string)
                    md_db.update({
                        id: id,
                        title: "title",
                        content: txt,
                        tags: [],
                        relatedPersons: [],
                        deleted: false,
                    })
                }
            }}
        />
    )

    return (
        <>
            <script async type="module" src={SCRIPTS.markdown} />
            <script async src={SCRIPTS.katex} />
            <link rel="stylesheet" href={STYLES.katex} />
            <div className="markdown-reader">
                {mode == "editor" ? editor : titleColumn}
                <div className="markdown-reader-rendered">
                    <div className="markdown-body" ref={elemRef} dangerouslySetInnerHTML={{ __html: innerHtml }} />
                </div>
            </div>
        </>
    )
}
