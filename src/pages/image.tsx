import React, { FC } from "react"
import { DashboardLayout } from "../components/_layout/DashboardLayout"
import { NewImage } from "../components/NewImage"

export const ImagePage: FC = () => {
    return (
        <DashboardLayout>
            <NewImage />
        </DashboardLayout>
    )
}
