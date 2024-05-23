import React, { FC, PropsWithChildren } from "react"
import { useBackgroundImage } from "../../utilities/hooks"

const BackgroundImage: FC<{ dataUrl?: string }> = (props) => {
    const layer = <div className="background-layer" style={{ backgroundImage: `url("${props.dataUrl}")` }} />
    const nlayer = <div className="background-layer" />
    return props.dataUrl ? layer : nlayer
}

export const BodyWrapper: FC<PropsWithChildren> = (props) => {
    const [image, _] = useBackgroundImage()
    return (
        <div className="app-div">
            <BackgroundImage dataUrl={image} />
            <main className="app-main">{props.children}</main>
        </div>
    )
}
