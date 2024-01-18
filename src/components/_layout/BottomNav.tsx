import React, { FC, useState } from "react"

interface NavItemProps {
    index: number
    checked: boolean
    title: string
    itemId: string
    elemBefore?: () => JSX.Element
    onclick?: () => void
}

interface SimpleNavItemProps {
    title: string
    itemId: string
    elemBefore?: () => JSX.Element
}

interface BottomNavProps {
    items: SimpleNavItemProps[]
    activeItemId: string
    onSelect?: (itemId: string) => void
}

export const BottomNavItem: FC<NavItemProps> = (props) => {
    return (
        <>
            <input
                type="radio"
                name="tab"
                id={`tab${props.index}`}
                className={`tab tab--${props.index}`}
                onClick={props.onclick}
                checked={props.checked}
                onChange={() => {}}
            />
            <label className="tab_label" htmlFor={`tab${props.index}`}>
                {props.elemBefore && props.elemBefore()}
                {props.title}
            </label>
        </>
    )
}

export const BottomNav: FC<BottomNavProps> = (props) => {
    const [activeItemId, setActiveItemId] = useState(props.activeItemId)

    return (
        <div className="tab-container">
            {props.items.map((item, index) => (
                <BottomNavItem
                    key={index}
                    index={index}
                    checked={item.itemId == activeItemId}
                    {...item}
                    onclick={() => {
                        if (item.itemId != activeItemId) {
                            setActiveItemId(item.itemId)
                            props.onSelect && props.onSelect(item.itemId)
                        }
                    }}
                />
            ))}
            <div className="indicator"></div>
        </div>
    )
}
