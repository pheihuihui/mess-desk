import React, { FC, ReactNode, useState } from "react"
import { tabs } from "../../pages/_tabs"
import { useHashLocation } from "../../utilities/hash_location"

interface NavigationItemProps {
    index: number
    checked: boolean
    title: string
    itemId: string
    elemBefore?: ReactNode
    onclick?: () => void
}

interface SimpleNavigationItemProps {
    title: string
    itemId: string
    elemBefore?: ReactNode
}

interface BottomNavigationProps {
    items: SimpleNavigationItemProps[]
    onSelect?: (itemId: string) => void
}

const BottomNavigationItem: FC<NavigationItemProps> = (props) => {
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
                {props.elemBefore}
                {props.title}
            </label>
        </>
    )
}

const BottomNavigation: FC<BottomNavigationProps> = (props) => {
    const [location, _] = useHashLocation()
    const [activeItemId, setActiveItemId] = useState(() => {
        const activeTab = props.items.find((item) => tabs[item.itemId].path == location)
        return activeTab ? activeTab.itemId : props.items[0].itemId
    })

    return (
        <div className="tab-container">
            {props.items.map((item, index) => (
                <BottomNavigationItem
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

export const BottomNavBar: FC = () => {
    const [_, navigate] = useHashLocation()
    return (
        <BottomNavigation
            onSelect={(_itemId) => {
                console.log(_itemId)
                setTimeout(() => {
                    navigate(tabs[_itemId].path)
                }, 200)
            }}
            items={Object.keys(tabs).map((t, i) => ({
                key: i,
                title: tabs[t].text,
                itemId: t,
                elemBefore: tabs[t].icon,
            }))}
        />
    )
}
