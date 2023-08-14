import React, { FC, useEffect, useState } from "react"
import { DetailedPortrait, DetailedPortraitProps } from "./DetailedPortrait"
import { SimplePortrait } from "./SimplePortrait"
import { findOneFile } from "../../utilities/db"

interface PortraitProps {
    personID: string
    mode: 'simple' | 'detailed'
}

export const Portrait: FC<PortraitProps> = props => {

    const person = fetchPersonInfo(props.personID)
    const [mode, setMode] = useState<PortraitProps['mode']>(props.mode)
    const [imgBlob, setImgBlob] = useState<string>('')

    useEffect(() => {
        findOneFile(person.img)
            .then(b => { return URL.createObjectURL(b) })
            .then(x => setImgBlob(x))
    }, [])

    const simpleVersion = <SimplePortrait name={person.name} img={imgBlob} onImgClicked={() => { setMode('detailed') }} />
    const detailedVersion =
        <DetailedPortrait
            name={person.name}
            img={imgBlob}
            birth={person.birth}
            death={person.death}
            description={person.description}
            onImgClicked={() => { setMode('simple') }}
        />
    return mode == 'simple' ? simpleVersion : detailedVersion
}

function fetchPersonInfo(id: string): Omit<DetailedPortraitProps, "onImgClicked"> {
    return {
        name: 'J. Robert Oppenheimer',
        birth: { yyyy: 1904, mm: 4, dd: 22 },
        death: { yyyy: 1967, mm: 2, dd: 18 },
        img: 'oppenheimer.jpg',
        description: `An American theoretical physicist and director of the Manhattan Project's Los Alamos Laboratory during World War II. He is often called the "father of the atomic bomb".`
    }
}