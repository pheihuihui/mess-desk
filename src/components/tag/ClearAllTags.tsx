import React from "react"

export const ClearAllTags = (props: {
    classNames: {
        clearAll: string
    }
    onClick: () => void
}) => {
    return (
        <button className={props.classNames.clearAll} onClick={props.onClick}>
            Clear all
        </button>
    )
}
