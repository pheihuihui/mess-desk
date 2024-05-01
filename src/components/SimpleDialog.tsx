import React, { PropsWithChildren, forwardRef } from "react"

export const SimpleDialog = forwardRef<HTMLDialogElement, PropsWithChildren>((props, ref) => {
    return (
        <dialog ref={ref} className="simple-dialog">
            <div className="simple-dialog-div">{props.children}</div>
            <button
                className="simple-dialog-button"
                onClick={() => {
                    if (ref && typeof ref == "object") {
                        ref.current?.close()
                    }
                }}
            >
                Exit
            </button>
        </dialog>
    )
})
