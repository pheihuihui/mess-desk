import React, { FC } from "react";

interface TagProps {
	text: string;
	remove: (txt: string) => void;
	disabled?: boolean;
	className?: string;
}


export const Tag: FC<TagProps> = props => {
	return (
		<span className="">
			<span>{props.text}</span>
			{!props.disabled && (
				<button
					type="button"
					onClick={e => {
						e.stopPropagation()
						props.remove(props.text)
					}}
					aria-label={`remove ${props.text}`}
				>
					&#10005;
				</button>
			)}
		</span>
	);
}
