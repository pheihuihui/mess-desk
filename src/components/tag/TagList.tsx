import React, { FC } from "react"

interface TagListProps {
    onEnter?: (val: string) => void
    tags: string[]
    selected: number
}

export const TagList: FC<TagListProps> = (props) => {
    return (
        <ul className="list-outside overflow-y-scroll h-full">
            {props.tags.map((v, i) => (
                <li key={i}>
                    <span
                        className={`${i == props.selected ? "bg-green-500" : "bg-slate-300"} 
                        text-black text-xs font-medium mr-2 px-2.5 py-0.5 
                        rounded-full whitespace-nowrap overflow-hidden`}
                    >
                        {v}
                    </span>
                </li>
            ))}
        </ul>
    )
}
