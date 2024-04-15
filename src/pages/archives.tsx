import React, { FC } from "react"
import { DashboardLayout } from "../components/_layout/DashboardLayout"
import { PageContainer } from "../components/web_archiver/PageContainer"
import { ArchiveEditor } from "../components/web_archiver/ArchiveEditor"

export const ArchivePage: FC = () => {
    return (
        <DashboardLayout>
            <ArchiveEditor />
        </DashboardLayout>
    )
}
