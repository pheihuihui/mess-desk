import React, { FC } from "react"
import { DashboardLayout } from "../components/_layout/DashboardLayout"
import { NoteList } from "../components/reader/NoteList"
import { ImageGridView } from "../components/image_gallery/ImageGridView"

export const WelcomePage: FC = () => {
    return (
        <DashboardLayout>
            <NoteList />
        </DashboardLayout>
    )
}
