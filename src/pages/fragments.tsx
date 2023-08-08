import React, { FC } from "react";
import { DashboardLayout } from "../components/_layout/Layout";
import { PageThumbnailsGrid } from "../components/web_archiver/PageThumbnailsGrid";
import { Tweet } from "../components/web_archiver/Tweet";

export const FragmentsPage: FC = () => {
    return (
        <DashboardLayout>
            <Tweet tweetId="1688726495030636544" placeholder='loading' options={{
                width: 400,
                theme: 'dark'
            }} />
        </DashboardLayout>
    )
}