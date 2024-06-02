import React, { FC } from "react"
import { DashboardLayout } from "../components/_layout/DashboardLayout"
import { ImageGridView } from "../components/image_gallery/ImageGridView"
import { MetadataEditorAndViewerParts } from "../components/_layout/MetadataEditorAndViewer"

export const WelcomePage: FC = () => {
    return (
        <DashboardLayout>
            <div style={{ height: "400px", width: "600px" }}>
                <MetadataEditorAndViewerParts.TimeRange from="1999" to="2099" onSave={(_) => {}} />
            </div>
        </DashboardLayout>
    )
}
