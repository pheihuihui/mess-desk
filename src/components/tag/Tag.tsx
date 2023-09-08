import React, { FC } from "react";

interface TagProps {
	text: string;
	remove: (txt: string) => void;
	disabled?: boolean;
	className?: string;
}


export const Tag: FC<TagProps> = props => {
	return (
		<span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full whitespace-nowrap overflow-hidden">
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
