import { SideNavigation } from "./SideNavigation";
import { useNavigate, useLocation } from "react-router-dom";
import React, { FC, useState } from "react";
import { SomeIcon } from "../Icon";

export const NavSidebar: FC = () => {
    const history = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <>
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 ease-out transform translate-x-0 bg-white border-r-2 lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? "ease-out translate-x-0" : "ease-in -translate-x-full"}`}
            >
                <div className="flex items-center justify-center mt-10 text-center py-6">
                    <span className="mx-2 text-2xl font-semibold text-black">
                        Desq Web App
                    </span>
                </div>

                <SideNavigation
                    activeItemId={location.pathname}
                    onSelect={({ itemId }) => {
                        history(itemId);
                    }}
                    items={[
                        { title: "Home", itemId: "/" },
                        { title: "Notes", itemId: "/notes" },
                        { title: "Fragments", itemId: "/fragments" },
                        { title: "Portraits", itemId: "/portraits" },
                        { title: "Podcasts", itemId: "/pods" }
                    ]}
                />

                <div className="absolute bottom-0 w-full my-8">
                    <SideNavigation
                        activeItemId={location.pathname}
                        items={[
                            { title: "Storage", itemId: "/storage", elemBefore: () => <SomeIcon /> }
                        ]}
                        onSelect={({ itemId }) => {
                            history(itemId);
                        }}
                    />
                </div>
            </div>
        </>
    );
};
