import React, { FC, useEffect, useRef, useState } from "react"
import { _blobToBase64, getImageFromClipboard, hashBlob } from "../../utilities/utilities"
import { useIndexedDb } from "../../hooks"

export const NewImage: FC = () => {
    const [description, setDescription] = useState("")
    const [title, setTitle] = useState("")
    const [imageDataUrl, setImageDataUrl] = useState("")
    const [image64, setImage64] = useState("")
    const [hash, setHash] = useState("")
    const [compressedImageDataUrl, setCompressedImageDataUrl] = useState("")
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const db = useIndexedDb("STORE_IMAGE")

    useEffect(() => {
        const url2base64 = async () => {
            let tmp = await fetch(imageDataUrl)
            let blb = await tmp.blob()
            let hash = await hashBlob(blb)
            let base64 = await _blobToBase64(blb)
            setImage64(base64)
            setHash(hash)
        }
        getImageFromClipboard()
            .then((url) => {
                if (url) {
                    setImageDataUrl(url)
                }
            })
            .then(url2base64)
    }, [imageDataUrl])

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
                description: description,
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
                description: description,
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
        <div className="new-image">
            <button
                className="new-image-save-button"
                onClick={(_) => {
                    saveImage(title, description, [])
                }}
            >
                Save
            </button>
            <img ref={imgRef} src={imageDataUrl} className="new-image-preview" />
            <canvas ref={canvasRef} className="" />
            <label className="new-image-title-lable">Title:</label>
            <textarea className="new-image-title-texterea" placeholder="Write your title here..." onChange={(e) => setTitle(e.target.value)} />
            <label className="new-image-description-lable">Description:</label>
            <textarea
                className="new-image-description-texterea"
                placeholder="Write your description here..."
                onChange={(e) => setDescription(e.target.value)}
            />
        </div>
    )
}
