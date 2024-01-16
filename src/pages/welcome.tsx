import React, { FC, useState } from "react"
import { DashboardLayout } from "../components/_layout/Layout"
import { BottomNav, BottomNavItem } from "../components/_layout/BottomNav"
import { SomeIcon } from "../components/Icon"

export const WelcomePage: FC = () => {
    const [selected, setSelected] = useState<string[]>([])

    return (
        <DashboardLayout>
            <h2>Welcome!</h2>
            <BottomNav
                items={[
                    { index: 0, title: "Home", itemId: "/" },
                    { index: 1, title: "Notes", itemId: "/notes" },
                    { index: 2, title: "Fragments", itemId: "/fragments" },
                    { index: 3, title: "Portraits", itemId: "/portraits" },
                    { index: 4, title: "Podcasts", itemId: "/pods" },
                    { index: 5, title: "Images", itemId: "/new-image" },
                    { index: 6, title: "Storage", itemId: "/storage", elemBefore: () => <SomeIcon /> },
                ]}
            />
        </DashboardLayout>
    )
}
