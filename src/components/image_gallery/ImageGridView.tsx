import React, { FC, useEffect, useState } from "react"
import { useIndexedDb } from "../../utilities/hooks"
import { navigate } from "../../utilities/hash_location"

interface ImageGridViewProps {
    onImageSelected?: (id: string) => void
}

export const ImageGridView: FC<ImageGridViewProps> = (props) => {
    const db = useIndexedDb("STORE_IMAGE")
    const [keyword, setKeyword] = useState("")
    const [images, setImages] = useState<Record<string, string>>({})

    useEffect(() => {
        const getImages = async () => {
            setImages({})
            let count = 0
            db.openCursor((event) => {
                let cursor = event.currentTarget?.result
                if (cursor) {
                    if (cursor.value && cursor.value.title.includes(keyword)) {
                        setImages((prev) => ({ ...prev, [cursor.value.id]: cursor.value.base64_compressed }))
                    }
                    if (count < 9) {
                        count += 1
                        cursor.continue()
                    }
                }
            })
        }
        getImages()
    }, [keyword])

    return (
        <div className="image-gallery">
            <input
                id="image-gallery-input"
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
                        <img
                            src={images[id]}
                            onClick={() => {
                                if (props.onImageSelected) {
                                    props.onImageSelected(id)
                                } else {
                                    navigate(`/image-editor/${id}`)
                                }
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
