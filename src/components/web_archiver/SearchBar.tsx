import React, { FC } from "react"

export const SearchBar: FC = () => {
    return (
        <div>
            <form
                onSubmit={(e) => {
                    console.log(e)
                }}
            >
                <input className="rounded-md p-1 align-middle shadow-sm m-2" type="text" size={100} />
            </form>
        </div>
    )
}
