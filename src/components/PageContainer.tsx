import React, { FC, useEffect } from "react"
import { useFetch, useWindowSize } from "../hooks"

const iframeID = 'iframeID'

export const PageContainer: FC = () => {

    const size = useWindowSize()

    const { data, error } = useFetch('/assets/Hidden-subgroup-problem.mhtml')

    useEffect(() => {
        console.log(data)
    }, [data])

    return (
        <iframe
            width={size.width}
            height={size.height}
            id={iframeID}
        />
    )
}