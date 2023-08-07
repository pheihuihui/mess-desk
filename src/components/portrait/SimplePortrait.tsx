import React, { FC, useEffect, useState } from "react"

export const SimplePortrait: FC<{ personID: string }> = props => {

    const [name, setName] = useState<string>()
    const [img, setImg] = useState<string>()

    useEffect(() => {
        setName('J. Robert Oppenheimer')
        setImg('./assets/oppenheimer.jpg')
    }, [])

    return (
        <div className="flex flex-col items-center pb-10">
            <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={img} title={name} />
        </div>
    )
}