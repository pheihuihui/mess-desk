import React, { FC, useRef } from "react"

import { TagRemovement } from "./TagRemovement"
import { TAGGING_CLASSNAMES } from "../../utilities/constants"

export interface Tag {
    id: string
    [key: string]: string
}

export interface SingleTagProps {
    labelField: string
    onDelete: (event: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLSpanElement>) => void
    tag: Tag
    removeComponent?: React.ComponentType<any>
    onTagClicked: (event: React.MouseEvent<HTMLSpanElement> | React.TouchEvent<HTMLSpanElement>) => void
    readOnly: boolean
    index: number
}

export const SingleTag: FC<SingleTagProps> = (props) => {
    const tagRef = useRef(null)
    const { readOnly = false, tag, index, labelField = "text" } = props

    const label = props.tag[props.labelField]
    const opacity = 1
    return (
        <span
            ref={tagRef}
            className={TAGGING_CLASSNAMES.TAG}
            style={{
                opacity,
                cursor: "auto",
            }}
            data-testid="tag"
            onClick={props.onTagClicked}
            onTouchStart={props.onTagClicked}
        >
            {label}
            <TagRemovement tag={props.tag} removeComponent={props.removeComponent} onRemove={props.onDelete} readOnly={readOnly} index={index} />
        </span>
    )
}
