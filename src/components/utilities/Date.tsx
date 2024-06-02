import React, { FC, useState, useEffect } from "react"
import { StyledCheckbox } from "./StyledCheckbox"

interface PersonDateProps {
    placeholder: string
    name: string
    onEdit: (date: string) => void
    initialDate?: string
}

export const PersonDate: FC<PersonDateProps> = (props) => {
    const [date, setDate] = useState("")
    const [unknown, setUnknown] = useState(false)
    const [notYet, setNotYet] = useState(false)

    function getDate(): string {
        if (unknown) {
            return "unknown"
        } else if (notYet) {
            return "not yet"
        } else {
            // @ts-ignore
            return date
        }
    }

    useEffect(() => {
        props.onEdit(getDate())
    }, [date, unknown, notYet])

    useEffect(() => {
        if (props.initialDate) {
            if (props.initialDate == "unknown") {
                setUnknown(true)
            } else if (props.initialDate == "not yet") {
                setNotYet(true)
            } else {
                setDate(props.initialDate)
            }
        }
    }, [props.initialDate])

    return (
        <div className="person-date">
            <input
                defaultValue={props.initialDate == "unknown" || props.initialDate == "not yet" ? "/" : props.initialDate}
                type="text"
                required={true}
                disabled={unknown || notYet}
                autoComplete="off"
                className="person-date-input"
                id="date-input"
                placeholder={props.placeholder}
                onChange={(e) => {
                    setDate(e.currentTarget.value)
                }}
            />
            <StyledCheckbox
                label="unknown"
                checked={unknown}
                onChange={(b) => {
                    setUnknown(b)
                    setNotYet(false)
                }}
            />
            <StyledCheckbox
                label="not yet"
                checked={notYet}
                onChange={(b) => {
                    setNotYet(b)
                    setUnknown(false)
                }}
            />
        </div>
    )
}
