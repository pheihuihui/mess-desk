import React, { FC, useEffect, useRef, useState } from "react"
import { _blobToBase64, hashBlob } from "../../utilities/utilities"
import { useBackgroundImage, useIndexedDb, useLocalStorage, useLocalTags } from "../../utilities/hooks"
import { LOADING_IMAGE } from "../../utilities/constants"
import { useHashLocation } from "../../utilities/hash_location"
import { useRoute } from "../../router"
import { TagInputWithDefaultProps } from "../tag/_index"
import { Circle } from "../others/Circle"

export const ImageEditor: FC = () => {
    const [imageId, setImageId] = useState(-1)
    const [location, navigate] = useHashLocation()
    const [_, param] = useRoute("/:id")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [image64, setImage64] = useState(LOADING_IMAGE)
    const [image64Compressed, setImage64Compressed] = useState(LOADING_IMAGE)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const db = useIndexedDb("STORE_IMAGE")
    const [tags, setTags] = useState<string[]>([])
    const [initialTags, setInitialTags] = useState<string[]>([])
    const localTagging = useLocalTags()
    const [headX, setHeadX] = useState(100)
    const [headY, setHeadY] = useState(100)
    const [headD, setHeadD] = useState(200)
    const [hiddenCircle, setHiddenCircle] = useState(true)
    const [backgroundImage, setBackgroundId] = useBackgroundImage()

    async function setImageDetails(id: number) {
        let item = await db.getByID(id)
        if (item) {
            setTitle(item.title)
            setDescription(item.description ?? "")
            setImage64(item.base64)
            setImage64Compressed(item.base64_compressed ?? "")
            setInitialTags(item.tags)
            setHeadX(item.headPosition[0] ?? 100)
            setHeadY(item.headPosition[1] ?? 100)
            setHeadD(item.headPosition[2] ?? 200)
        }
    }

    useEffect(() => {
        let _id = param?.id
        let num = parseInt(_id ?? "")
        if (!Number.isNaN(num) && num >= 0) {
            setImageId(num)
            setImageDetails(num)
        }
    }, [location])

    async function base64tohash(base: string) {
        let tmp = await fetch(base)
        let blb = await tmp.blob()
        let hash = await hashBlob(blb)
        return hash
    }

    function compressImage() {
        let canv = canvasRef.current
        let img = imgRef.current
        if (canv && img) {
            let ctx = canv.getContext("2d")
            ctx?.clearRect(0, 0, canv.width, canv.height)
            let imgH = img.naturalHeight
            let imgW = img.naturalWidth
            let srcSize = imgH * imgW
            let targetSize = 200 * 200
            let x = Math.sqrt(srcSize / targetSize)
            if (x > 1) {
                let targetH = Math.floor(imgH / x)
                let targetW = Math.floor(imgW / x)
                canv.height = targetH
                canv.width = targetW
                if (ctx) {
                    ctx.imageSmoothingEnabled = true
                    ctx.imageSmoothingQuality = "high"
                    ctx.drawImage(img, 0, 0, targetW, targetH)
                    let dt = canv.toDataURL("image/jpeg", 1)
                    setImage64Compressed(dt)
                }
            } else {
                setImage64Compressed(image64)
            }
        }
    }

    async function saveImage(title: string, description: string, tags: string[], headPosition: [number, number, number]) {
        let base64 = image64
        let hash = await base64tohash(base64)
        let hash_compressed = await base64tohash(image64Compressed)
        let item = {
            title: title,
            description: description,
            base64: base64,
            hash: hash,
            image64Compressed: image64Compressed,
            hash_compressed: hash_compressed,
            deleted: false,
            tags: tags,
            base64_compressed: image64Compressed,
            id: imageId,
            headPosition: headPosition,
        }
        db.getByIndex("hash", hash).then((x) => {
            if (x) {
                let obj = { ...x, ...item }
                db.update(obj)
                    .then((item) => console.log(item))
                    .catch((e) => alert(e.target?.error?.message))
            } else {
                // @ts-ignore
                delete item["id"]
                db.add(item)
                    .then((_id) => navigate("/"))
                    .catch((e) => alert(e.target?.error?.message))
            }
        })
    }

    return (
        <div className="image-editor acrylic">
            <div className="image-editor-column-left">
                <img ref={imgRef} src={image64} className="image-editor-preview" />
                <Circle
                    onMoveAndResize={(x, y, d) => {
                        if (x != 100 || y != 100 || d != 200) {
                            setHeadX(x)
                            setHeadY(y)
                            setHeadD(d)
                        }
                    }}
                    hidden={hiddenCircle}
                    headX={headX}
                    headY={headY}
                    headD={headD}
                />
            </div>
            <div className="image-editor-column-right">
                <div className="image-editor-column-right-button-group">
                    <button
                        className="text-button"
                        onClick={(_) => {
                            setHiddenCircle(!hiddenCircle)
                        }}
                    >
                        {hiddenCircle ? "Set Avatar" : "Finish Setting Avatar"}
                    </button>
                    <button
                        className="image-editor-compress-button text-button"
                        onClick={(_) => {
                            compressImage()
                        }}
                    >
                        Compress
                    </button>
                    <button
                        className="image-editor-paste-button text-button"
                        onClick={(_) => {
                            navigator.clipboard.read().then((data) => {
                                if (data && data[0] && data[0].types.includes("text/plain")) {
                                    data[0]
                                        .getType("text/plain")
                                        .then((x) => x.text())
                                        .then(JSON.parse)
                                        .then((x) => {
                                            if (x && x.contentType == "image") {
                                                setImage64(x.data)
                                            }
                                        })
                                        .catch((_) => {
                                            alert("Clipboard does not contain an image")
                                        })
                                }
                            })
                        }}
                    >
                        Paste New Image
                    </button>
                    <button
                        className="image-editor-save-button text-button"
                        onClick={(_) => {
                            localTagging.addMultipleTags(tags)
                            saveImage(title, description, tags, [headX, headY, headD])
                        }}
                    >
                        Save
                    </button>
                    <button
                        className="text-button"
                        onClick={(_) => {
                            setBackgroundId(imageId)
                        }}
                    >
                        Set as background
                    </button>
                    <button className="image-editor-exit-button text-button" onClick={(_) => navigate("/home")}>
                        Exit
                    </button>
                    <button
                        hidden={true}
                        className="image-editor-exit-button text-button"
                        onClick={(_) => {
                            console.log(backgroundImage)
                        }}
                    >
                        Test
                    </button>
                </div>
                <div className="input-group">
                    <input
                        defaultValue={title}
                        type="text"
                        required={true}
                        autoComplete="off"
                        className="input-group-title"
                        name="title"
                        placeholder="Image title here..."
                        onChange={(e) => {
                            setTitle(e.currentTarget.value)
                        }}
                    />
                    <textarea
                        defaultValue={description}
                        autoComplete="off"
                        className="input-group-description"
                        name="description"
                        placeholder="Image description here..."
                        rows={5}
                        onChange={(e) => {
                            let val = e.currentTarget.value
                            setDescription(val)
                        }}
                    />
                    <TagInputWithDefaultProps
                        id="image-tagging"
                        tags={initialTags.map((t) => {
                            return { id: t, text: t }
                        })}
                        onTagsUpdated={(arr) => {
                            setTags(arr.map((t) => t.id))
                        }}
                    />
                </div>
                <canvas ref={canvasRef} className="image-editor-preview-canvas" />
            </div>
        </div>
    )
}
