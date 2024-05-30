import React, { FC } from "react"
import { DetailedPortrait } from "./DetailedPortrait"
import { PortraitBoard } from "./PortraitBoard"
import { useRoute } from "../../router"

export const Portrait: FC = () => {
    const [_, param] = useRoute("/:id")
    return param?.id ? <DetailedPortrait personID={parseInt(param.id)} /> : <PortraitBoard />
}
