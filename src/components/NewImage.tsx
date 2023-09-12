import React, { FC, useEffect, useState } from "react"
import { SaveIcon, EditIcon } from './Icon'
import { TagsInput } from "./tag/TagsInput"

export const NewImage: FC = () => {

    const [description, setDescription] = useState<string>('')
    const [tags, setTags] = useState<string[]>([])
    const [imageDataUrl, setImageDataUrl] = useState<string>('')

    useEffect(() => {
        navigator.clipboard.readText()
            .then(txt => {
                if (txt.startsWith('data:image')) {
                    setImageDataUrl(txt)
                }
            })
    }, [])

    return (
        <div className="w-80">
            <button onClick={() => {
                console.log(description)
                console.log(tags)
            }}>
                <SaveIcon />
            </button>
            <img src={imageDataUrl} className="max-h-64 max-w-5xl" />
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