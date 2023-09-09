import React, { useEffect, useState } from "react";
import { useDidUpdateEffect } from "../../hooks";

import { Tag } from "./Tag";
import { TagList } from "./TagList";

export interface TagsInputProps {
	name?: string;
	placeHolder?: string;
	value?: string[];
	onChange?: (tags: string[]) => void;
	onBlur?: any;
	separators?: string[];
	disableBackspaceRemove?: boolean;
	onExisting?: (tag: string) => void;
	onRemoved?: (tag: string) => void;
	disabled?: boolean;
	isEditOnRemove?: boolean;
	beforeAddValidate?: (tag: string, existingTags: string[]) => boolean;
	onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	classNames?: {
		input?: string;
		tag?: string;
	};
}

export const TagsInput = ({
	name,
	placeHolder,
	value,
	onChange,
	onBlur,
	separators,
	disableBackspaceRemove,
	onExisting,
	onRemoved,
	disabled,
	isEditOnRemove,
	beforeAddValidate,
	onKeyUp,
	classNames,
}: TagsInputProps) => {
	const [selectedTags, setSelectedTags] = useState<string[]>(value ?? [])
	const [filteredTags, setFilteredTags] = useState<string[]>([])
	const [index, setIndex] = useState(0)
	const [allTags, setAllTags] = useState<string[]>([])
	const [currentValue, setCurrentValue] = useState('')

	useDidUpdateEffect(() => {
		onChange && onChange(selectedTags);
	}, [selectedTags]);

	useDidUpdateEffect(() => {
		if (JSON.stringify(value) !== JSON.stringify(selectedTags)) {
			setSelectedTags(value ?? []);
		}
	}, [value]);

	useEffect(() => {
		let savedTagsStr = localStorage.getItem('savedTags')
		if (savedTagsStr) {
			let arr = JSON.parse(savedTagsStr) as string[]
			setAllTags(arr)
		}
	}, [])

	return (
		<div aria-labelledby={name} className="w-40">
			<div className="w-full">
				{selectedTags.map(tag => (
					<Tag
						key={tag}
						className={classNames?.tag}
						text={tag}
						remove={txt => {
							setSelectedTags(selectedTags.filter(tag => tag != txt));
							onRemoved && onRemoved(txt);
						}}
						disabled={disabled}
					/>
				))}
			</div>
			<input
				className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full"
				type="text"
				name={name}
				placeholder={placeHolder}
				onKeyDown={e => {
					e.stopPropagation()
					const count = filteredTags.length
					if (e.code == 'ArrowUp') {
						setIndex(index - 1 >= 0 ? index - 1 : 0)
					} else if (e.code == 'ArrowDown') {
						setIndex(index + 1 <= count - 1 ? index + 1 : count - 1)
					} else if (e.code == 'Enter') {
						let newtag = ''
						if (filteredTags && filteredTags[index]) {
							newtag = filteredTags[index]
						} else {
							newtag = currentValue
						}
						let tmp = new Set([...selectedTags, newtag])
						setSelectedTags(Array.from(tmp))
					}
				}}
				onChange={e => {
					let val = e.target.value as string
					setCurrentValue(val)
					if (val.length > 0) {
						let arr = allTags.filter(t => t.toLowerCase().indexOf(val.toLowerCase()) != -1)
						setFilteredTags(arr)
					} else {
						setFilteredTags([])
					}
					setIndex(0)
				}}
				onBlur={onBlur}
				disabled={disabled}
				onKeyUp={onKeyUp}
			/>
			<div className="w-full h-16">
				{filteredTags.length == 0 || <TagList tags={filteredTags} selected={index} />}
			</div>
		</div>
	);
};
