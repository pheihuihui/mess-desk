import React, { ReactNode } from "react"
import { IconCollection } from "../components/utilities/Icons"
import { NotesPage } from "./notes"
import { PortraitsPage } from "./portraits"
import { WelcomePage } from "./welcome"
import { ImagePage } from "./image"
import { PodsPage } from "./pods"
import { SettingsPage } from "./settings"
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
        nest: true,
    },
    portraits: {
        text: "Portraits",
        path: "/portraits",
        page: <PortraitsPage />,
        nest: true,
    },
    pods: {
        text: "Pods",
        path: "/pods",
        page: <PodsPage />,
    },
    home: {
        text: "",
        path: "/home",
        page: <WelcomePage />,
        icon: <IconCollection.HomeIcon />,
        nest: true,
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
