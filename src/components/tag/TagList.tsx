import React, { FC, useCallback, useEffect, useRef, useState } from "react";

interface TagListProps {
    onEnter?: (val: string) => void
    tags: string[]
}

export const TagList: FC<TagListProps> = props => {

    const [selected, setSelected] = useState(0)
    const count = props.tags.length
    const handleUserKeyPress = useCallback((evt: KeyboardEvent) => {
        console.log(selected)
        if (evt.code == 'ArrowUp') {
            setSelected(selected - 1 >= 0 ? selected - 1 : 0)
        } else if (evt.code == 'ArrowDown') {
            setSelected(selected + 1 <= count - 1 ? selected + 1 : count - 1)
        }
    }, [selected])
    useEffect(() => {
        document.addEventListener('keydown', handleUserKeyPress)
        return () => {
            document.removeEventListener('keydown', handleUserKeyPress)
        }
    }, [handleUserKeyPress])

    return (
        <ul className="list-outside">
            {props.tags.map((v, i) => {
                if (i == selected) {
                    return <li key={i} className="text-red-500">{v}</li>
                } else {
                    return <li key={i} className="">{v}</li>
                }
            })}
        </ul>
    );
}