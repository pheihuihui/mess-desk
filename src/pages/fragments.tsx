import React, { FC } from "react";
import { DashboardLayout } from "../components/layout/Layout";
import { PageThumbnail } from "../components/web_archiver/PageThumbnail";

export const FragmentsPage: FC = () => {
    return (
        <DashboardLayout>
            < PageThumbnail />
        </DashboardLayout>
    )
}