import React, { FC, useEffect, useState } from "react"
import { DBStorage } from "../../utilities/meta"
import { formatPeriod } from "../../utilities/utilities"

export const DetailedPortraits: FC<{ personID: string }> = props => {

    const [name, setName] = useState<string>()
    const [birth, setBirth] = useState<DBStorage.DateInfo>()
    const [death, setDeath] = useState<DBStorage.DateInfo>()
    const [img, setImg] = useState<string>()
    const [desc, setDesc] = useState<string>()

    useEffect(() => {
        setName('J. Robert Oppenheimer')
        setBirth({ yyyy: 1904, mm: 4, dd: 22 })
        setDeath({ yyyy: 1967, mm: 2, dd: 18 })
        setImg('./assets/oppenheimer.jpg')
        setDesc(`An American theoretical physicist and director of the Manhattan Project's Los Alamos Laboratory during World War II. He is often called the "father of the atomic bomb".`)
    }, [])

    return (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <img className="rounded-t-lg" src={img} />
            <div className="p-5">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
                    {name}
                </h5>
                <p className="mb-3 font-normal text-gray-200">
                    {formatPeriod(birth, death)}
                </p>
                <p className="mb-3 font-normal text-gray-400">
                    {desc}
                </p>
            </div>
        </div>
    )
}