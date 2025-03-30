// feature/environment-sound/environment-sound.component.tsx

export function playSoundRepeatedly(soundUrl: string, repeatCount: number = 1) {
	const audio = new Audio(soundUrl);
	let playCount = 0;

	const play = () => {
		if (playCount >= repeatCount) return;
		audio.currentTime = 0;
		audio.play();
		playCount++;
		audio.onended = play;
	};

	play();
}
