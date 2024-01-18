import React, { FC, useEffect, useState } from "react"
import { HomeIcon } from "../Icon"
import { useLocation, useNavigate } from "../../../node_modules/react-router-dom/dist/index"
import { BottomNav } from "./BottomNav"

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
            items={[
                { title: "Notes", itemId: "/notes" },
                { title: "Fragments", itemId: "/fragments" },
                { title: "Portraits", itemId: "/portraits" },

                { title: "", itemId: "/", elemBefore: () => <HomeIcon /> },

                { title: "Podcasts", itemId: "/pods" },
                { title: "Images", itemId: "/new-image" },
                { title: "Storage", itemId: "/storage" },
            ]}
        />
    )
}
