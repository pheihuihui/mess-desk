import React, { FC } from "react"

interface DropdownProps {
    options: string[]
    onSelected: (option: string) => void
}

export const Dropdown: FC<DropdownProps> = (props) => {
    return (
        <div className="dropdown">
            <svg y="0" xmlns="http://www.w3.org/2000/svg" x="0" width="100" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" height="100">
                <path
                    strokeWidth="4"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    d="M60.7,53.6,50,64.3m0,0L39.3,53.6M50,64.3V35.7m0,46.4A32.1,32.1,0,1,1,82.1,50,32.1,32.1,0,0,1,50,82.1Z"
                    className="svg-stroke-primary"
                ></path>
            </svg>
            <select onChange={(e) => props.onSelected(e.currentTarget.value)}>
                {props.options.map((option, i) => (
                    <option key={i}>{option}</option>
                ))}
            </select>
        </div>
    )
}
