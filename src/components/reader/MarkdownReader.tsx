import React, { FC, useEffect } from "react"

interface MarkdownReaderProps {
    src: string
}

export const MarkdownReader: FC<MarkdownReaderProps> = (props) => {
    const [innerHtml, setInnerHtml] = React.useState("")
    useEffect(() => {
        fetch(props.src).then((resp) => {
            resp.text().then((text) => {
                let html = window.markdownToHtml(text)
                setInnerHtml(html)
            })
        })
    }, [])

    return (
        <div className="markdown-reader">
            <div className="markdown-reader-code">
                <textarea />
            </div>
            <div className="markdown-reader-rendered">
                <div className="markdown-body" dangerouslySetInnerHTML={{ __html: innerHtml }} />
            </div>
        </div>
    )
}
