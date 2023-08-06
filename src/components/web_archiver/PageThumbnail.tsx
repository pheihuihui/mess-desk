import React, { FC } from "react"
import { useWindowSize } from "../../hooks"

export const PageThumbnail: FC = () => {

    const size = useWindowSize()

    return (
        <div className="overflow-hidden shadow-2xl rounded-2xl h-64 w-64">
            <div className="flex items-center pl-3 bg-gray-900 rounded-t-xl h-8">
                <span className="w-3 h-3 p-1 m-1 bg-white rounded-full"></span>
                <span className="w-3 h-3 p-1 m-1 bg-white rounded-full"></span>
                <span className="w-3 h-3 p-1 m-1 bg-white rounded-full"></span>
            </div>
            <div className="grid place-items-center h-[90%] bg-blue-300" >
                <img src="./assets/wiki-250.png" className="h-40 w-40 rounded-md" />
                xxxx
            </div>
        </div>
    )
}