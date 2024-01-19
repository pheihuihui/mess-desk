import React, { FC } from "react"
import { HashRouter } from "../../node_modules/react-router-dom/dist/index"
import { Routes, Route } from "../../node_modules/react-router/dist/index"
import { tabs } from "./_tabs"

export const AppRoutes: FC = () => {
    return (
        <HashRouter>
            <Routes>
                {Object.keys(tabs).map((t, i) => (
                    <Route key={i} path={tabs[t].path} element={tabs[t].page} />
                ))}
            </Routes>
        </HashRouter>
    )
}
