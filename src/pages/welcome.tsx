import React, { FC, useState } from "react"
import { DashboardLayout } from "../components/_layout/Layout"
import { TagsInput } from "../components/tag/TagsInput"
import { BottomNav } from "../components/_layout/BottomNav"

export const WelcomePage: FC = () => {
    const [selected, setSelected] = useState<string[]>([])

    return (
        <DashboardLayout>
            <h2>Welcome!</h2>
            {/* <TagsInput value={selected} onChange={setSelected} name="fruits" placeHolder="enter fruits" /> */}
            <BottomNav />
        </DashboardLayout>
    )
}
