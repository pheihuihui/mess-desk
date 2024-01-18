import React, { FC, useState } from "react"
import { DashboardLayout } from "../components/_layout/DashboardLayout"

export const WelcomePage: FC = () => {
    const [selected, setSelected] = useState<string[]>([])

    return (
        <DashboardLayout>
            <h2>Welcome!</h2>
        </DashboardLayout>
    )
}
