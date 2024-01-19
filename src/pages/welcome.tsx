import React, { FC } from "react"
import { DashboardLayout } from "../components/_layout/DashboardLayout"
import { AllTags } from "../components/tag/AllTags"

export const WelcomePage: FC = () => {
    return (
        <DashboardLayout>
            <AllTags />
        </DashboardLayout>
    )
}
