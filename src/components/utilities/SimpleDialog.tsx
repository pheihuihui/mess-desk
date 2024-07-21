import React, { FC, PropsWithChildren, RefObject } from "react"

interface SimpleDialogProps {
    ref: RefObject<HTMLDialogElement | null>
}

export const SimpleDialog: FC<PropsWithChildren<SimpleDialogProps>> = (props) => {
    return (
        <dialog ref={props.ref} className="simple-dialog">
            <div className="simple-dialog-div">{props.children}</div>
            <button
                className="simple-dialog-button"
                onClick={() => {
                    if (props.ref && typeof props.ref == "object") {
                        props.ref.current?.close()
                    }
                }}
            >
                Exit
            </button>
        </dialog>
    )
}
