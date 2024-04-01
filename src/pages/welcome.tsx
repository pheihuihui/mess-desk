import React, { FC } from "react"
import { DashboardLayout } from "../components/_layout/DashboardLayout"
import { TagList } from "../components/tag/TagList"

export const WelcomePage: FC = () => {
    return (
        <DashboardLayout>
            <TagList
                tags={Array(20)
                    .fill(0)
                    .map((_, i) => `tag${i}`)}
                selected={4}
            />
        </DashboardLayout>
    )
}
