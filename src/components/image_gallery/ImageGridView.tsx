import React, { FC, useEffect, useState } from "react"
import { useIndexedDb } from "../../hooks"

export const ImageGridView: FC = () => {
    const db = useIndexedDb("STORE_IMAGE")
    const [keyword, setKeyword] = useState("")
    const [images, setImages] = useState<string[]>([])

    useEffect(() => {
        const getImages = async () => {
            setImages([])
            db.openCursor((event) => {
                console.log(event)
                // @ts-ignore
                let cursor = event.currentTarget.result
                console.log(cursor)
                if (cursor) {
                    if (cursor.value && cursor.value.title.includes(keyword) && keyword != "") {
                        setImages((prev) => [...prev, cursor.value.base64_compressed])
                    }
                    cursor.continue()
                }
            })
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
                        setKeyword(e.currentTarget.value)
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
