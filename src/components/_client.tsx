import React, { FC } from "react";
import { SideNavigation } from './SideNavigation'

export const App: FC = () =>
    <SideNavigation items={[
        { title: "Notes", itemId: "notes" },
        { title: "Fragments", itemId: "fragments" },
        { title: "Portrait", itemId: "portrait" },
        { title: "Storage", itemId: "storage" }
    ]} activeItemId="notes" />

export const _app = <App />