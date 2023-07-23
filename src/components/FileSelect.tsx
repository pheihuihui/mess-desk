import React, { FC, useEffect, useState } from "react"
import { getFileDB, populateOneFile } from "../utilities/db"

export const FileSelect: FC = () => {
    const [selectedFile, setSelectedFile] = useState<Blob | undefined>()
    const [imagePreview, setImagePreview] = useState<string | undefined>()

    useEffect(() => {
        if (!selectedFile) {
            setImagePreview(undefined)
            return
        }
        const objectUrl = URL.createObjectURL(selectedFile)
        setImagePreview(objectUrl)
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    return (
        <div className="image-select">
            <h1 className="text-3xl font-bold underline">Select File:</h1>
            <input
                className="border-l-yellow-400"
                type='file'
                onChange={ev => {
                    if (!ev.target.files || ev.target.files.length === 0) {
                        setSelectedFile(undefined)
                        return
                    }
                    setSelectedFile(ev.target.files[0])
                }}
                accept="*" />
            {selectedFile && (selectedFile?.type.split('/')[0] == 'image' ? <img src={imagePreview} /> : undefined)}
            <button onClick={_ => {
                let fileName = selectedFile?.name
                if (fileName && selectedFile) {
                    populateOneFile(fileName, selectedFile)
                }
            }}>Save</button>
        </div>
    )
}