// https://github.com/react-tags/react-tags

import { FC, ReactNode } from "react"
import { Tag } from "./SingleTag"
import { TAG_DEFAULT_LABEL_FIELD, TAG_DEFAULT_PLACEHOLDER, TAG_KEYS, TAG_SEPARATORS } from "../../utilities/constants"
import { ReactTags } from "./ReactTags"
import React from "react"

export interface ReactTagsWrapperProps {
    /**
     * Placeholder text for the input field.
     */
    placeholder?: string
    /**
     * Field name to use for the label of each tag.
     */
    labelField?: string
    /**
     * Array of suggestions to display in the dropdown.
     */
    suggestions?: Array<Tag>
    /**
     * Array of characters that will trigger a tag addition.
     * This should match the event.key property of the keydown event.
     */
    separators?: Array<string>
    /**
     * Whether the input field should automatically focus on mount.
     */
    autoFocus?: boolean
    /**
     * Whether the input field should be read-only.
     */
    readOnly?: boolean
    /**
     * Position of the input field relative to the tags.
     */
    inputFieldPosition?: "inline" | "top" | "bottom"
    /**
     * Handler for tag deletion.
     */
    handleDelete?: (i: number, event: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLSpanElement>) => void
    /**
     * Handler for tag addition.
     */
    handleAddition?: (tag: Tag) => void
    /**
     * Handler for tag updates.
     */
    onTagUpdate?: (i: number, tag: Tag) => void
    /**
     * Handler for tag drag and drop.
     */
    handleDrag?: (tag: Tag, currPos: number, newPos: number) => void
    /**
     * Handler for filtering suggestions.
     */
    handleFilterSuggestions?: (query: string, suggestions: Array<Tag>) => Array<Tag>
    /**
     * Handler for tag click events.
     */
    handleTagClick?: (i: number, e: React.MouseEvent<HTMLSpanElement> | React.TouchEvent<HTMLSpanElement>) => void
    /**
     * Whether to allow deletion from an empty input field.
     */
    allowDeleteFromEmptyInput?: boolean
    /**
     * Whether to allow addition from pasted text.
     */
    allowAdditionFromPaste?: boolean
    /**
     * Whether to allow drag and drop of tags.
     */
    allowDragDrop?: boolean
    /**
     * Handler for input field changes.
     */
    handleInputChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void
    /**
     * Handler for input field focus events.
     */
    handleInputFocus?: (value: string, e: React.FocusEvent<HTMLInputElement>) => void
    /**
     * Handler for input field blur events.
     */
    handleInputBlur?: (value: string, event: React.FocusEvent<HTMLInputElement>) => void
    /**
     * Minimum length of the query to trigger suggestions.
     */
    minQueryLength?: number
    /**
     * Function to determine whether to render suggestions.
     */
    shouldRenderSuggestions?: (query: string) => boolean
    /**
     * Component to be rendered for removing tags.
     */
    removeComponent?: React.ComponentType<any>
    /**
     * Whether to enable autocomplete when typing for suggestions
     */
    autocomplete?: boolean | number
    /**
     * Name attribute for the input field.
     */
    name?: string
    /**
     * ID attribute for the input field.
     */
    id?: string
    /**
     * Maximum length of the input field.
     */
    maxLength?: number
    /**
     * Value of the input field.
     */
    inputValue?: string
    /**
     * Maximum number of tags that can be added.
     */
    maxTags?: number
    /**
     * Array of tags to display.
     */
    tags?: Array<Tag>
    /**
     * Whether to allow unique tags only.
     */
    allowUnique?: boolean
    /**
     * Render function to render each suggestion item.
     */
    renderSuggestion?: (item: Tag, query: string) => ReactNode
    /**
     * Additional props to pass to the input field.
     */
    inputProps?: { [key: string]: string }
    /**
     * Whether the tags are editable.
     */
    editable?: boolean
    /**
     * Whether to display a button to clear all the tags.
     */
    clearAll?: boolean
    /**
     * Handler for clearing all the tags.
     */
    onClearAll?: () => void
}

export const TagInputWithDefaultProps: FC<ReactTagsWrapperProps> = (props) => {
    const {
        placeholder = TAG_DEFAULT_PLACEHOLDER,
        labelField = TAG_DEFAULT_LABEL_FIELD,
        suggestions = [],
        separators = [TAG_SEPARATORS.ENTER, TAG_SEPARATORS.TAB],
        autoFocus = true,
        inputFieldPosition = "inline",
        allowDeleteFromEmptyInput = false,
        allowAdditionFromPaste = true,
        autocomplete = false,
        readOnly = false,
        allowUnique = true,
        allowDragDrop = true,
        tags = [],
        inputProps = {},
        editable = false,
        clearAll = false,
        handleDelete,
        handleAddition,
        onTagUpdate,
        handleFilterSuggestions,
        handleTagClick,
        handleInputChange,
        handleInputFocus,
        handleInputBlur,
        minQueryLength,
        shouldRenderSuggestions,
        removeComponent,
        onClearAll,
        name,
        id,
        maxLength,
        inputValue,
        maxTags,
        renderSuggestion,
    } = props

    return (
        <ReactTags
            placeholder={placeholder}
            labelField={labelField}
            suggestions={suggestions}
            separators={separators}
            autoFocus={autoFocus}
            inputFieldPosition={inputFieldPosition}
            allowDeleteFromEmptyInput={allowDeleteFromEmptyInput}
            allowAdditionFromPaste={allowAdditionFromPaste}
            autocomplete={autocomplete}
            readOnly={readOnly}
            allowUnique={allowUnique}
            allowDragDrop={allowDragDrop}
            tags={tags}
            inputProps={inputProps}
            editable={editable}
            clearAll={clearAll}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            onTagUpdate={onTagUpdate}
            handleFilterSuggestions={handleFilterSuggestions}
            handleTagClick={handleTagClick}
            handleInputChange={handleInputChange}
            handleInputFocus={handleInputFocus}
            handleInputBlur={handleInputBlur}
            minQueryLength={minQueryLength}
            shouldRenderSuggestions={shouldRenderSuggestions}
            removeComponent={removeComponent}
            onClearAll={onClearAll}
            name={name}
            id={id}
            maxLength={maxLength}
            inputValue={inputValue}
            maxTags={maxTags}
            renderSuggestion={renderSuggestion}
        />
    )
}
