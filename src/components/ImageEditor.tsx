import React, { FC, useEffect, useRef, useState } from "react"
import { _blobToBase64, hashBlob } from "../utilities/utilities"
import { useIndexedDb } from "../hooks"
import { LOADING_IMAGE } from "../utilities/constants"

interface ImageEditorProps {
    imageId: number
    onExitButtonClicked?: () => void
}

export const ImageEditor: FC<ImageEditorProps> = (props) => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [image64, setImage64] = useState(LOADING_IMAGE)
    const [image64Compressed, setImage64Compressed] = useState(LOADING_IMAGE)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const db = useIndexedDb("STORE_IMAGE")

    useEffect(() => {
        const fetch64 = async () => {
            let item = await db.getByID(props.imageId)
            setImage64(item.base64)
            setTitle(item.title)
            setDescription(item.description ?? "")
            setImage64Compressed(item.base64_compressed ?? "")
        }
        fetch64()
    }, [])

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

    async function saveImage(title: string, description: string, tags: string[]) {
        let hash = await base64tohash(image64)
        let res = await db.getByID(props.imageId)
        if (res) {
            db.update({
                id: res.id,
                title: title,
                description: description,
                base64: image64,
                hash: hash,
                base64_compressed: "",
                hash_compressed: "",
                tags: ["tag1", "tag2"],
                deleted: false,
            })
        } else {
            await db.add({
                title: title,
                description: description,
                base64: image64,
                hash: hash,
                base64_compressed: "",
                hash_compressed: "",
                tags: tags,
                deleted: false,
            })
        }
    }

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
