import React, { FC, useEffect, useRef, useState } from "react"
import { _blobToBase64, getImageFromClipboard, hashBlob } from "../utilities/utilities"
import { useIndexedDB } from "../utilities/db"

interface ImageEditorProps {
    imageId: number
    onExitButtonClicked?: () => void
}

export const ImageEditor: FC<ImageEditorProps> = (props) => {
    const [description, setDescription] = useState("")
    const [title, setTitle] = useState("")
    const [imageId, setImageId] = useState(props.imageId)
    const [imageDataUrl, setImageDataUrl] = useState("")
    const [image64, setImage64] = useState("./loading.jpg")
    const [hash, setHash] = useState("")
    const [compressedImageDataUrl, setCompressedImageDataUrl] = useState("")
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const db = useIndexedDB("STORE_IMAGE")

    useEffect(() => {
        const fetch64 = async () => {
            let tmp = await db.getByID(imageId)
            let base64 = tmp.base64
            setImage64(base64)
        }
        fetch64()
    }, [])

    useEffect(() => {
        compressImage()
    }, [image64])

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
                setCompressedImageDataUrl(dt)
            } else {
                setCompressedImageDataUrl(imageDataUrl)
            }
        }
    }

    async function saveImage(title: string, description: string, tags: string[]) {
        let tmp2 = await fetch(compressedImageDataUrl)
        let blb2 = await tmp2.blob()
        let hash2 = await hashBlob(blb2)
        let base642 = await _blobToBase64(blb2)
        let res = await db.getByIndex("hash", hash)
        if (res) {
            db.update({
                id: res.id,
                title: title,
                desctiption: description,
                base64: image64,
                hash: hash,
                base64_compressed: base642,
                hash_compressed: hash2,
                tags: tags,
                deleted: false,
            })
        } else {
            await db.add({
                title: title,
                desctiption: description,
                base64: image64,
                hash: hash,
                base64_compressed: base642,
                hash_compressed: hash2,
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
                    <button className="image-editor-compress-button text-button" onClick={(_) => {}}>
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
                    <input type="text" required={true} autoComplete="off" className="input-group-title" name="title" placeholder="Image title here..." />
                    <textarea autoComplete="off" className="input-group-description" name="description" placeholder="Image description here..." rows={5} />
                </div>
                <canvas ref={canvasRef} className="image-editor-preview-canvas" />
            </div>
        </div>
    )
}
