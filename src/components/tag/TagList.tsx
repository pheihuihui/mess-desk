import React, { FC } from "react"

interface TagListProps {
    tags: string[]
    selected: number
}

export const TagList: FC<TagListProps> = (props) => {
    return (
        <ul className="tag-list">
            {props.tags.map((v, i) => (
                <li key={i}>
                    <span className={i == props.selected ? "tag-name tag-selected" : "tag-name tag-not-selected"}>{v}</span>
                </li>
            ))}
        </ul>
    )
}
