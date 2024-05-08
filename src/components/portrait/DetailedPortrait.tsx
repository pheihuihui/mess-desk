import React, { FC, useEffect, useRef, useState } from "react"
import { _blobToBase64 } from "../../utilities/utilities"
import { TPersonDate, useIndexedDb } from "../../utilities/hooks"
import { LOADING_IMAGE } from "../../utilities/constants"
import { useHashLocation } from "../../utilities/hash_location"
import { useRoute } from "../../router"
import { SimpleDialog } from "../others/SimpleDialog"
import { ImageGridView } from "../image_gallery/ImageGridView"
import { StyledCheckbox } from "../others/StyledCheckbox"
import { Dropdown } from "../others/Dropdown"
import { Circle } from "../others/Circle"

export const DetailedPortrait: FC = () => {
    const [_location, navigate] = useHashLocation()
    const [_, param] = useRoute("/:id")
    const [name, setName] = useState("")
    const [selectedImageId, setSelectedImageId] = useState(-1)
    const [description, setDescription] = useState("")
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const dialogRef = useRef<HTMLDialogElement>(null)
    const db_person = useIndexedDb("STORE_PERSON")
    const db_image = useIndexedDb("STORE_IMAGE")
    const [bornOn, setBornOn] = useState("")
    const [diedOn, setDiedOn] = useState("")
    const [headX, setHeadX] = useState(0)
    const [headY, setHeadY] = useState(0)
    const [headD, setHeadD] = useState(0)
    const allPersonType = ["real", "avatar", "fictional"]
    const [personType, setPersonType] = useState(allPersonType[0])

    useEffect(() => {
        const setImage = async () => {
            let image = await db_image.getByID(selectedImageId)
            if (image && imgRef.current) {
                imgRef.current.src = image.base64 ?? ""
            }
        }
        setImage()
    }, [selectedImageId])

    async function savePersonDetails(name: string, description: string, tags: string[], imageId: number) {
        let person = await db_person.getByID(imageId)
        if (person) {
            person.name = name
            person.description = description
            await db_person.update(person)
        }
    }

    return (
        <div className="image-editor">
            <div className="image-editor-column-left">
                <div className="image-editor-portrait">
                    <img ref={imgRef} src={LOADING_IMAGE} />
                    <Circle
                        onMoveAndResize={(x, y, d) => {
                            setHeadD(d)
                            setHeadX(x)
                            setHeadY(y)
                        }}
                    />
                </div>
            </div>
            <div className="image-editor-column-right">
                <div className="image-editor-column-right-button-group">
                    <button className="image-editor-compress-button text-button" onClick={(_) => {}}>
                        Edit Profile Image
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
                    <button className="image-editor-save-button text-button" onClick={(_) => {}}>
                        Save
                    </button>
                    <button
                        className="image-editor-exit-button text-button"
                        onClick={(_) => {
                            console.log(headD, headX, headY)
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
                    <PersonDate placeholder="Born on..." name="bornOn" onEdit={setBornOn} />
                    <PersonDate placeholder="Died on..." name="diedOn" onEdit={setDiedOn} />
                    <Dropdown options={allPersonType} onSelected={setPersonType} />
                </div>
                <canvas ref={canvasRef} className="image-editor-preview-canvas" />
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

interface PersonDateProps {
    placeholder: string
    name: string
    onEdit: (date: TPersonDate) => void
}

const PersonDate: FC<PersonDateProps> = (props) => {
    const [date, setDate] = useState("")
    const [unknown, setUnknown] = useState(false)
    const [notYet, setNotYet] = useState(false)

    function getDate(): TPersonDate {
        if (unknown) {
            return "unknown"
        } else if (notYet) {
            return "not yet"
        } else {
            // @ts-ignore
            return date
        }
    }

    useEffect(() => {
        props.onEdit(getDate())
    }, [date, unknown, notYet])

    return (
        <div className="person-date">
            <input
                type="text"
                required={true}
                disabled={unknown || notYet}
                autoComplete="off"
                className="person-date-input"
                name={props.name}
                placeholder={props.placeholder}
                onChange={(e) => {
                    setDate(e.currentTarget.value)
                }}
            />
            <StyledCheckbox
                label="unknown"
                checked={unknown}
                onChange={(b) => {
                    setUnknown(b)
                    setNotYet(false)
                }}
            />
            <StyledCheckbox
                label="not yet"
                checked={notYet}
                onChange={(b) => {
                    setNotYet(b)
                    setUnknown(false)
                }}
            />
        </div>
    )
}
