import React, { FC } from "react"
import { DashboardLayout } from "../components/_layout/DashboardLayout"
import { ImageGridView } from "../components/image_gallery/ImageGridView"

export const WelcomePage: FC = () => {
    return (
        <DashboardLayout>
            <ImageGridView />
        </DashboardLayout>
    )
}
