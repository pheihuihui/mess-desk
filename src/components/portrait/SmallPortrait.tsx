import React, { FC, useEffect } from "react"
import { useIndexedDb } from "../../utilities/hooks"
import { useHashLocation } from "../../utilities/hash_location"
import { PORTRAIT_MISSING_IMAGE } from "../../utilities/constants"

export interface SmallPortraitProps {
    id: number
    onImgClicked?: () => void
}

export const SmallPortrait: FC<SmallPortraitProps> = (props) => {
    const personDb = useIndexedDb("STORE_PERSON")
    const [face, setFace] = React.useState<string | undefined>("")
    const [name, setName] = React.useState<string>("")
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
                src={face ?? PORTRAIT_MISSING_IMAGE}
                alt={name}
                title={name}
                onClick={(_) => {
                    navigate("/portraits/" + props.id.toString())
                }}
            />
        </div>
    )
}
