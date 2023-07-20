import React, { FC } from "react";
import { Paper } from "./Paper";

export const App: FC = () => {
    return <Paper markdown="# hello" />
}

export const _app = <App />