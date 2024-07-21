import React, { FC, PropsWithChildren, useState } from "react"
import { BodyWrapper } from "./BodyWrapper"
import { BottomNavBar } from "./BottomNavigation"
import { NotificationContext, Notification } from "../utilities/Notification"

export const DashboardLayout: FC<PropsWithChildren> = (props) => {
    const [notification, setNotification] = useState(React.version)
    return (
        <BodyWrapper>
            <div className="wrapper-div">
                <NotificationContext.Provider value={{ message: notification, setMessage: setNotification }}>
                    <Notification />
                    <div className="wrapper-div-inner">{props.children}</div>
                </NotificationContext.Provider>
                <BottomNavBar />
            </div>
        </BodyWrapper>
    )
}
