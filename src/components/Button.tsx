import React, { FC, PropsWithChildren } from "react"

interface ButtonProps {
    onclick: (_: any) => void
    text: string
    color: 'black' | 'blue' | 'red' | 'green' | 'purple' | 'gray'
}

type ButtonColors = Record<ButtonProps['color'], string>

export const Button: FC<PropsWithChildren<ButtonProps>> = (props) => {

    const buttonColors: ButtonColors = {
        'black': 'bg-navy-700 hover:bg-navy-800 active:bg-navy-900',
        'blue': 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
        'red': 'bg-red-500 hover:bg-red-600 active:bg-red-700',
        'green': 'bg-green-500 hover:bg-green-600 active:bg-green-700',
        'purple': 'bg-purple-500 hover:bg-purple-600 active:bg-purple-700',
        'gray': 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300',
    }

    const baseStyles = 'flex flex-row items-center rounded-xl px-4 py-3 text-base font-medium transition duration-200'
    const _buttonStyle = `${baseStyles} ${buttonColors[props.color]}`
    const buttonStyle = props.color == 'black' ? `${_buttonStyle} text-white` : `${_buttonStyle} `

    return (
        <button className={buttonStyle} onClick={props.onclick}>
            {props.children}
            {props.text}
        </button>
    )
}