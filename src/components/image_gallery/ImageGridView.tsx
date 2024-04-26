import React, { FC, useEffect, useState } from "react"
import { useIndexedDb } from "../../hooks"
import { navigate } from "../../utilities/hash_location"

export const ImageGridView: FC = () => {
    const db = useIndexedDb("STORE_IMAGE")
    const [keyword, setKeyword] = useState(" ")
    const [images, setImages] = useState<Record<string, string>>({})

    useEffect(() => {
        const getImages = async () => {
            setImages({})
            db.openCursor((event) => {
                // @ts-ignore
                let cursor = event.currentTarget.result
                if (cursor) {
                    if (cursor.value && cursor.value.title.includes(keyword)) {
                        setImages(Object.assign(images, { [cursor.value.id]: cursor.value.base64_compressed }))
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
                {Object.keys(images).map((id) => (
                    <div key={id} className="image-gallery-grid-view-cell">
                        <img src={images[id]} onClick={() => navigate(`/image-editor/${id}`)} />
                    </div>
                ))}
            </div>
        </div>
    )
}
