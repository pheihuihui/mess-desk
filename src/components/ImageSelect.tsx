import React, { FC, useEffect, useState } from "react"

export const ImageSelect: FC = () => {
    const [selectedFile, setSelectedFile] = useState<Blob | undefined>()
    const [preview, setPreview] = useState<string | undefined>()

    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }
        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    return (
        <div className="image-select">
            <h1 className="text-3xl font-bold underline">
                Hello world!
            </h1>
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
                accept="image/*" />
            {selectedFile && <img src={preview} />}
            {/* <div>{selectedFile?.type}</div> */}
            <button onClick={_ => { }}>Save</button>
        </div>
    )
}