import React, { FC } from "react"
import { DashboardLayout } from "../components/_layout/DashboardLayout"
import { ImageGridView } from "../components/ImageGridView"
import { ImageEditor } from "../components/ImageEditor"

export const WelcomePage: FC = () => {
    return (
        <DashboardLayout>
            <ImageEditor imageId={3} />
        </DashboardLayout>
    )
}
