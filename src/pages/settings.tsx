import React, { FC } from "react"
import { DashboardLayout } from "../components/_layout/DashboardLayout"
import { useLocalStorage } from "../hooks"

interface SettingItemProps {
    label: string
    content: string
    onChange: (val: string) => void
}
const SettingItem: FC<SettingItemProps> = (props) => {
    return (
        <>
            <label className="label">{props.label}</label>
            <input
                autoComplete="off"
                name={props.label}
                id={props.label}
                className="input"
                type="text"
                onChange={(e) => props.onChange(e.target.value)}
                defaultValue={props.content}
            />
        </>
    )
}

export const SettingsPage: FC = () => {
    const [prismApiAddr, savePrismApiAddr] = useLocalStorage("LOCAL_STORAGE_IMAGE_API_ADDR", "")
    const [prismSessionId, savePrismSessionId] = useLocalStorage("LOCAL_STORAGE_IMAGE_API_SESSION_ID", "")
    return (
        <DashboardLayout>
            <div className="settings-group">
                <SettingItem label="PhotoPrism API Address" onChange={savePrismApiAddr} content={prismApiAddr} />
                <SettingItem label="PhotoPrism Session ID" onChange={savePrismSessionId} content={prismSessionId} />
            </div>
        </DashboardLayout>
    )
}
