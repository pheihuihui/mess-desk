import React, { FC, PropsWithChildren } from "react"
import { BodyWrapper } from "./BodyWrapper"
import { BottomNavBar } from "./BottomNavigation"

export const DashboardLayout: FC<PropsWithChildren> = (props) => {
    return (
        <BodyWrapper>
            <div className="wrapper-div">
                <div className="wrapper-div-inner">{props.children}</div>
                <BottomNavBar />
            </div>
        </BodyWrapper>
    )
}
