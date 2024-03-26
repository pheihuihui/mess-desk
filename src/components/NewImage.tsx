import React, { FC, useEffect, useRef, useState } from "react"
import { SaveIcon } from "./Icon"
import { TagsInput } from "./tag/TagsInput"
import { _blobToBase64, getImageFromClipboard, hashBlob } from "../utilities/utilities"
import { useIndexedDB } from "../utilities/db"

export const NewImage: FC = () => {
    const [description, setDescription] = useState<string>("")
    const [tags, setTags] = useState<string[]>([])
    const [imageDataUrl, setImageDataUrl] = useState<string>("")
    const [compressedImageDataUrl, setCompressedImageDataUrl] = useState<string>("")
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const db = useIndexedDB("STORE_IMAGE")

    useEffect(() => {
        getImageFromClipboard().then((url) => {
            if (url) {
                setImageDataUrl(url)
            }
        })
    }, [])

    function handleCompress() {
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
                console.log(dt)
                setCompressedImageDataUrl(dt)
            } else {
                setCompressedImageDataUrl(imageDataUrl)
            }
        }
    }

    async function saveImage(title: string, description: string, tags: string[]) {
        handleCompress()
        let tmp = await fetch(imageDataUrl)
        let blb = await tmp.blob()
        let hash = await hashBlob(blb)
        let base64 = await _blobToBase64(blb)
        let tmp2 = await fetch(compressedImageDataUrl)
        let blb2 = await tmp2.blob()
        let hash2 = await hashBlob(blb2)
        let base642 = await _blobToBase64(blb2)
        await db.add({ title: title, desctiption: description, base64: base64, hash: hash, compressed_base64: base642, compressed_hash: hash2, tags: tags })
    }

    return (
        <div className="new-image">
            <button
                className="new-image-save-button"
                onClick={(_) => {
                    // saveImage("test", description, [])
                    navigator.clipboard.readText().then(console.log)
                }}
            >
                <SaveIcon />
            </button>
            <img ref={imgRef} src={imageDataUrl} className="new-image-preview" />
            <canvas ref={canvasRef} className="" />
            <label className="">Description:</label>
            <textarea className="" placeholder="Write your descriptions here..." onChange={(e) => setDescription(e.target.value)} />
            <label className="">Tags:</label>
            <TagsInput onChange={setTags} />
        </div>
    )
}
