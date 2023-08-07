import React, { FC, PropsWithChildren } from "react";

import { NavSidebar } from "./NavSidebar";
import { BodyWrapper } from "./BodyWrapper";

export const DashboardLayout: FC<PropsWithChildren> = props => {
    return (
        <BodyWrapper>
            <div className="flex h-screen bg-gray-200">
                <NavSidebar />
                <div className="bg-cyan-700 grid h-screen place-items-center w-[100%]">
                    {props.children}
                </div>
            </div>
        </BodyWrapper>
    );
};
