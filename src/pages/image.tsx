import React, { FC, useEffect, useState } from "react";
import { DashboardLayout } from "../components/_layout/Layout";

export const ImagePage: FC = () => {

    const [dataUrl, setDataUrl] = useState<string | null>(null)
    useEffect(() => {
        navigator.clipboard.readText()
            .then(txt => {
                if (txt.startsWith('data:image')) {
                    setDataUrl(txt)
                }
            })
    }, [])

    return (
        <DashboardLayout>
            {dataUrl ? <img src={dataUrl} /> : <h2>no images</h2>}
        </DashboardLayout>
    )
}