import React, { FC } from "react"
import { DashboardLayout } from "../components/_layout/DashboardLayout"
import { ImageGridView } from "../components/ImageGridView"

export const WelcomePage: FC = () => {
    return (
        <DashboardLayout>
            <ImageGridView />
        </DashboardLayout>
    )
}
