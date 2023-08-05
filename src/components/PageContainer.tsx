import React, { FC, useEffect, useRef } from "react"
import { useWindowSize } from "../hooks"
import { findOneFile } from "../utilities/db"
import { mhtml2html } from "../utilities/mhtml2html"
import { SearchBar } from "./SearchBar"
import { DBStorage } from '../utilities/meta'
import { SaveIcon, UpRightArrow } from "./Icon"
import { Button } from "./Button"

export const PageContainer: FC = () => {

    const size = useWindowSize()
    const ifrRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        const setIframeContent = (body: HTMLElement) => {
            const ifr = ifrRef.current
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
        <div className="overflow-hidden shadow-2xl rounded-2xl " style={{ width: 1280, height: size.height * 0.9 }}>
            <div className="flex items-center pl-3 space-x-2 bg-gray-200 rounded-t-xl h-10">
                <span className="w-3 h-3 p-1 bg-white rounded-full"></span>
                <span className="w-3 h-3 p-1 bg-white rounded-full"></span>
                <span className="w-3 h-3 p-1 bg-white rounded-full"></span>
                <SearchBar placeHolder="url" onChange={() => { }} onSearch={e => {
                    let url = e.target[0].value
                    const ifr = ifrRef.current
                    if (ifr) {
                        ifr.src = url
                    }
                }} />
                <Button color="blue" onclick={() => { }} text="open">
                    <SaveIcon />
                </Button>
                <Button color="blue" onclick={() => { }} text="open">
                    <UpRightArrow />
                </Button>

            </div>
            <iframe className="rounded-b-xl align-middle h-[calc(100vh_-_10.75rem)]" ref={ifrRef} style={{ width: '100%', height: '100%' }} />
        </div>
    )
}