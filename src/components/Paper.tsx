import React, { FC, useEffect, useState } from "react"

export const Paper: FC<{ markdown: string }> = (props) => {

    const [html, setHtml] = useState<string>('')

    useEffect(() => {
        let tmp = window.markdownToHtml(props.markdown)
        setHtml(tmp)
    }, [])

    return <article className="prose prose-slate" style={{ width: 1500 }} dangerouslySetInnerHTML={{ __html: html }} />
}