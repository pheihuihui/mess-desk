import React, { FC } from "react"
import { TSettingKeysForStringValues, useLocalStorage } from "../hooks"

interface TextInputProps {
    label: string
    placeholder?: string
    settingKey: TSettingKeysForStringValues
}

export const TextInput: FC<TextInputProps> = (props) => {
    const [value, setValue] = useLocalStorage(props.settingKey, "")

    return (
        <div className="textinput">
            <label htmlFor="input" className="text">
                {props.label}
            </label>
            <input value={value} type="text" placeholder={props.placeholder} name="input" className="input" onChange={(ev) => setValue(ev.target.value)} />
        </div>
    )
}
