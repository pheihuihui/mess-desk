import React, { FC, FormEvent } from "react"

interface SearchBarProps {
    placeHolder: string
    onChange: (_: any) => void
    onSearch: (_: any) => void
}

export const SearchBar: FC<SearchBarProps> = props => {

    return (
        <div style={{ margin: '0 auto' }}>
            <form onSubmit={e => {
                e.preventDefault();
                props.onSearch(e);
            }}>
                <input
                    type='text'
                    size={45}
                    placeholder={props.placeHolder}
                    onChange={props.onChange}
                />
                <button type='submit'>
                    Search
                </button>
            </form>
        </div>
    )
}