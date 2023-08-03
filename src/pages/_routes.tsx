import React, { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotesPage } from "./notes";
import { FragmentsPage } from "./fragments";
import { PortraitsPage } from "./portraits";
import { StoragePage } from "./storage";
import { PodsPage } from "./pods";

export const AppRoutes: FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/main" element={<NotesPage />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/fragments" element={<FragmentsPage />} />
                <Route path="/portraits" element={<PortraitsPage />} />
                <Route path="/pods" element={<PodsPage />} />
                <Route path="/storage" element={<StoragePage />} />
            </Routes>
        </BrowserRouter>
    );
};

