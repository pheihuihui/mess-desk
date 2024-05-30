import React, { FC, useEffect, useState } from "react"
import { useIndexedDb } from "../../utilities/hooks"
import { SmallPortrait } from "./SmallPortrait"

interface PortraitBoardProps {
    columnCount?: number
    displayNames?: boolean
}

export const PortraitBoard: FC<PortraitBoardProps> = (props) => {
    const person_db = useIndexedDb("STORE_PERSON")
    const [personsArr, setPersonsArr] = useState<number[]>([])
    useEffect(() => {
        person_db.openCursor((event) => {
            // @ts-ignore
            let cursor = event.currentTarget.result
            if (cursor) {
                if (cursor.value) {
                    setPersonsArr((prev) => [...prev, cursor.value.id])
                    cursor.continue()
                }
            }
        })
    }, [])
    return (
        <div className="portrait-board acrylic">
            {personsArr.map((id) => (
                <SmallPortrait key={id} id={id} />
            ))}
        </div>
    )
}
