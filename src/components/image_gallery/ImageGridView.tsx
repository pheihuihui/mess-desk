import React, { FC, useEffect, useRef, useState } from "react"
import { useIndexedDb } from "../../hooks"

export const ImageGridView: FC = () => {
    const db = useIndexedDb("STORE_IMAGE")
    const [keyword, setKeyword] = useState("")
    const [images, setImages] = useState<string[]>([])

    useEffect(() => {
        const getImages = async () => {
            // let tmp = await db.getByIndex("title", keyword)
            // db.getAll().then((items) => {
            //     console.log(items)
            // })
            // setImages([tmp].map((item) => item.base64))
            setImages([])
            db.openCursor((event) => {
                // @ts-ignore
                let cursor = event.target.result
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
