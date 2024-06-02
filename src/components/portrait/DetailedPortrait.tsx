import React, { FC, useEffect, useRef, useState } from "react"
import { _blobToBase64 } from "../../utilities/utilities"
import { useIndexedDb } from "../../utilities/hooks"
import { LOADING_IMAGE } from "../../utilities/constants"
import { useHashLocation } from "../../utilities/hash_location"
import { useRoute } from "../../router"
import { SimpleDialog } from "../utilities/SimpleDialog"
import { ImageGridView } from "../image_gallery/ImageGridView"
import { Dropdown } from "../utilities/Dropdown"
import { Circle } from "../utilities/Circle"
import { PersonDate } from "../utilities/Date"

interface DetailedPortraitProps {
    personID?: number
}

export const DetailedPortrait: FC<DetailedPortraitProps> = (props) => {
    const [personId, setPersonId] = useState(-1)
    const [_location, navigate] = useHashLocation()
    const [_, param] = useRoute("/:id")
    const [name, setName] = useState("")
    const [selectedImageId, setSelectedImageId] = useState(-1)
    const [face, setFace] = useState("")
    const [description, setDescription] = useState("")
    const faceCanvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const dialogRef = useRef<HTMLDialogElement>(null)
    const db_person = useIndexedDb("STORE_PERSON")
    const db_image = useIndexedDb("STORE_IMAGE")
    const [bornOn, setBornOn] = useState("")
    const [diedOn, setDiedOn] = useState("")
    const [headX, setHeadX] = useState(100)
    const [headY, setHeadY] = useState(100)
    const [headD, setHeadD] = useState(200)
    const [hiddenCircle, setHiddenCircle] = useState(true)
    const allPersonTypes = ["real", "avatar", "fictional"] as const
    type PersonType = (typeof allPersonTypes)[number]
    const [personType, setPersonType] = useState<PersonType>(allPersonTypes[0])

    function setPersonDetails(id: number) {
        db_person.getByID(id).then((person) => {
            if (person) {
                setName(person.name)
                setDescription(person.description)
                setBornOn(person.birth)
                setDiedOn(person.death)
                setPersonType(person.type)
                setSelectedImageId(person.imgId)
                setHeadX(person.headPosition[0] ?? 100)
                setHeadY(person.headPosition[1] ?? 100)
                setHeadD(person.headPosition[2] ?? 200)
            }
        })
    }

    useEffect(() => {
        let canvas = faceCanvasRef.current
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
                ctx.drawImage(imgRef.current, headX * scale - _dw, headY * scale - _dh, headD * scale, headD * scale, 0, 0, canvas.width, canvas.height)
                let data = canvas.toDataURL("image/png")
                setFace(data)
            }
        }
    }, [headX, headY, headD])

    useEffect(() => {
        const setImage = async () => {
            let image = await db_image.getByID(selectedImageId)
            if (image && imgRef.current) {
                imgRef.current.src = image.base64 ?? ""
            }
        }
        setImage()
    }, [selectedImageId])

    useEffect(() => {
        let _id = param?.id
        let num = parseInt(_id ?? "")
        if (!Number.isNaN(num) && num >= 0) {
            setPersonId(num)
            setPersonDetails(num)
        }
    }, [location])

    async function savePersonDetails(name: string, description: string, tags: string[], imageId: number, headPosition: [number, number, number]) {
        let person = {
            id: personId,
            name: name,
            description: description,
            tags: tags,
            imgId: imageId,
            headPosition: headPosition,
            birth: bornOn,
            death: diedOn,
            type: personType,
            deleted: false,
        }

        if (hiddenCircle == false && face != "") {
            person = Object.assign(person, { face: face })
        }
        if (personId > 0) {
            db_person
                .getByID(personId)
                .then((x) => {
                    if (x) {
                        person = Object.assign(x, person)
                        db_person.update(person)
                    }
                })
                .then(() => {
                    console.log("updated person with id: " + personId)
                })
        } else if (personId == -1) {
            // @ts-ignore
            delete person["id"]
            db_person.add(person).then((x) => {
                if (x) {
                    console.log("saved person with id: " + x)
                }
            })
        }
    }

    return (
        <div className="image-editor acrylic">
            <div className="image-editor-column-left">
                <div className="image-editor-portrait">
                    <img ref={imgRef} src={LOADING_IMAGE} />
                    <Circle
                        onMoveAndResize={(x, y, d) => {
                            if (!(x == 100 && y == 100 && d == 200)) {
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
            </div>
            <div className="image-editor-column-right">
                <div className="image-editor-column-right-button-group">
                    <button
                        className="image-editor-compress-button text-button"
                        onClick={(_) => {
                            setHiddenCircle(!hiddenCircle)
                        }}
                    >
                        {hiddenCircle ? "Set Avatar" : "Finish Setting Avatar"}
                    </button>
                    <button
                        className="image-editor-paste-button text-button"
                        onClick={(_) => {
                            let dialog = dialogRef.current
                            if (dialog) {
                                dialog.showModal()
                            }
                        }}
                    >
                        Select Image
                    </button>
                    <button
                        className="image-editor-save-button text-button"
                        onClick={(_) => {
                            savePersonDetails(name, description, [], selectedImageId, [headX, headY, headD])
                        }}
                    >
                        Save
                    </button>
                    <button
                        className="image-editor-exit-button text-button"
                        onClick={(_) => {
                            navigate("/portraits")
                        }}
                    >
                        Exit
                    </button>
                </div>
                <div className="input-group">
                    <input
                        defaultValue={name}
                        type="text"
                        required={true}
                        autoComplete="off"
                        className="input-group-title"
                        name="title"
                        placeholder="Person name here..."
                        onChange={(e) => {
                            setName(e.currentTarget.value)
                        }}
                    />
                    <textarea
                        defaultValue={description}
                        autoComplete="off"
                        className="input-group-description"
                        name="description"
                        placeholder="Person description here..."
                        rows={5}
                        onChange={(e) => {
                            let val = e.currentTarget.value
                            setDescription(val)
                        }}
                    />
                    <PersonDate placeholder="Born on..." name="bornOn" onEdit={setBornOn} initialDate={bornOn} />
                    <PersonDate placeholder="Died on..." name="diedOn" onEdit={setDiedOn} initialDate={diedOn} />
                    <Dropdown
                        options={Array.from(allPersonTypes)}
                        onSelected={(x) => {
                            setPersonType(x as PersonType)
                        }}
                    />
                </div>
                <canvas ref={faceCanvasRef} className="face-preview-canvas" />
            </div>
            <SimpleDialog ref={dialogRef}>
                <ImageGridView
                    onImageSelected={(str) => {
                        let num = parseInt(str)
                        setSelectedImageId(num)
                        dialogRef.current?.close()
                    }}
                />
            </SimpleDialog>
        </div>
    )
}
