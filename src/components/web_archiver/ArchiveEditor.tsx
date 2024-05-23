import React, { FC, useState } from "react"
import { _blobToBase64 } from "../../utilities/utilities"
import { PageContainer } from "./PageContainer"
import { mhtml2html } from "../../utilities/mhtml2html"

export const ArchiveEditor: FC = () => {
    const [html, setHtml] = useState("")
    const [url, setUrl] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    async function savePage(title: string, description: string, tags: string[]) {
        // TODO: Implement savePage
    }

    return (
        <div className="image-editor">
            <div className="image-editor-column-left">
                <PageContainer html={html} url={url} />
            </div>
            <div className="image-editor-column-right">
                <div className="image-editor-column-right-button-group">
                    <button
                        className="image-editor-paste-button text-button"
                        onClick={(_) => {
                            navigator.clipboard
                                .read()
                                .then((x) => x[0].getType("text/plain"))
                                .then((x) => x.text())
                                .then((x) => {
                                    let obj = JSON.parse(x)
                                    if (obj.contentType && obj.contentType == "page") {
                                        let _html = mhtml2html.convert(obj.data)
                                        let tmp = _html?.window.document.documentElement.outerHTML
                                        if (tmp) {
                                            setHtml(tmp)
                                            setUrl(obj.link ?? "no link")
                                        }
                                    }
                                })
                        }}
                    >
                        Paste New Page
                    </button>
                    <button
                        className="image-editor-save-button text-button"
                        onClick={(_) => {
                            // TODO: Implement Save
                        }}
                    >
                        Save
                    </button>
                </div>
                <div className="input-group">
                    <input
                        id="archiver-title-input"
                        type="text"
                        required={true}
                        autoComplete="off"
                        className="input-group-title"
                        name="title"
                        placeholder="Image title here..."
                        onChange={(e) => {
                            setTitle(e.target.value)
                        }}
                    />
                    <textarea
                        autoComplete="off"
                        className="input-group-description"
                        name="description"
                        placeholder="Image description here..."
                        rows={5}
                        onChange={(e) => {
                            setDescription(e.target.value)
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
