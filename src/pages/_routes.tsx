import React, { FC } from "react"
import { tabs } from "./_tabs"
import { useHashLocation } from "../utilities/hash_location"
import { Redirect, Route, Router } from "../router"

export const AppRoutes: FC = () => {
    return (
        <Router hook={useHashLocation}>
            {Object.keys(tabs).map((t, i) => (
                <Route key={i} path={tabs[t].path} nest>
                    {tabs[t].page}
                </Route>
            ))}
            <Route path="/">
                <Redirect to="/home" />
            </Route>
        </Router>
    )
}
