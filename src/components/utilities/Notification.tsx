import React, { FC, useState, useEffect, useRef, useContext, createContext } from "react"

interface NotificationCtx {
    message: string
    setMessage?: (message: string) => void
}

export const NotificationContext = createContext<NotificationCtx>({ message: "loaded", setMessage: (message: string) => {} })

export const Notification: FC = () => {
    const ctx = useContext(NotificationContext)
    const [lastMessage, setLastMessage] = useState("unloaded")
    const [show, setShow] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (ctx.message == lastMessage) {
            return
        } else {
            setLastMessage(ctx.message)
            setShow(true)
        }
    }, [ctx])

    useEffect(() => {
        if (!show) {
            ref.current?.style.setProperty("display", "none")
            return
        }
        ref.current?.style.setProperty("display", "inline")
        const timer = setTimeout(() => {
            setShow(false)
            ref.current?.style.setProperty("display", "none")
        }, 2000)
        return () => {
            clearTimeout(timer)
        }
    }, [show])

    return (
        <div ref={ref} className="notification">
            {ctx.message}
        </div>
    )
}
