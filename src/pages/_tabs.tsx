import React, { ReactNode } from "react"
import { HomeIcon } from "../components/Icon"
import { NotesPage } from "./notes"
import { PortraitsPage } from "./portraits"
import { WelcomePage } from "./welcome"
import { ImagePage } from "./image"
import { PodsPage } from "./pods"
import { SettingsPage } from "./settings"
import { EditorPage } from "./editor"

interface TabProps {
    [itemId: string]: {
        icon?: ReactNode
        page: ReactNode
        text: string
        path: string
    }
}

export const tabs: TabProps = {
    "/notes": {
        text: "Notes",
        path: "notes",
        page: <NotesPage />,
    },
    "/editor": {
        text: "Editor",
        path: "editor",
        page: <EditorPage />,
    },
    "/portraits": {
        text: "Portraits",
        path: "portraits",
        page: <PortraitsPage />,
    },
    "/": {
        text: "",
        path: "/",
        page: <WelcomePage />,
        icon: <HomeIcon />,
    },
    "/pods": {
        text: "Pods",
        path: "pods",
        page: <PodsPage />,
    },
    "/new-image": {
        text: "New Image",
        path: "new-image",
        page: <ImagePage />,
    },
    "/settings": {
        text: "Settings",
        path: "Settings",
        page: <SettingsPage />,
    },
}
