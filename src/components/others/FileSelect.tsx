import React, { FC, useEffect, useState } from "react"

export const FileSelect: FC = () => {
    const [selectedFile, setSelectedFile] = useState<Blob>()
    const [imagePreview, setImagePreview] = useState<string>()

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
                id="file-select-input"
                className="border-l-yellow-400"
                type="file"
                onChange={(ev) => {
                    if (!ev.target.files || ev.target.files.length === 0) {
                        setSelectedFile(undefined)
                        return
                    }
                    setSelectedFile(ev.target.files[0])
                }}
                accept="*"
            />
            {selectedFile && (selectedFile?.type.split("/")[0] == "image" ? <img src={imagePreview} /> : undefined)}
            <button
                onClick={(_) => {
                    // let fileName = selectedFile?.name
                    let fileName = prompt("Enter file name:")
                    if (fileName && selectedFile) {
                    }
                }}
            >
                Save
            </button>
        </div>
    )
}
