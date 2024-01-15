// https://github.com/abhijithvijayan/react-minimal-side-navigation/blob/main/source/side-nav.tsx

import React, { FC, useEffect, useState } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "../Icon"

export type NavItemProps = {
    title: string
    itemId: string
    elemBefore?: FC<unknown>
    subNav?: NavItemProps[]
}

export type SideNavProps = {
    items: NavItemProps[]
    activeItemId: string
    onSelect?: ({ itemId }: { itemId: string }) => void
}

export const SideNavigation: FC<SideNavProps> = (props) => {
    const [activeSubNav, setActiveSubNav] = useState({
        expanded: true,
        selectedId: props.activeItemId,
    })

    useEffect(() => {
        setActiveSubNav((originalSubNav) => ({
            expanded: originalSubNav.expanded,
            selectedId: props.activeItemId,
        }))
    }, [props.activeItemId])

    function handleClick(itemId: string): void {
        props.onSelect?.({ itemId })
    }

    function handleSubNavExpand(item: NavItemProps): void {
        if (activeSubNav.expanded) {
            const currentItemOrSubNavItemIsOpen: boolean =
                item.itemId == activeSubNav.selectedId ||
                (item.subNav && item.subNav.some((_subNavItem) => _subNavItem.itemId == activeSubNav.selectedId)) ||
                false

            setActiveSubNav({
                expanded: item.subNav && item.subNav.length > 0 ? !currentItemOrSubNavItemIsOpen : false,
                selectedId: item.itemId,
            })
        } else {
            setActiveSubNav({
                expanded: !!(item.subNav && item.subNav.length > 0),
                selectedId: item.itemId,
            })
        }
    }

    return (
        <>
            {props.items.length > 0 && (
                <nav role="navigation" aria-label="side-navigation" className="border-red-500 box-border border-solid border-0">
                    {props.items.map((item) => {
                        const ElemBefore = item.elemBefore
                        const isItemSelected = item.itemId == activeSubNav.selectedId
                        const isActiveTab =
                            activeSubNav.expanded &&
                            (isItemSelected ||
                                (item.subNav && item.subNav.some((_subNavItem: NavItemProps) => _subNavItem.itemId == activeSubNav.selectedId)) ||
                                false)

                        return (
                            <ul key={item.itemId} className="m-0 p-0 list-none">
                                <li className="side-navigation-panel-select-wrap">
                                    <div
                                        onClick={(): void => {
                                            handleSubNavExpand(item)
                                            handleClick(item.itemId)
                                        }}
                                        className="flex items-center justify-between w-full px-6 py-3 text-gray-700 border-l-2 cursor-pointer"
                                    >
                                        <span className="flex items-center">
                                            {/** Prefix Icon Component */}
                                            {ElemBefore && <ElemBefore />}

                                            <span className="mx-4 font-medium">{item.title}</span>
                                        </span>

                                        {item.subNav && item.subNav.length > 0 && (isActiveTab ? <ChevronUpIcon /> : <ChevronDownIcon />)}
                                    </div>
                                </li>

                                {item.subNav && item.subNav.length > 0 && isActiveTab && (
                                    <ul className="side-navigation-panel-select-inner">
                                        {item.subNav.map((subNavItem) => {
                                            const SubItemElemBefore = subNavItem.elemBefore

                                            return (
                                                <li key={subNavItem.itemId} className="side-navigation-panel-select-inner-wrap">
                                                    <div
                                                        onClick={() => {
                                                            setActiveSubNav({ ...activeSubNav, selectedId: subNavItem.itemId })
                                                            handleClick(subNavItem.itemId)
                                                        }}
                                                        className="flex items-center justify-between px-16 py-2 border-l-2 cursor-pointer text-gray-700"
                                                    >
                                                        <span className="flex items-center">
                                                            {/** Prefix Icon Component */}
                                                            {SubItemElemBefore && <SubItemElemBefore />}
                                                            <span className="mx-3 text-sm">{subNavItem.title}</span>
                                                        </span>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}
                            </ul>
                        )
                    })}
                </nav>
            )}
        </>
    )
}
