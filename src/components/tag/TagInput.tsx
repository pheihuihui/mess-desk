import React, { useEffect, createRef, useRef, useState, Fragment, FC } from "react"
import { ClearAllTags } from "./ClearAllTags"
import { Suggestions } from "./Suggestions"
import { SingleTag, Tag } from "./SingleTag"

import { buildRegExpFromDelimiters, getKeyCodeFromSeparator, uniq } from "../../utilities/utilities"
import { TAG_KEYS, TAG_INPUT_FIELD_POSITIONS, TAG_ERRORS, TAGGING_CLASSNAMES } from "../../utilities/constants"
import { ReactTagsWrapperProps } from "./_index"

type TagInputProps = ReactTagsWrapperProps & {
    placeholder: string
    labelField: string
    suggestions: Array<Tag>
    separators: Array<string>
    autoFocus: boolean
    inputFieldPosition: "inline" | "top" | "bottom"
    allowDeleteFromEmptyInput: boolean
    allowAdditionFromPaste: boolean
    readOnly: boolean
    allowUnique: boolean
    allowDragDrop: boolean
    tags: Array<Tag>
    editable: boolean
    clearAll: boolean
}

export const TagInput: FC<TagInputProps> = (props) => {
    const {
        autoFocus,
        readOnly,
        labelField,
        allowDeleteFromEmptyInput,
        allowAdditionFromPaste,
        minQueryLength,
        shouldRenderSuggestions,
        removeComponent,
        maxTags,
        allowUnique,
        editable,
        placeholder,
        separators,
        tags,
        inputFieldPosition,
        maxLength,
        inputValue,
        clearAll,
    } = props

    const [suggestions, setSuggestions] = useState(props.suggestions)
    const [query, setQuery] = useState("")
    const [isFocused, setIsFocused] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [selectionMode, setSelectionMode] = useState(false)
    const [ariaLiveStatus, setAriaLiveStatus] = useState("")
    const [currentEditIndex, setCurrentEditIndex] = useState(-1)
    const [error, setError] = useState("")

    const reactTagsRef = createRef<HTMLDivElement>()
    const textInput = useRef<HTMLInputElement | null>(null)
    const tagInput = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        updateSuggestions()
    }, [query, props.suggestions])

    const filteredSuggestions = (query: string) => {
        let updatedSuggestions = props.suggestions.slice()

        if (allowUnique) {
            const existingTags = tags.map((tag) => tag.id.trim().toLowerCase())
            updatedSuggestions = updatedSuggestions.filter((suggestion) => !existingTags.includes(suggestion.id.toLowerCase()))
        }
        if (props.handleFilterSuggestions) {
            return props.handleFilterSuggestions(query, updatedSuggestions)
        }

        const exactSuggestions = updatedSuggestions.filter((item) => getQueryIndex(query, item) === 0)
        const partialSuggestions = updatedSuggestions.filter((item) => getQueryIndex(query, item) > 0)

        return exactSuggestions.concat(partialSuggestions)
    }

    const getQueryIndex = (query: string, item: Tag) => {
        return item[labelField].toLowerCase().indexOf(query.toLowerCase())
    }

    const resetAndFocusInput = () => {
        setQuery("")
        if (!textInput.current) {
            return
        }
        textInput.current.value = ""
        textInput.current.focus()
    }

    const handleDelete = (index: number, event: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLSpanElement>) => {
        event.preventDefault()
        event.stopPropagation()
        const currentTags = tags.slice()
        if (currentTags.length === 0) {
            return
        }
        setError("")
        props?.handleDelete?.(index, event)
        updateAriaLiveStatus(index, currentTags)
    }

    const updateAriaLiveStatus = (index: number, tags: Tag[]) => {
        if (!reactTagsRef?.current) {
            return
        }
        const tagRemoveButtons: NodeListOf<HTMLButtonElement> = reactTagsRef.current.querySelectorAll(".ReactTags__remove")
        let ariaLiveStatus = ""

        if (index === 0 && tags.length > 1) {
            ariaLiveStatus = `Tag at index ${index} with value ${tags[index].id} deleted. Tag at index 0 with value ${tags[1].id} focussed. Press backspace to remove`
            tagRemoveButtons[0]?.focus()
        } else if (index > 0) {
            ariaLiveStatus = `Tag at index ${index} with value ${tags[index].id} deleted. Tag at index ${index - 1} with value ${
                tags[index - 1].id
            } focussed. Press backspace to remove`
            tagRemoveButtons[index - 1]?.focus()
        } else {
            ariaLiveStatus = `Tag at index ${index} with value ${tags[index].id} deleted. Input focussed. Press enter to add a new tag`
            textInput.current?.focus()
        }

        setAriaLiveStatus(ariaLiveStatus)
    }

    const handleTagClick = (index: number, tag: Tag, event: React.MouseEvent<HTMLSpanElement> | React.TouchEvent<HTMLSpanElement>) => {
        if (readOnly) {
            return
        }
        if (editable) {
            setCurrentEditIndex(index)
            setQuery(tag[labelField])
            tagInput.current?.focus()
        }
        props.handleTagClick?.(index, event)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (props.handleInputChange) {
            props.handleInputChange(event.target.value, event)
        }

        const query = event.target.value.trim()
        setQuery(query)
    }

    const updateSuggestions = () => {
        const newSuggestions = filteredSuggestions(query)
        setSuggestions(newSuggestions)
        setSelectedIndex(selectedIndex >= newSuggestions.length ? newSuggestions.length - 1 : selectedIndex)
    }

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (props.handleInputFocus) {
            props.handleInputFocus(value, event)
        }
        setIsFocused(true)
    }

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (props.handleInputBlur) {
            props.handleInputBlur(value, event)
            if (textInput.current) {
                textInput.current.value = ""
            }
        }
        setIsFocused(false)
        setCurrentEditIndex(-1)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        // hide suggestions menu on escape
        if (event.key === "Escape") {
            event.preventDefault()
            event.stopPropagation()
            setSelectedIndex(-1)
            setSelectionMode(false)
            setSuggestions([])
            setCurrentEditIndex(-1)
        }

        if (separators.indexOf(event.key) !== -1 && !event.shiftKey) {
            if (event.keyCode !== TAG_KEYS.TAB || query !== "") {
                event.preventDefault()
            }

            const selectedQuery =
                selectionMode && selectedIndex !== -1
                    ? suggestions[selectedIndex]
                    : {
                          id: query.trim(),
                          [labelField]: query.trim(),
                      }
            if (Object.keys(selectedQuery)) {
                addTag(selectedQuery)
            }
        }

        if (event.key === "Enter" && query.trim() !== "") {
            event.preventDefault()
            event.stopPropagation()
            const selectedQuery =
                selectionMode && selectedIndex !== -1
                    ? suggestions[selectedIndex]
                    : {
                          id: query.trim(),
                          [labelField]: query.trim(),
                      }
            if (Object.keys(selectedQuery)) {
                addTag(selectedQuery)
            }
        }

        if (event.key === "Backspace" && query === "" && (allowDeleteFromEmptyInput || inputFieldPosition === TAG_INPUT_FIELD_POSITIONS.INLINE)) {
            // handleDelete(tags.length - 1, event)
        }

        if (event.keyCode === TAG_KEYS.UP_ARROW) {
            event.preventDefault()
            setSelectedIndex(selectedIndex <= 0 ? suggestions.length - 1 : selectedIndex - 1)
            setSelectionMode(true)
        }

        if (event.keyCode === TAG_KEYS.DOWN_ARROW) {
            event.preventDefault()
            setSelectionMode(true)
            suggestions.length === 0 ? setSelectedIndex(-1) : setSelectedIndex((selectedIndex + 1) % suggestions.length)
        }
    }

    const tagLimitReached = () => {
        return maxTags && tags.length >= maxTags
    }

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        if (!allowAdditionFromPaste) {
            return
        }

        if (tagLimitReached()) {
            setError(TAG_ERRORS.TAG_LIMIT)
            resetAndFocusInput()
            return
        }

        setError("")

        event.preventDefault()

        const clipboardData = event.clipboardData || (window as any).clipboardData
        const clipboardText = clipboardData.getData("text")

        const { maxLength = clipboardText.length } = props

        const maxTextLength = Math.min(maxLength, clipboardText.length)
        const pastedText = clipboardData.getData("text").substr(0, maxTextLength)

        let keycodes: number[] = []
        if (separators.length) {
            keycodes = []
            separators.forEach((separator) => {
                const keycode = getKeyCodeFromSeparator(separator)
                if (Array.isArray(keycode)) {
                    keycodes = [...keycodes, ...keycode]
                } else {
                    keycodes.push(keycode)
                }
            })
        }

        const delimiterRegExp = buildRegExpFromDelimiters(keycodes)
        const tags = pastedText.split(delimiterRegExp).map((tag) => tag.trim())

        // Only add unique tags
        uniq(tags).forEach((tag) =>
            addTag({
                id: tag.trim(),
                [labelField]: tag.trim(),
            }),
        )
    }

    const addTag = (tag: Tag) => {
        if (!tag.id || !tag[labelField]) {
            return
        }

        if (currentEditIndex === -1) {
            if (tagLimitReached()) {
                setError(TAG_ERRORS.TAG_LIMIT)
                resetAndFocusInput()
                return
            }
            setError("")
        }

        const existingKeys = tags.map((tag: Tag) => tag.id.toLowerCase())

        if (allowUnique && existingKeys.indexOf(tag.id.trim().toLowerCase()) >= 0) {
            return
        }

        if (currentEditIndex !== -1 && props.onTagUpdate) props.onTagUpdate(currentEditIndex, tag)
        else props?.handleAddition?.(tag)

        setQuery("")
        setSelectionMode(false)
        setSelectedIndex(-1)
        setCurrentEditIndex(-1)

        resetAndFocusInput()
    }

    const handleSuggestionClick = (index: number) => {
        addTag(suggestions[index])
    }

    const handleClearAll = () => {
        if (props.onClearAll) {
            props.onClearAll()
        }
        setError("")
        resetAndFocusInput()
    }

    const handleSuggestionHover = (index: number) => {
        setSelectedIndex(index)
        setSelectionMode(true)
    }

    const moveTag = (dragIndex: number, hoverIndex: number) => {
        const dragTag = tags[dragIndex]

        props?.handleDrag?.(dragTag, dragIndex, hoverIndex)
    }

    const getTagItems = () => {
        return tags.map((tag, index) => {
            return (
                <Fragment key={index}>
                    {currentEditIndex === index ? (
                        <div className={TAGGING_CLASSNAMES.EDITTAG_INPUT}>
                            <input
                                ref={(input: HTMLInputElement) => {
                                    tagInput.current = input
                                }}
                                onFocus={handleFocus}
                                value={query}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                onBlur={handleBlur}
                                className={TAGGING_CLASSNAMES.EDITTAG_INPUT_FIELD}
                                onPaste={handlePaste}
                                data-testid="tag-edit"
                            />
                        </div>
                    ) : (
                        <SingleTag
                            index={index}
                            tag={tag}
                            labelField={labelField}
                            onDelete={(event: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLSpanElement>) => handleDelete(index, event)}
                            removeComponent={removeComponent}
                            onTagClicked={(event: React.MouseEvent<HTMLSpanElement> | React.TouchEvent<HTMLSpanElement>) => handleTagClick(index, tag, event)}
                            readOnly={readOnly}
                        />
                    )}
                </Fragment>
            )
        })
    }

    const tagItems = getTagItems()

    const { name: inputName, id: inputId } = props

    const position = TAG_INPUT_FIELD_POSITIONS.BOTTOM

    const tagsComponent = !readOnly ? (
        <div className={TAGGING_CLASSNAMES.TAG_INPUT}>
            <input
                ref={(input) => {
                    textInput.current = input
                }}
                className={TAGGING_CLASSNAMES.TAG_INPUT_FIELD}
                type="text"
                placeholder={placeholder}
                aria-label={placeholder}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                name={inputName}
                id={inputId}
                maxLength={maxLength}
                value={inputValue}
                data-automation="input"
                data-testid="input"
            />

            <Suggestions
                query={query.trim()}
                suggestions={suggestions}
                labelField={labelField}
                selectedIndex={selectedIndex}
                handleClick={handleSuggestionClick}
                handleHover={handleSuggestionHover}
                minQueryLength={minQueryLength}
                shouldRenderSuggestions={shouldRenderSuggestions}
                isFocused={isFocused}
                renderSuggestion={props.renderSuggestion}
            />
            {clearAll && tags.length > 0 && <ClearAllTags onClick={handleClearAll} />}
            {error && (
                <div data-testid="error" className="ReactTags__error">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="24" width="24" fill="#e03131">
                        <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
                    </svg>
                    {error}
                </div>
            )}
        </div>
    ) : null

    return (
        <div className="" ref={reactTagsRef}>
            <p
                role="alert"
                className="sr-only"
                style={{
                    position: "absolute",
                    overflow: "hidden",
                    clip: "rect(0 0 0 0)",
                    margin: "-1px",
                    padding: 0,
                    width: "1px",
                    height: "1px",
                    border: 0,
                }}
            >
                {ariaLiveStatus}
            </p>
            {position === TAG_INPUT_FIELD_POSITIONS.TOP && tagsComponent}
            <div className={TAGGING_CLASSNAMES.SELECTED}>
                {tagItems}
                {position === TAG_INPUT_FIELD_POSITIONS.INLINE && tagsComponent}
            </div>
            {position === TAG_INPUT_FIELD_POSITIONS.BOTTOM && tagsComponent}
        </div>
    )
}
