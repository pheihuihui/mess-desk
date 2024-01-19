import React, { ReactNode } from "react"
import { HomeIcon } from "../components/Icon"
import { NotesPage } from "./notes"
import { FragmentsPage } from "./fragments"
import { PortraitsPage } from "./portraits"
import { WelcomePage } from "./welcome"
import { ImagePage } from "./image"
import { PodsPage } from "./pods"
import { StoragePage } from "./storage"

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
    "/fragments": {
        text: "Fragments",
        path: "fragments",
        page: <FragmentsPage />,
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
    "/storage": {
        text: "Storage",
        path: "storage",
        page: <StoragePage />,
    },
    "/new-image": {
        text: "New Image",
        path: "new-image",
        page: <ImagePage />,
    },
}
