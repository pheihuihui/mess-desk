import React, { FC, useEffect, useState } from "react"
import { useIndexedDb } from "../../utilities/hooks"
import { Link, useRoute } from "../../router"
import { MarkdownReader } from "./MarkdownReader"
import { IconCollection } from "../utilities/Icons"
import { navigate } from "../../utilities/hash_location"

interface NoteListProps {}
interface NoteListItemProps {
    id: number | string
    title: string
    tags: string[]
    persons: number[]
}

const NoteListItem: FC<NoteListItemProps> = (props) => {
    return (
        <div className="note-list-item">
            <IconCollection.Note />
            {/* @ts-ignore */}
            <Link href={`/${props.id}`}>{props.title}</Link>
        </div>
    )
}

const _NoteList: FC<NoteListProps> = (props) => {
    const notes_db = useIndexedDb("STORE_MARKDOWN")
    const [notes, setNotes] = useState<NoteListItemProps[]>([])
    useEffect(() => {
        notes_db.openCursor((event) => {
            let cursor = event.currentTarget?.result
            if (cursor) {
                if (cursor.value) {
                    let val = cursor.value
                    let cur: NoteListItemProps = {
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

    return (
        <div className="portrait-board acrylic">
            <NoteListItem key={0} id="new" title="New Item" tags={[]} persons={[]} />
            {notes.map((note, i) => (
                <NoteListItem key={i + 1} id={note.id} title={note.title} tags={note.tags} persons={[]} />
            ))}
        </div>
    )
}

export const NoteList: FC = () => {
    const [_, param] = useRoute("/:id")
    return param?.id ? <MarkdownReader id={param.id} /> : <_NoteList />
}
