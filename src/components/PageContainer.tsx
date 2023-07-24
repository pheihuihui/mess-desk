import React, { FC, useEffect } from "react"
import { useFetch, useWindowSize } from "../hooks"
import { findOneFile } from "../utilities/db"
import { mhtml2html } from "../utilities/mhtml2html"
import { SearchBar } from "./SearchBar"

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
        <div className="overflow-hidden shadow-xl rounded-xl " style={{ transformOrigin: 'right center' }}>
            <div className="flex items-center pl-3 space-x-1 bg-gray-200 rounded-t-xl h-7">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <SearchBar placeHolder="url" onChange={() => { }} onSearch={e => {
                    let url = e.target[0].value
                    const ifr = document.getElementById(iframeID) as HTMLIFrameElement
                    ifr['src'] = url
                }} />
            </div>
            <iframe className="rounded-b-xl align-middle h-[calc(100vh_-_10.75rem)]"
                width={1280}
                height={size.height}
                id={iframeID}
            />
        </div>
    )
}