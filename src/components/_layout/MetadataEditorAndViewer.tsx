import React, { FC, useEffect, useState } from "react"
import { IconCollection } from "../utilities/Icons"
import { PersonDate } from "../utilities/Date"

interface TitleProps {
    data?: string
    onSave: (data: string) => void
}

interface DescriptionProps {
    data?: string
    onSave: (data: string) => void
}

interface TimeRangeProps {
    from?: string
    to?: string
    onSave: (data: [string, string]) => void
}

const Title: FC<TitleProps> = (props) => {
    const [title, setTitle] = useState<string>(props.data ?? "")
    const [preTitle, setPreTitle] = useState<string>(props.data ?? "")
    const [isEditing, setIsEditing] = useState(false)
    const Editor = (
        <div className="title-editor">
            <div className="title-editor-buttons">
                <button
                    onClick={() => {
                        setTitle(preTitle)
                        setIsEditing(false)
                    }}
                >
                    <IconCollection.CancelIcon />
                </button>
                <button
                    onClick={() => {
                        setIsEditing(false)
                        props.onSave(title)
                    }}
                >
                    <IconCollection.CheckIcon />
                </button>
            </div>
            <input
                type="text"
                defaultValue={title}
                required={true}
                autoComplete="off"
                className="input-group-title"
                name="title"
                placeholder="Title..."
                onChange={(e) => {
                    setTitle(e.currentTarget.value)
                }}
            />
        </div>
    )
    const Viewer = (
        <div className="title-viewer">
            <div className="title-viewer-buttons">
                <button
                    onClick={() => {
                        setPreTitle(title)
                        setIsEditing(true)
                    }}
                >
                    <IconCollection.PenIcon />
                </button>
            </div>
            <h1>{title}</h1>
        </div>
    )
    return isEditing ? Editor : Viewer
}

const Description: FC<DescriptionProps> = (props) => {
    const [description, setDescription] = useState<string>(props.data ?? "")
    const [preDescription, setPreDescription] = useState<string>(props.data ?? "")
    const [isEditing, setIsEditing] = useState(false)
    const Editor = (
        <div className="description-editor">
            <div className="description-editor-buttons">
                <button
                    onClick={() => {
                        setDescription(preDescription)
                        setIsEditing(false)
                    }}
                >
                    <IconCollection.CancelIcon />
                </button>
                <button
                    onClick={() => {
                        setIsEditing(false)
                        props.onSave(description)
                    }}
                >
                    <IconCollection.CheckIcon />
                </button>
            </div>
            <textarea
                defaultValue={description}
                autoComplete="off"
                name="description"
                placeholder="Description..."
                rows={5}
                onChange={(e) => {
                    let val = e.currentTarget.value
                    setDescription(val)
                }}
            />
        </div>
    )
    const Viewer = (
        <div className="description-viewer">
            <div className="description-viewer-buttons">
                <button
                    onClick={() => {
                        setPreDescription(description)
                        setIsEditing(true)
                    }}
                >
                    <IconCollection.PenIcon />
                </button>
            </div>
            <h2>{description}</h2>
        </div>
    )
    return isEditing ? Editor : Viewer
}

const TimeRange: FC<TimeRangeProps> = (props) => {
    const [from, setFrom] = useState<string>(props.from ?? "")
    const [to, setTo] = useState<string>(props.to ?? "")
    const [preTimeRange, setPreTimeRange] = useState<[string, string]>([props.from ?? "", props.to ?? ""])
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        props.onSave([from, to])
    }, [from, to])

    const displayDate = (date: string) => {
        if (date == "unknown" || date == "not yet") {
            return "?"
        } else {
            return date
        }
    }

    const Editor = (
        <div className="time-range-editor">
            <div className="time-range-editor-buttons">
                <button
                    onClick={() => {
                        setFrom(preTimeRange[0])
                        setTo(preTimeRange[1])
                        setIsEditing(false)
                    }}
                >
                    <IconCollection.CancelIcon />
                </button>
                <button
                    onClick={() => {
                        setIsEditing(false)
                        props.onSave([from, to])
                    }}
                >
                    <IconCollection.CheckIcon />
                </button>
            </div>
            <div className="time-range-editor-inputs">
                <PersonDate
                    placeholder="Lived from"
                    name="lived-from"
                    onEdit={(data) => {
                        setFrom(data)
                    }}
                />
                <PersonDate
                    placeholder="Lived to"
                    name="lived-to"
                    onEdit={(data) => {
                        setTo(data)
                    }}
                />
            </div>
        </div>
    )
    const Viewer = (
        <div className="time-range-viewer">
            <div className="time-range-viewer-buttons">
                <button
                    onClick={() => {
                        setPreTimeRange([from, to])
                        setIsEditing(true)
                    }}
                >
                    <IconCollection.PenIcon />
                </button>
            </div>
            <h3>
                {displayDate(from)} - {displayDate(to)}
            </h3>
        </div>
    )
    return isEditing ? Editor : Viewer
}

export const MetadataEditorAndViewerParts = {
    Title: Title,
    Description: Description,
    TimeRange: TimeRange,
} satisfies Record<string, FC<any>>
