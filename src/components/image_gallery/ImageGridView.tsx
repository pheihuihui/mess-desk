import React, { FC, useEffect, useRef, useState } from "react"
import { useIndexedDb } from "../../hooks"

export const ImageGridView: FC = () => {
    const db = useIndexedDb("STORE_IMAGE")
    const [keyword, setKeyword] = useState("")
    const [images, setImages] = useState<string[]>([])

    useEffect(() => {
        const getImages = async () => {
            let tmp = await db.getByIndex("title", keyword)
            console.log(tmp)
            setImages([tmp].map((item) => item.base64))
        }
        getImages()
    }, [keyword])

    return (
        <div className="image-gallery">
            <input
                type="text"
                className="image-gallery-input"
                onKeyDown={(e) => {
                    if (e.key == "Enter") {
                        e.preventDefault()
                        setKeyword(e.target.value)
                    }
                }}
            />
            <div className="image-gallery-grid-view">
                {images.map((img, i) => (
                    <div key={i} className="image-gallery-grid-view-cell">
                        <img src={img} />
                    </div>
                ))}
            </div>
        </div>
    )
}
