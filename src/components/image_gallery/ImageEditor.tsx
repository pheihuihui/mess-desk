import React, { FC, useContext, useEffect, useRef, useState } from "react"
import { _blobToBase64, hashBlob } from "../../utilities/utilities"
import { useBackgroundImage, useIndexedDb, useLocalStorage, useLocalTags } from "../../utilities/hooks"
import { LOADING_IMAGE } from "../../utilities/constants"
import { useHashLocation } from "../../utilities/hash_location"
import { useRoute } from "../../router"
import { Rect } from "../utilities/CircleAndRect"
import { MetadataEditorAndViewerParts } from "../_layout/MetadataEditorAndViewer"
import { NotificationContext } from "../utilities/Notification"

export const ImageEditor: FC = () => {
    const [imageId, setImageId] = useState(-1)
    const [location, navigate] = useHashLocation()
    const [_, param] = useRoute("/:id")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [image64, setImage64] = useState(LOADING_IMAGE)
    const [image64Compressed, setImage64Compressed] = useState(LOADING_IMAGE)
    const [preImage64Compressed, setPreImage64Compressed] = useState(image64Compressed)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const db = useIndexedDb("STORE_IMAGE")
    const [tags, setTags] = useState<string[]>([])
    const [initialTags, setInitialTags] = useState<string[]>([])
    const localTagging = useLocalTags()
    const [backgroundImage, setBackgroundId] = useBackgroundImage()
    const notification = useContext(NotificationContext)
    const [showRect, setShowRect] = useState(false)
    const [rectX, setRectX] = useState(100)
    const [rectY, setRectY] = useState(100)
    const [rectD, setRectD] = useState(200)

    async function setImageDetails(id: number) {
        let item = await db.getByID(id)
        if (item) {
            setTitle(item.title)
            setDescription(item.description ?? "")
            setImage64(item.base64)
            setImage64Compressed(item.base64_compressed ?? "")
            setInitialTags(item.tags)
        }
    }

    useEffect(() => {
        let canvas = canvasRef.current
        if (canvas && imgRef.current) {
            let _w = imgRef.current.naturalWidth
            let _h = imgRef.current.naturalHeight
            let _dw = 0
            let _dh = 0
            let scale = 1
            if (_w > _h) {
                scale = _w / 800
                _dh = ((800 - _h / scale) / 2) * scale
            } else {
                scale = _h / 800
                _dw = ((800 - _w / scale) / 2) * scale
            }
            let ctx = canvas.getContext("2d")
            if (ctx) {
                canvas.width = 100
                canvas.height = 100
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(imgRef.current, rectX * scale - _dw, rectY * scale - _dh, rectD * scale, rectD * scale, 0, 0, canvas.width, canvas.height)
                let data = canvas.toDataURL("image/png")
                setImage64Compressed(data)
            }
        }
    }, [rectX, rectY, rectD])

    useEffect(() => {
        let _id = param?.id
        let num = parseInt(_id ?? "")
        if (!Number.isNaN(num) && num >= 0) {
            setImageId(num)
            setImageDetails(num)
        }
    }, [location])

    // useEffect(() => {
    //     if (canvasRef.current) {
    //         let canv = canvasRef.current
    //         let dt = canv.toDataURL("image/png")
    //         setImage64Compressed(dt)
    //     }
    // }, [canvasRef])

    async function base64tohash(base: string) {
        let tmp = await fetch(base)
        let blb = await tmp.blob()
        let hash = await hashBlob(blb)
        return hash
    }

    // https://stackoverflow.com/questions/17861447/html5-canvas-drawimage-how-to-apply-antialiasing/17862644#17862644
    function compressImage() {
        let canv = canvasRef.current
        let img = imgRef.current
        if (canv && img) {
            let preCanvas = document.createElement("canvas")
            let preCtx = preCanvas.getContext("2d")
            preCanvas.width = img.naturalWidth
            preCanvas.height = img.naturalHeight

            const steps = (img.naturalWidth / canv.width) >> 1
            if (preCtx) {
                preCtx.filter = `blur(${steps}px)`
                preCtx.drawImage(img, 0, 0)
            }

            let ctx = canv.getContext("2d")
            if (ctx) {
                let ratio = img.naturalWidth / img.naturalHeight
                let _w = canv.width
                let _h = canv.width
                if (ratio < 1) {
                    _w = _h * ratio
                } else {
                    _h = _w / ratio
                }
                canv.width = _w
                canv.height = _h
                ctx.clearRect(0, 0, _w, _h)
                ctx.drawImage(preCanvas, 0, 0, preCanvas.width, preCanvas.height, 0, 0, _w, _h)
            }
        }
    }

    function saveCompressedImage() {
        let canv = canvasRef.current
        if (canv) {
            let dt = canv.toDataURL("image/png")
            setImage64Compressed(dt)
        }
    }

    async function saveImage(title: string, description: string, tags: string[]) {
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
                <div className="image-editor-large-view">
                    <img ref={imgRef} src={image64} />
                    <Rect
                        onMoveAndResize={(x, y, d) => {
                            if (!(x == 100 && y == 100 && d == 200)) {
                                setRectX(x)
                                setRectY(y)
                                setRectD(d)
                            }
                        }}
                        hidden={!showRect}
                        headX={rectX}
                        headY={rectY}
                        headD={rectD}
                    />
                </div>
            </div>
            <div className="image-editor-column-right">
                <div className="image-editor-column-right-button-group">
                    <button
                        className="image-editor-compress-button text-button"
                        onClick={(_) => {
                            compressImage()
                            saveCompressedImage()
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
                            saveImage(title, description, tags)
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
                            let str = Date.now().toString()
                            if (notification.setMessage) {
                                console.log("zzz")
                                notification.setMessage(str)
                            }
                        }}
                    >
                        Test
                    </button>
                </div>
                <div className="input-group">
                    <MetadataEditorAndViewerParts.Title data={title} onSave={setTitle} />
                    <MetadataEditorAndViewerParts.Description data={description} onSave={setDescription} />
                    <MetadataEditorAndViewerParts.TagWrapper data={initialTags} onChange={setTags} />
                    <MetadataEditorAndViewerParts.CompressedImage
                        data={image64Compressed}
                        onSave={() => {}}
                        onStartEdit={() => {
                            setPreImage64Compressed(image64Compressed)
                            setShowRect(true)
                        }}
                        onCancelEdit={() => {
                            setImage64Compressed(preImage64Compressed)
                            setShowRect(false)
                        }}
                    />
                </div>
                <canvas ref={canvasRef} className="image-editor-preview-canvas" />
            </div>
        </div>
    )
}
