import React, { FC, useEffect, useState } from "react"

export const AllTags: FC = () => {
    const [tags, setTags] = useState<string[]>([])

    useEffect(() => {
        let str = localStorage.getItem("savedTags")
        if (str) {
            let arr = JSON.parse(str)
            setTags(arr)
        }
    }, [])

    return (
        <div className="tagging-card">
            <span className="title">all tags</span>
            <div className="card-tags">
                <ul className="tag">
                    {tags.map((v, i) => (
                        <li key={i} className="tag-name">
                            {v}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
