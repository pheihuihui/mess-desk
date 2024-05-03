import React from "react"
import { FC } from "react"

interface StyledCheckboxProps {
    checked: boolean
    onChange: (b: boolean) => void
    label: string
}

export const StyledCheckbox: FC<StyledCheckboxProps> = ({ checked, onChange, label }) => {
    return (
        <label className="styled-checkbox">
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.currentTarget.checked)} />
            <div className="checkmark"></div>
            <span>&nbsp;&nbsp;{label}</span>
        </label>
    )
}
