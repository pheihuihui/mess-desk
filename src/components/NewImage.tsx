import React, { FC, useEffect, useRef, useState } from "react"
import { SaveIcon, EditIcon } from './Icon'
import { TagsInput } from "./tag/TagsInput"
import { hashBlob } from "../utilities/utilities"
import { populateOneImage } from "../utilities/db"

export const NewImage: FC = () => {

    const [description, setDescription] = useState<string>('')
    const [tags, setTags] = useState<string[]>([])
    const [imageDataUrl, setImageDataUrl] = useState<string>('')
    const [compressedImageDataUrl, setCompressedImageDataUrl] = useState<string>('')
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        navigator.clipboard.readText()
            .then(txt => {
                if (txt.startsWith('data:image')) {
                    setImageDataUrl(txt)
                }
            })
    }, [])

    async function handleCompress() {
        let tmp = await fetch(imageDataUrl)
        let blb = await tmp.blob()
        let hash = await hashBlob(blb)
        populateOneImage(blb)
        // let canv = canvasRef.current
        // let img = imgRef.current
        // if (canv && img) {
        //     let ctx = canv.getContext('2d')
        //     let imgH = img.naturalHeight
        //     let imgW = img.naturalWidth
        //     let srcSize = imgH * imgW
        //     let targetSize = 200 * 200
        //     let x = Math.sqrt(srcSize / targetSize)
        //     if (x > 1) {
        //         let targetH = Math.floor(imgH / x)
        //         let targetW = Math.floor(imgW / x)
        //         canv.height = targetH
        //         canv.width = targetW
        //         ctx?.drawImage(img, 0, 0, targetW, targetH)
        //         let dt = canv.toDataURL()
        //         setCompressedImageDataUrl(dt)
        //     } else {
        //         setCompressedImageDataUrl(imageDataUrl)
        //     }
        // }
    }

    return (
        <div className="w-80">
            <button onClick={handleCompress}>
                <SaveIcon />
            </button>
            <img ref={imgRef} src={imageDataUrl} className="max-h-64 max-w-5xl" />
            <canvas ref={canvasRef} className="hidden" />
            <label className="block mb-2 text-sm font-medium text-gray-900">Description:</label>
            <textarea
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write your descriptions here..."
                onChange={e => setDescription(e.target.value)}
            />
            <label className="block mb-2 text-sm font-medium text-gray-900">Tags:</label>
            <TagsInput onChange={setTags} />
        </div>
    )
}