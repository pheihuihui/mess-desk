import React, { FC } from "react";
import { DashboardLayout } from "../components/layout/Layout";
import { PageThumbnailsGrid } from "../components/web_archiver/PageThumbnailsGrid";

export const FragmentsPage: FC = () => {
    return (
        <DashboardLayout>
            <PageThumbnailsGrid />
        </DashboardLayout>
    )
}