import React, { FC } from "react"
import { SITES } from "../../utilities/constants"

type PageThumbnailProps = {
    key: number
    domain: string
    title: string
}

const iconPrefix = "./assets"

const siteIcon = (domain: string) => {
    for (const u of SITES) {
        if (domain.indexOf(u) != -1) {
            switch (u) {
                case ".wikipedia.org":
                    return `${iconPrefix}/wiki-250.png`
                case ".zhihu.com":
                    return `${iconPrefix}/zhihu-192.png`
                case ".reddit.com":
                    return `${iconPrefix}/reddit-250.png`
                default:
                    break
            }
        }
    }
    return `${iconPrefix}/www-256.png`
}

export const PageThumbnail: FC<PageThumbnailProps> = (props) => {
    const icon = siteIcon(props.domain)

    return (
        <div className="overflow-hidden shadow-2xl rounded-2xl h-64 w-64">
            <div className="flex items-center pl-3 bg-gray-900 rounded-t-xl h-8">
                {[1, 2, 3].map((_) => (
                    <span className="w-3 h-3 p-1 m-1 bg-white rounded-full"></span>
                ))}
            </div>
            <div className="grid place-items-center h-[90%] bg-blue-300">
                <img src={icon} className="h-40 w-40 rounded-md" />
                {props.title}
            </div>
        </div>
    )
}
