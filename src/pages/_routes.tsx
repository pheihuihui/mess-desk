import React, { FC } from "react"
import { tabs } from "./_tabs"
import { useHashLocation } from "../utilities/hash_location"
import { Redirect, Route, Router } from "../router"

export const AppRoutes: FC = () => {
    return (
        <Router hook={useHashLocation}>
            {Object.keys(tabs).map((t, i) =>
                tabs[t].nest ? (
                    <Route key={i} path={tabs[t].path} nest>
                        {tabs[t].page}
                    </Route>
                ) : (
                    <Route key={i} path={tabs[t].path}>
                        {tabs[t].page}
                    </Route>
                ),
            )}
            <Route path="/">
                <Redirect to="/home" />
            </Route>
        </Router>
    )
}
