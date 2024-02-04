import React, { FC } from "react"
import { DashboardLayout } from "../components/_layout/DashboardLayout"
import { TextInput } from "../components/TextInput"

export const SettingsPage: FC = () => {
    return (
        <DashboardLayout>
            <TextInput label="Image API" settingKey="imageApi" />
            <TextInput label="Image API Key" settingKey="imageApiKey" />
        </DashboardLayout>
    )
}
