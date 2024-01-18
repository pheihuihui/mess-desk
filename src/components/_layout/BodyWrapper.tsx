import React, { FC, PropsWithChildren } from "react"

export const BodyWrapper: FC<PropsWithChildren> = (props) => {
    return (
        <div className="app-div">
            <main className="app-main">{props.children}</main>
        </div>
    )
}
