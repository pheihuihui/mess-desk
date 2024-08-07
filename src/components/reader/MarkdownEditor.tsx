// https://github.com/phuocng/mirror-a-text-area/blob/main/03-line-numbers/index.html

import React, { useEffect, useLayoutEffect, useRef } from "react"
import { FC } from "react"
import { useRoute } from "../../router"

interface MarkdownEditorProps {
    initialText?: string
    lines?: number
    onEdited?: (text: string) => void
    onSaved?: (text: string) => void
    frozen?: boolean
}

export const MarkdownEditor: FC<MarkdownEditorProps> = (props) => {
    const [frozen, setFrozen] = React.useState(false)
    const textRef = useRef<HTMLTextAreaElement>(null)
    const lineNumbersRef = useRef<HTMLDivElement>(null)
    const canvas = document.createElement("canvas")
    const ro = new ResizeObserver(() => {
        if (textRef.current && lineNumbersRef.current) {
            const rect = textRef.current.getBoundingClientRect()
            lineNumbersRef.current.style.height = `${rect.height}px`
            displayLineNumbers()
        }
    })
    const parseValue = (v: string) => (v.endsWith("px") ? parseInt(v.slice(0, -2), 10) : 0)

    const displayLineNumbers = () => {
        const lineNumbers = calculateLineNumbers()
        if (lineNumbersRef.current) {
            let _html = Array.from(
                {
                    length: lineNumbers.length,
                },
                (_, i) => `<div>${lineNumbers[i] || "&nbsp;"}</div>`,
            ).join("")
            lineNumbersRef.current.innerHTML = _html
        }
    }

    const calculateNumLines = (str: string) => {
        if (!textRef.current || !lineNumbersRef.current) {
            return 0
        }
        const textareaStyles = window.getComputedStyle(textRef.current)
        const paddingLeft = parseValue(textareaStyles.paddingLeft)
        const paddingRight = parseValue(textareaStyles.paddingRight)
        const context = canvas.getContext("2d")
        if (context == null) {
            return 0
        }
        const textareaWidth = textRef.current.getBoundingClientRect().width - paddingLeft - paddingRight
        const words = str.split(" ")
        let lineCount = 0
        let currentLine = ""
        for (let i = 0; i < words.length; i++) {
            const wordWidth = context.measureText(words[i] + " ").width
            const lineWidth = context.measureText(currentLine).width

            if (lineWidth + wordWidth > textareaWidth) {
                lineCount += 1
                currentLine = words[i] + " "
            } else {
                currentLine += words[i] + " "
            }
        }

        if (currentLine.trim() !== "") {
            lineCount += 1
        }

        return lineCount
    }

    const calculateLineNumbers = () => {
        if (!textRef.current || !lineNumbersRef.current) {
            return []
        }
        const lines = textRef.current.value.split("\n")
        const numLines = lines.map((line) => calculateNumLines(line))

        let lineNumbers: (number | string)[] = []
        let i = 1
        while (numLines.length > 0) {
            const numLinesOfSentence = numLines.shift()
            lineNumbers.push(i)
            if (numLinesOfSentence && numLinesOfSentence > 1) {
                Array(numLinesOfSentence - 1)
                    .fill("")
                    .forEach((_) => lineNumbers.push(""))
            }
            i += 1
        }

        return lineNumbers
    }

    useLayoutEffect(() => {
        displayLineNumbers()
        const _scroll = () => {
            if (textRef.current && lineNumbersRef.current) {
                lineNumbersRef.current.scrollTop = textRef.current.scrollTop
            }
        }
        if (textRef.current && lineNumbersRef.current) {
            let textareaStyles = window.getComputedStyle(textRef.current)
            let _properties = ["fontFamily", "fontSize", "fontWeight", "letterSpacing", "lineHeight", "padding"]
            _properties.forEach((property) => {
                // @ts-ignore
                lineNumbersRef.current!.style[property] = textareaStyles[property]
            })
            const font = `${textareaStyles.fontSize} ${textareaStyles.fontFamily}`
            const context = canvas.getContext("2d")
            if (context) {
                context.font = font
            }
            textRef.current.addEventListener("input", displayLineNumbers)
            textRef.current.addEventListener("scroll", _scroll)
            ro.observe(textRef.current)
            textRef.current.onkeydown = (e) => {
                if (e.ctrlKey && e.key == "s") {
                    e.preventDefault()
                    if (props.onSaved) {
                        props.onSaved(textRef.current?.value ?? "")
                    }
                }
            }
        }
        return () => {
            if (textRef.current && lineNumbersRef.current) {
                textRef.current.removeEventListener("input", displayLineNumbers)
                textRef.current.removeEventListener("scroll", _scroll)
                ro.disconnect()
            }
        }
    }, [textRef.current, lineNumbersRef.current])

    useEffect(() => {
        if (props.frozen) {
            setFrozen(true)
        }
    }, [props.frozen])

    return (
        <div className="markdown-reader-code">
            <div id="line-numbers" className="container-lines" ref={lineNumbersRef} />
            <textarea
                readOnly={frozen}
                ref={textRef}
                defaultValue={props.initialText}
                onChange={(e) => {
                    if (props.onEdited) {
                        props.onEdited(e.currentTarget.value)
                    }
                }}
            />
        </div>
    )
}
