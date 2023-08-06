import React, { FC, FormEvent } from "react"
import { RightArrow } from "../Icon"

interface SearchBarProps {
    placeHolder: string
    onChange: (_: any) => void
    onSearch: (_: any) => void
}

export const SearchBar: FC<SearchBarProps> = props => {

    return (
        <div>
            <form onSubmit={e => {
                e.preventDefault();
                props.onSearch(e);
            }}>
                <input
                    className="rounded-md p-1 align-middle shadow-sm m-2"
                    type='text'
                    size={100}
                    placeholder={props.placeHolder}
                    onChange={props.onChange}
                />
                <button type='submit' className="align-middle m-1">
                    <RightArrow />
                </button>
            </form>
        </div>
    )
}