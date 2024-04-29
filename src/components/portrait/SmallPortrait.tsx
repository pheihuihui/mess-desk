import React, { FC } from "react"

export interface SmallPortraitProps {
    name: string
    img: string
    description: string
    onImgClicked: () => void
}

export const SmallPortrait: FC<SmallPortraitProps> = (props) => {
    return <div />
}
