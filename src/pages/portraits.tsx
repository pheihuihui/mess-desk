import React, { FC } from "react";
import { DashboardLayout } from "../components/_layout/Layout";
import { DetailedPortraits } from "../components/portrait/DetailedPortrait";
import { SimplePortrait } from "../components/portrait/SimplePortrait";

export const PortraitsPage: FC = () => {
    return (
        <DashboardLayout>
            <SimplePortrait personID="aaa" />
        </DashboardLayout>
    )
}