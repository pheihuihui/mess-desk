import React, { FC, useEffect, useState } from "react"
import { useIndexedDb } from "../../utilities/hooks"
import { useHashLocation } from "../../utilities/hash_location"
import { LOADING_FACE } from "../../utilities/constants"

export interface SmallPortraitProps {
    id: number
    onImgClicked?: () => void
}

export const SmallPortrait: FC<SmallPortraitProps> = (props) => {
    const personDb = useIndexedDb("STORE_PERSON")
    const [face, setFace] = useState<string | undefined>(LOADING_FACE)
    const [name, setName] = useState<string>("")
    const [_, navigate] = useHashLocation()
    useEffect(() => {
        personDb.getByID(props.id).then((person) => {
            if (person) {
                setFace(person.face)
                setName(person.name)
            }
        })
    }, [])
    return (
        <div className="portrait-cell">
            <img
                className="small-portrait-img"
                src={face ?? LOADING_FACE}
                alt={name}
                title={name}
                onClick={(_) => {
                    navigate("/portraits/" + props.id.toString())
                }}
            />
        </div>
    )
}
