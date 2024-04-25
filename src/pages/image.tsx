import React, { FC } from "react"
import { DashboardLayout } from "../components/_layout/DashboardLayout"
import { ImageEditor } from "../components/image_gallery/ImageEditor"

export const ImagePage: FC = () => {
    return (
        <DashboardLayout>
            <ImageEditor />
        </DashboardLayout>
    )
}
