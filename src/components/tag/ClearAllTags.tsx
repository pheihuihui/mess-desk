import React, { FC } from "react"
import { TAGGING_CLASSNAMES } from "../../utilities/constants"

export const ClearAllTags: FC<{ onClick: () => void }> = (props) => {
    return (
        <button className={TAGGING_CLASSNAMES.CLEAR_ALL} onClick={props.onClick}>
            Clear all
        </button>
    )
}
