import React, { FC } from "react"
import { DashboardLayout } from "../components/_layout/Layout"
import { PodPlayer } from "../components/player/PodPlayer"

export const PodsPage: FC = () => {
    return (
        <DashboardLayout>
            <PodPlayer
                src="https://r.typlog.com/eyJzIjo1NSwiZSI6NDk0MDksInAiOjIsInUiOiIwNzEzLm1wMyJ9.0aBc0jE2x9lyjwntR5jQ_1LOc-M/yitianshijie/8364496282_460713.mp3"
                volume={100}
                title="pods"
                controls={true}
            />
        </DashboardLayout>
    )
}
