import React, { FC } from "react"
import { tabs } from "./_tabs"
import { useHashLocation } from "../utilities/hash_location"
import { Route, Router } from "../router"

export const AppRoutes: FC = () => {
    return (
        <Router hook={useHashLocation}>
            {Object.keys(tabs).map((t, i) => (
                <Route key={i} path={tabs[t].path}>
                    {tabs[t].page}
                </Route>
            ))}
        </Router>
    )
}
