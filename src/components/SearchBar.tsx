import React, { FC } from "react"

interface SearchBarProps {
    placeHolder: string
    onClick: (_: any) => void
    onChange: (_: any) => void
}

export const SearchBar: FC<SearchBarProps> = props => {

    return (
        <div className='searchbar-container'>
            <form onSubmit={e => e.preventDefault()}>
                <input
                    type='text'
                    size={45}
                    placeholder={props.placeHolder}
                    onChange={props.onChange}
                />
                <button
                    type='submit'
                    onClick={props.onClick}>
                    Search
                </button>
            </form>
        </div>
    )
}