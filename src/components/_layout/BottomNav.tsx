import React, { FC, PropsWithChildren } from "react"

interface NavItemProps {
    index: number
    title: string
    itemId: string
    elemBefore?: () => JSX.Element
}

export const BottomNavItem: FC<NavItemProps> = (props) => {
    return (
        <>
            <input type="radio" name="tab" id={`tab${props.index}`} className={`tab tab--${props.index}`} />
            <label className="tab_label" htmlFor={`tab${props.index}`}>
                {props.elemBefore && props.elemBefore()}
                {props.title}
            </label>
        </>
    )
}

export const BottomNav: FC<{ items: NavItemProps[] }> = (props) => {
    return (
        <div className="tab-container">
            {props.items.map((item) => (
                <BottomNavItem {...item} />
            ))}
            <div className="indicator"></div>
        </div>
    )
}
