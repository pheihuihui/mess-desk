import React, { FC } from "react";
import { Paper } from "./Paper";
import { Editor } from './Editor'
import { PageContainer } from './PageContainer'
import { FileSelect } from "./FileSelect";

export const App: FC = () => {
    return (
        <div>
            <FileSelect />
            <PageContainer />
        </div>
    )
}

export const _app = <App />