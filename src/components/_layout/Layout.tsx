import React, { FC, PropsWithChildren } from "react"
import { BodyWrapper } from "./BodyWrapper"
import { BottomNavBar } from "./BottomNavBar"

export const DashboardLayout: FC<PropsWithChildren> = (props) => {
    return (
        <BodyWrapper>
            <div className="">
                <div className="bg-cyan-700 grid h-screen place-items-center w-[100%]">{props.children}</div>
                <BottomNavBar />
            </div>
        </BodyWrapper>
    )
}
