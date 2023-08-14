import React, { FC, useEffect, useState } from "react"

interface SimplePortraitProps {
    name: string
    img: string
    onImgClicked: () => void
}

export const SimplePortrait: FC<SimplePortraitProps> = props => {
    return (
        <div className="flex flex-col items-center pb-10">
            <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={props.img} title={props.name} onClick={props.onImgClicked} />
        </div>
    )
}