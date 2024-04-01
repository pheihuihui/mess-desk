import React, { FC } from "react"
import { DashboardLayout } from "../components/_layout/DashboardLayout"
import { MarkdownReader } from "../components/reader/MarkdownReader"

export const EditorPage: FC = () => {
    return (
        <DashboardLayout>
            <MarkdownReader id={0} />
        </DashboardLayout>
    )
}
