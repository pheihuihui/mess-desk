import React, { FC, useEffect } from "react"
import { useFetch, useWindowSize } from "../hooks"
import { findOneFile } from "../utilities/db"
import { mhtml2html } from "../utilities/mhtml2html"

const iframeID = 'iframeID'

export const PageContainer: FC = () => {

    const size = useWindowSize()

    useEffect(() => {
        const setIframeContent = (body: HTMLElement) => {
            const ifr = document.getElementById(iframeID) as HTMLIFrameElement
            if (ifr) {
                const doc = ifr.contentWindow?.document
                if (doc) {
                    doc.open()
                    findOneFile('Hidden-subgroup-problem.mhtml')
                        .then(blob => blob.text())
                        .then(mhtml2html.convert)
                        .then(x => x?.window.document.documentElement.outerHTML)
                        .then(x => { doc.write(x!) })
                        .then(() => doc.close())
                }
            }
        }
        setIframeContent(document.body)
    }, [])

    return (
        <iframe
            width={size.width}
            height={size.height}
            id={iframeID}
        />
    )
}