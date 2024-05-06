import React, { useRef } from "react"

import { RemoveComponent } from "./RemoveComponent"

const ItemTypes = { TAG: "tag" }

export interface Tag {
    id: string
    className: string
    [key: string]: string
}

export interface TagProps {
    labelField: string
    onDelete: (event: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLSpanElement>) => void
    tag: Tag
    removeComponent?: React.ComponentType<any>
    onTagClicked: (event: React.MouseEvent<HTMLSpanElement> | React.TouchEvent<HTMLSpanElement>) => void
    classNames: {
        tag: string
        remove: string
    }
    readOnly: boolean
    index: number
}

export const SingleTag = (props: TagProps) => {
    const tagRef = useRef(null)
    const { readOnly = false, tag, classNames, index, labelField = "text" } = props

    const label = props.tag[props.labelField]
    const { className = "" } = tag
    /* istanbul ignore next */
    const opacity = 1
    return (
        <span
            ref={tagRef}
            className=""
            style={{
                opacity,
                cursor: "auto",
            }}
            data-testid="tag"
            onClick={props.onTagClicked}
            onTouchStart={props.onTagClicked}
        >
            {label}
            <RemoveComponent
                tag={props.tag}
                className={classNames.remove}
                removeComponent={props.removeComponent}
                onRemove={props.onDelete}
                readOnly={readOnly}
                index={index}
            />
        </span>
    )
}
