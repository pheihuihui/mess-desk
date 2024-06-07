import React, { FC, useEffect, useRef, useState } from "react"

type Shape = "circle" | "rect"

interface CircleOrRectProps {
    onMoveAndResize: (x: number, y: number, r: number) => void
    hidden?: boolean
    headX?: number
    headY?: number
    headD?: number
}

const CircleOrRect: (shape: Shape) => FC<CircleOrRectProps> = (shape) => (props) => {
    const [initialX, setInitialX] = useState(0)
    const [initialY, setInitialY] = useState(0)
    const [dragging, setDragging] = useState(false)
    const divRef = useRef<HTMLDivElement>(null)
    const [x, setX] = useState(100)
    const [y, setY] = useState(100)
    const [d, setD] = useState(200)
    const [initiated, setInitiated] = useState(false)

    useEffect(() => {
        if (props.headX && props.headY && props.headD && !initiated && props.headX != 100 && props.headY != 100 && props.headD != 200) {
            setX(props.headX)
            setY(props.headY)
            setD(props.headD)
            setInitiated(true)
        }
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
            setX(x + event.deltaY / 20)
            setY(y + event.deltaY / 20)
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

    const DIV = <div ref={divRef} className={shape} style={{ left: `${x}px`, top: `${y}px`, width: `${d}px`, height: `${d}px` }} />
    return props.hidden ? null : DIV
}

export const Circle = CircleOrRect("circle")
export const Rect = CircleOrRect("rect")
