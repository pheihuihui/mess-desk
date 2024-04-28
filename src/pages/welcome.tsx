import React, { FC } from "react"
import { DashboardLayout } from "../components/_layout/DashboardLayout"
import { MarkdownReader } from "../components/reader/MarkdownReader"

export const WelcomePage: FC = () => {
    return (
        <DashboardLayout>
            <MarkdownReader id={10} />
        </DashboardLayout>
    )
}
