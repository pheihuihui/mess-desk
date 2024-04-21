import React, { FC, useState, useEffect } from "react"

export const Notification: FC = () => {
    const [message, setMessage] = useState("")
    const [show, setShow] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false)
        }, 5000)
        return () => {
            clearTimeout(timer)
        }
    }, [show])

    return <div className={`notification ${show ? "show" : ""}`}>{message}</div>
}
