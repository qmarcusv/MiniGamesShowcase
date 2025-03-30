import { useRef, useEffect } from "react";
import defaultClickSound from "/sound/click.mp3";
import correctSound from "/sound/correct.mp3";
import wrongSound from "/sound/wrong.mp3";
import pressSound from "/sound/pressed.mp3";
import finishSound from "/sound/finish.mp3";

interface ButtonSoundProps {
	soundUrl?: string;
	onClick?: () => void;
	children: React.ReactNode;
	className?: string;
}

export default function ButtonSound({
	soundUrl = defaultClickSound,
	onClick,
	children,
	className = "",
}: ButtonSoundProps) {
	const soundRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		soundRef.current = new Audio(soundUrl);
	}, [soundUrl]);

	const handleClick = () => {
		try {
			if (soundRef.current) {
				soundRef.current.currentTime = 0;
				soundRef.current.play();
			}
		} catch (err) {
			console.warn("Sound failed to play:", err);
		}

		if (onClick) onClick();
	};

	return (
		<button onClick={handleClick} className={className}>
			{children}
		</button>
	);
}

// Export sounds for reuse
export const buttonSounds = {
	default: defaultClickSound,
	press: pressSound,
	correct: correctSound,
	wrong: wrongSound,
	finish: finishSound,
};
