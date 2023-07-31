import React, { FC, useState } from "react";

export const Tweet: FC = () => {

    const [html, setHtml] = useState<string>()

    return (
        <div>
            <textarea onChange={e => {
                setHtml(e.target.value)
            }} />
            <div className="overflow-hidden shadow-xl rounded-xl " style={{ transformOrigin: 'right center' }}>
                <div className="flex items-center pl-3 space-x-1 bg-gray-200 rounded-t-xl h-7">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                </div>
                <div className="rounded-b-xl align-middle h-[calc(100vh_-_10.75rem)]" dangerouslySetInnerHTML={{ __html: html ?? "" }} />
            </div>
        </div>
    )
}