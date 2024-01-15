import React, { FC } from "react"
import { SearchBar } from "./SearchBar"
import { PageThumbnail } from "./PageThumbnail"

export const PageThumbnailsGrid: FC = () => {
    return (
        <div>
            <div>
                <SearchBar />
            </div>
            <div className="grid grid-cols-5 gap-3">
                {["www.zhihu.com", "bilibili.com", "twitter.com", "www.typescriptlang.org", "www.reddit.com", "zh.wikipedia.org"].map((x, u) => (
                    <PageThumbnail key={u} title={x} domain={x} />
                ))}
            </div>
        </div>
    )
}
