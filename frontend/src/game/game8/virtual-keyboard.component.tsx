import React from "react";

interface VirtualKeyboardProps {
	onKeyPress: (key: string) => void;
	onBackspace: () => void;
	onEnter: () => void;
}

const KEYBOARD_LAYOUT = [
	["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
	["A", "S", "D", "F", "G", "H", "J", "K", "L"],
	["Z", "X", "C", "V", "B", "N", "M"],
];

export default function VirtualKeyboard({
	onKeyPress,
	onBackspace,
	onEnter,
}: VirtualKeyboardProps) {
	return (
		<div className="virtual-keyboard flex flex-col gap-4">
			{KEYBOARD_LAYOUT.map((row, rowIndex) => (
				<div key={rowIndex} className="flex justify-center gap-4">
					{rowIndex === 2 && (
						<button
							onClick={onEnter}
							className="w-20 h-16 bg-emerald-600 hover:bg-emerald-700 text-white text-2xl rounded-xl transition-colors"
						>
							✓
						</button>
					)}
					{row.map((key) => (
						<button
							key={key}
							onClick={() => onKeyPress(key)}
							className="w-16 h-16 bg-cyan-600 hover:bg-cyan-700 text-white text-2xl rounded-xl transition-colors"
						>
							{key}
						</button>
					))}
					{rowIndex === 2 && (
						<button
							onClick={onBackspace}
							className="w-20 h-16 bg-red-600 hover:bg-red-700 text-white text-2xl rounded-xl transition-colors"
						>
							←
						</button>
					)}
				</div>
			))}
		</div>
	);
}
