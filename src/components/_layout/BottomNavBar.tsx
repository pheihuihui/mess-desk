import React, { FC, useEffect, useState } from "react"
import { tabs } from "../../pages/_tabs"
import { useLocation } from "../../router"
import { BottomNavigation } from "./BottomNavigation"

export const BottomNavBar: FC = () => {
    const [location, setLocation] = useLocation()
    const [itemId, setItemId] = useState("home")

    useEffect(() => {
        for (const t in tabs) {
            if (tabs[t].path == location) {
                setItemId(t)
                break
            }
        }
    }, [location])

    return (
        <BottomNavigation
            onSelect={(_itemId) => {
                setTimeout(() => {
                    setLocation(tabs[_itemId].path)
                }, 200)
            }}
            activeItemId={itemId}
            items={Object.keys(tabs).map((t, i) => ({
                key: i,
                title: tabs[t].text,
                itemId: t,
                elemBefore: tabs[t].icon,
            }))}
        />
    )
}
