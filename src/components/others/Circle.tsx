import React, { FC, useEffect, useRef, useState } from "react"

interface CircleProps {
    onMoveAndResize: (x: number, y: number, r: number) => void
}

export const Circle: FC<CircleProps> = (props) => {
    const [initialX, setInitialX] = useState(0)
    const [initialY, setInitialY] = useState(0)
    const [x, setX] = useState(100)
    const [y, setY] = useState(100)
    const [d, setD] = useState(200)
    const [dragging, setDragging] = useState(false)
    const divRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (dragging) {
                event.stopPropagation()
                event.preventDefault()
                setX(event.clientX + x - initialX)
                setY(event.clientY + y - initialY)
            }
        }

        const handleMouseUp = (event: MouseEvent) => {
            event.stopPropagation()
            event.preventDefault()
            setDragging(false)
        }

        const handleMouseDown = (event: MouseEvent) => {
            event.stopPropagation()
            event.preventDefault()
            setInitialX(event.clientX)
            setInitialY(event.clientY)
            setDragging(true)
        }

        const handdleMouseScroll = (event: WheelEvent) => {
            event.stopPropagation()
            event.preventDefault()
            setD(d - event.deltaY / 10)
        }

        divRef.current?.addEventListener("wheel", handdleMouseScroll)
        divRef.current?.addEventListener("mousedown", handleMouseDown)
        divRef.current?.addEventListener("mousemove", handleMouseMove)
        divRef.current?.addEventListener("mouseup", handleMouseUp)

        props.onMoveAndResize(x, y, d)

        return () => {
            divRef.current?.removeEventListener("wheel", handdleMouseScroll)
            divRef.current?.removeEventListener("mousedown", handleMouseDown)
            divRef.current?.removeEventListener("mousemove", handleMouseMove)
            divRef.current?.removeEventListener("mouseup", handleMouseUp)
        }
    }, [dragging, d, props])

    return <div ref={divRef} className="circle" style={{ left: `${x}px`, top: `${y}px`, width: `${d}px`, height: `${d}px` }} />
}
