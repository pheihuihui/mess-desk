import React, { FC, useEffect, useState } from "react"
import { Editor } from "./Editor"
import { Button } from "./Button"

export const Paper: FC = () => {
    const [html, setHtml] = useState<string>("")

    return (
        <div className="grid grid-cols-2 h-[80vh] w-[90vh] gap-4">
            <div>
                <Editor />
            </div>
            <div>
                <Button
                    color="blue"
                    text="Edit article"
                    onclick={() => {
                        alert("hi")
                    }}
                />
                <article className="prose prose-slate bg-slate-600 rounded-md" style={{ width: 400, height: 400 }} dangerouslySetInnerHTML={{ __html: html }} />
                <Button color="black" text="Download" onclick={() => {}} />
                <Button color="green" text="Save article" onclick={() => {}} />
            </div>
        </div>
    )
}
