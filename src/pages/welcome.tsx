import React, { FC, useState } from "react"
import { DashboardLayout } from "../components/_layout/Layout"

export const WelcomePage: FC = () => {
    const [selected, setSelected] = useState<string[]>([])

    return (
        <DashboardLayout>
            <h2>Welcome!</h2>
        </DashboardLayout>
    )
}
