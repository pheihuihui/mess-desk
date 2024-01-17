import { SideNavigation } from "./SideNavigation"
import React, { FC, useState } from "react"
import { SomeIcon } from "../Icon"
import { useLocation, useNavigate } from "../../../node_modules/react-router-dom/dist/index"
import { BottomNav } from "./BottomNav"

export const BottomNavBar: FC = () => {
    const history = useNavigate()
    const location = useLocation()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    return (
        <>
            <BottomNav
                activeItemId="notes"
                onSelect={(id) => console.log(id)}
                items={[
                    { title: "Home", itemId: "/" },
                    { title: "Notes", itemId: "/notes" },
                    { title: "Fragments", itemId: "/fragments" },
                    { title: "Portraits", itemId: "/portraits" },
                    { title: "Podcasts", itemId: "/pods" },
                    { title: "Images", itemId: "/new-image" },
                    { title: "Storage", itemId: "/storage", elemBefore: () => <SomeIcon /> },
                ]}
            />
        </>
    )
}
