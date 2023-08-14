import React, { FC, useEffect, useState } from "react"
import { DBStorage } from "../../utilities/meta"
import { formatPeriod } from "../../utilities/utilities"

export interface DetailedPortraitProps {
    name: string
    birth: DBStorage.DateInfo
    death: DBStorage.DateInfo
    img: string
    description: string
    onImgClicked: () => void
}

export const DetailedPortrait: FC<DetailedPortraitProps> = props => {
    return (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <img className="rounded-t-lg" src={props.img} onClick={props.onImgClicked} />
            <div className="p-5">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
                    {props.name}
                </h5>
                <p className="mb-3 font-normal text-gray-200">
                    {formatPeriod(props.birth, props.death)}
                </p>
                <p className="mb-3 font-normal text-gray-400">
                    {props.description}
                </p>
            </div>
        </div>
    )
}