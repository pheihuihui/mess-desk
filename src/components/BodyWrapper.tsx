import React, { FC, PropsWithChildren } from 'react';

export const BodyWrapper: FC<PropsWithChildren> = props => {
    return (
        <div className="relative min-h-screen">
            <main className="w-full min-h-screen">{props.children}</main>
        </div>
    );
};
