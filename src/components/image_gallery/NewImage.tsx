import React, { FC, useEffect, useRef, useState } from "react"
import { _blobToBase64, hashBlob } from "../../utilities/utilities"
import { useIndexedDb } from "../../hooks"
import { LOADING_IMAGE } from "../../utilities/constants"

interface NewImageProps {
    onExitButtonClicked?: () => void
}

export const NewImage: FC<NewImageProps> = (props) => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [image64, setImage64] = useState(LOADING_IMAGE)
    const [image64Compressed, setImage64Compressed] = useState(LOADING_IMAGE)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const db = useIndexedDb("STORE_IMAGE")

    async function base64tohash(base: string) {
        let tmp = await fetch(base)
        let blb = await tmp.blob()
        let hash = await hashBlob(blb)
        return hash
    }

    function compressImage() {
        let canv = canvasRef.current
        let img = imgRef.current
        if (canv && img) {
            let ctx = canv.getContext("2d")
            ctx?.clearRect(0, 0, canv.width, canv.height)
            let imgH = img.naturalHeight
            let imgW = img.naturalWidth
            let srcSize = imgH * imgW
            let targetSize = 200 * 200
            let x = Math.sqrt(srcSize / targetSize)
            if (x > 1) {
                let targetH = Math.floor(imgH / x)
                let targetW = Math.floor(imgW / x)
                canv.height = targetH
                canv.width = targetW
                ctx?.drawImage(img, 0, 0, targetW, targetH)
                let dt = canv.toDataURL("image/png")
                setImage64Compressed(dt)
                base64tohash(dt).then((hash) => {
                    setImage64Compressed(hash)
                })
            } else {
                setImage64Compressed(image64)
            }
        }
    }

    async function saveImage(title: string, description: string, tags: string[]) {}

    return (
        <div className="image-editor">
            <div className="image-editor-column-left">
                <img ref={imgRef} src={image64} className="image-editor-preview" />
            </div>
            <div className="image-editor-column-right">
                <div className="image-editor-column-right-button-group">
                    <button
                        className="image-editor-compress-button text-button"
                        onClick={(_) => {
                            compressImage()
                        }}
                    >
                        Compress
                    </button>
                    <button
                        className="image-editor-save-button text-button"
                        onClick={(_) => {
                            saveImage(title, description, [])
                        }}
                    >
                        Save
                    </button>
                    <button
                        className="image-editor-paste-button text-button"
                        onClick={(_) => {
                            navigator.clipboard.read().then((data) => {
                                if (data && data[0] && data[0].types.includes("text/plain")) {
                                    data[0]
                                        .getType("text/plain")
                                        .then((x) => x.text())
                                        .then(JSON.parse)
                                        .then((x) => {
                                            if (x && x.contentType == "image") {
                                                setImage64(x.data)
                                            }
                                        })
                                }
                            })
                        }}
                    >
                        Paste New Image
                    </button>
                    <button
                        className="image-editor-exit-button text-button"
                        onClick={(_) => {
                            props.onExitButtonClicked && props.onExitButtonClicked()
                        }}
                    >
                        Exit
                    </button>
                </div>
                <div className="input-group">
                    <input
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
                <canvas ref={canvasRef} className="image-editor-preview-canvas" />
            </div>
        </div>
    )
}
