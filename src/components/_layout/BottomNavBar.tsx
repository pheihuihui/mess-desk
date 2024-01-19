import React, { FC } from "react"
import { useLocation, useNavigate } from "../../../node_modules/react-router-dom/dist/index"
import { BottomNav } from "./BottomNav"
import { tabs } from "../../pages/_tabs"

export const BottomNavBar: FC = () => {
    const history = useNavigate()
    const location = useLocation()

    return (
        <BottomNav
            onSelect={(itemId) => {
                setTimeout(() => {
                    history(itemId)
                }, 200)
            }}
            activeItemId={location.pathname}
            items={Object.keys(tabs).map((t, i) => ({
                key: i,
                title: tabs[t].text,
                itemId: t,
                elemBefore: tabs[t].icon,
            }))}
        />
    )
}
