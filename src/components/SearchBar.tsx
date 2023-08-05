import React, { FC, FormEvent } from "react"
import { RightArrow } from "./Icon"

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
                    className="rounded-md p-1 "
                    type='text'
                    size={45}
                    placeholder={props.placeHolder}
                    onChange={props.onChange}
                />
                <button type='submit'>
                    <RightArrow />
                </button>
            </form>
        </div>
    )
}