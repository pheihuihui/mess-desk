import React, { FC, useEffect, useState } from "react"
import { useIndexedDb } from "../../utilities/hooks"

interface NoteListProps {}
interface NoteBasicInfo {
    id: number | string
    title: string
    tags: string[]
    persons: number[]
}

export const NoteList: FC<NoteListProps> = (props) => {
    const notes_db = useIndexedDb("STORE_MARKDOWN")
    const [notes, setNotes] = useState<NoteBasicInfo[]>([])
    useEffect(() => {
        notes_db.openCursor((event) => {
            let cursor = event.currentTarget?.result
            if (cursor) {
                if (cursor.value) {
                    let val = cursor.value
                    let cur: NoteBasicInfo = {
                        id: val.id,
                        title: val.title,
                        tags: val.tags,
                        persons: val.relatedPersons,
                    }
                    setNotes((prev) => [...prev, cur])
                    cursor.continue()
                }
            }
        })
    }, [])

    return <div className="portrait-board acrylic"></div>
}
