import React, { FC, useState } from "react"
import { DashboardLayout } from "../components/_layout/DashboardLayout"
import { Tag } from "../components/tag/SingleTag"
import { TagInputWithDefaultProps } from "../components/tag/Tag"

export const WelcomePage: FC = () => {
    const [tags, setTags] = useState<Tag[]>([
        { id: "Thailand", text: "Thailand" },
        { id: "India", text: "India" },
        { id: "Vietnam", text: "Vietnam" },
        { id: "Turkey", text: "Turkey" },
    ])
    const handleDelete = (i: number) => {
        setTags(tags.filter((_tag, index) => index != i))
    }

    const handleAddition = (tag: Tag) => {
        setTags((prevTags) => {
            return [...prevTags, tag]
        })
    }

    return (
        <DashboardLayout>
            <TagInputWithDefaultProps
                labelField="text"
                tags={tags}
                suggestions={suggestions}
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                handleTagClick={(_) => {
                    alert("tag clicked")
                }}
                inputFieldPosition="inline"
                autocomplete={false}
                editable
                maxTags={15}
                allowAdditionFromPaste
                placeholder={"placeholder..."}
                separators={[]}
                autoFocus={false}
                readOnly={false}
                allowDeleteFromEmptyInput={false}
                allowUnique={false}
                clearAll={false}
            />
        </DashboardLayout>
    )
}

export const COUNTRIES = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antigua &amp; Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
]

const suggestions: Tag[] = COUNTRIES.map((country) => {
    return {
        id: country,
        text: country,
    }
})
