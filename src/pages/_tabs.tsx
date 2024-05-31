import React, { ReactNode } from "react"
import { IconCollection } from "../components/others/Icon"
import { NotesPage } from "./notes"
import { PortraitsPage } from "./portraits"
import { WelcomePage } from "./welcome"
import { ImagePage } from "./image"
import { PodsPage } from "./pods"
import { SettingsPage } from "./settings"
import { EditorPage } from "./editor"
import { ArchivePage } from "./archives"

interface TabProps {
    [itemId: string]: {
        icon?: ReactNode
        page: ReactNode
        text: string
        path: string
        nest?: boolean
    }
}

export const tabs: TabProps = {
    notes: {
        text: "Notes",
        path: "/notes",
        page: <NotesPage />,
    },
    editor: {
        text: "Editor",
        path: "/editor",
        page: <EditorPage />,
    },
    portraits: {
        text: "Portraits",
        path: "/portraits",
        page: <PortraitsPage />,
        nest: true,
    },
    home: {
        text: "",
        path: "/home",
        page: <WelcomePage />,
        icon: <IconCollection.HomeIcon />,
    },
    pods: {
        text: "Pods",
        path: "/pods",
        page: <PodsPage />,
    },
    images: {
        text: "Image Editor",
        path: "/image-editor",
        page: <ImagePage />,
        nest: true,
    },
    archive: {
        text: "New Page",
        path: "/new-page",
        page: <ArchivePage />,
    },
    settings: {
        text: "Settings",
        path: "/settings",
        page: <SettingsPage />,
    },
}
