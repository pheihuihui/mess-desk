import React, { FC } from "react"
import { tabs } from "../../pages/_tabs"
import { useLocation } from "../../router"
import { BottomNavigation } from "./BottomNavigation"

export const BottomNavBar: FC = () => {
    const [_, navigate] = useLocation()

    return (
        <BottomNavigation
            onSelect={(_itemId) => {
                setTimeout(() => {
                    navigate(tabs[_itemId].path)
                }, 200)
            }}
            items={Object.keys(tabs).map((t, i) => ({
                key: i,
                title: tabs[t].text,
                itemId: t,
                elemBefore: tabs[t].icon,
            }))}
        />
    )
}
