import React, { FC } from "react"
import { DashboardLayout } from "../components/_layout/DashboardLayout"
import { DetailedPortrait } from "../components/portrait/DetailedPortrait"

export const WelcomePage: FC = () => {
    return (
        <DashboardLayout>
            <DetailedPortrait />
        </DashboardLayout>
    )
}
