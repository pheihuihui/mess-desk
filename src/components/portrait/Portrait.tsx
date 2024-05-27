import React, { FC } from "react"
import { DetailedPortrait } from "./DetailedPortrait"

interface PortraitProps {
    personID: string
    mode: "small" | "medium" | "detailed"
}

export const Portrait: FC<PortraitProps> = (props) => {
    return props.mode == "detailed" ? <DetailedPortrait personID={props.personID} /> : <div />
}
