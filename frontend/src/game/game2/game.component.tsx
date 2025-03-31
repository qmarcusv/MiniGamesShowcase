// Game 2 - Pirate Theme (Scaled Up)
import { useEffect, useRef, useState } from "react";
import ButtonSound from "../../feature/button-sound/button-sound.component";
import {
	CircularProgressbarWithChildren,
	buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Game2() {
	const questions = [
		{
			question: "Ngọn núi cao nhất thế giới là?",
			responses: ["Fansipan", "Everest", "Phú Sĩ", "Andes"],
			result: 1,
			explanation: "Everest là đỉnh núi cao nhất thế giới.",
		},
		{
			question: "Quốc kỳ Việt Nam có màu gì?",
			responses: ["Xanh", "Đỏ/Vàng", "Trắng", "Tím"],
			result: 1,
			explanation: "Quốc kỳ Việt Nam có nền đỏ với ngôi sao vàng.",
		},
		{
			question: "Sông nào dài nhất thế giới?",
			responses: ["Nile", "Amazon", "Mekong", "Hồng Hà"],
			result: 0,
			explanation: "Sông Nile là sông dài nhất thế giới.",
		},
		{
			question: "Thủ đô của Nhật Bản là gì?",
			responses: ["Osaka", "Kyoto", "Tokyo", "Nagoya"],
			result: 2,
			explanation: "Tokyo là thủ đô của Nhật Bản.",
		},
		{
			question: "Trái đất quay quanh gì?",
			responses: ["Mặt Trăng", "Sao Hỏa", "Mặt Trời", "Sao Kim"],
			result: 2,
			explanation: "Trái đất quay quanh Mặt Trời.",
		},
	];

	const [currentIndex, setCurrentIndex] = useState(0);
	const [selected, setSelected] = useState<number | null>(null);
	const [timeLeft, setTimeLeft] = useState(10);
	const [showAnswer, setShowAnswer] = useState(false);
	const [timedOut, setTimedOut] = useState(false);
	const [correctCount, setCorrectCount] = useState(0);

	const tickRef = useRef<HTMLAudioElement>(null);
	const tickFastRef = useRef<HTMLAudioElement>(null);
	const correctRef = useRef<HTMLAudioElement>(null);
	const wrongRef = useRef<HTMLAudioElement>(null);

	const currentQuestion = questions[currentIndex];
	const isGameOver = currentIndex >= questions.length;

	const rewardImages = {
		common: "/image/reward-common.png",
		rare: "/image/reward-rare.png",
		legendary: "/image/reward-legendary.png",
		mythic: "/image/reward-mythic.png",
	};

	const getReward = () => {
		if (correctCount === 5)
			return { label: "👑 Duy ngã độc tôn", rarity: "mythic" };
		if (correctCount === 4)
			return { label: "🛡️ Vật phẩm truyền thuyết", rarity: "legendary" };
		if (correctCount >= 2) return { label: "💎 Vật phẩm quý", rarity: "rare" };
		if (correctCount >= 1)
			return { label: "🪙 Vật phẩm thường", rarity: "common" };
		return { label: "😅 Không nhận được vật phẩm", rarity: "none" };
	};

	const nextQuestion = () => {
		setSelected(null);
		setShowAnswer(false);
		setTimeLeft(10);
		setTimedOut(false);
		setCurrentIndex((prev) => prev + 1);
	};

	const selectResponse = (index: number) => {
		if (selected !== null || showAnswer) return;
		setSelected(index);
		setShowAnswer(true);
		setTimedOut(false);
		const isCorrect = index === currentQuestion.result;
		if (isCorrect) {
			setCorrectCount((c) => c + 1);
			correctRef.current?.play();
		} else {
			wrongRef.current?.play();
		}
		setTimeout(nextQuestion, 3000);
	};

	useEffect(() => {
		if (!currentQuestion || showAnswer || isGameOver) return;
		if (timeLeft === 0) {
			setTimedOut(true);
			setShowAnswer(true);
			wrongRef.current?.play();
			setTimeout(nextQuestion, 3000);
			return;
		}
		const timer = setTimeout(() => {
			setTimeLeft((t) => t - 1);
			if (timeLeft <= 3) tickFastRef.current?.play();
			else tickRef.current?.play();
		}, 1000);
		return () => clearTimeout(timer);
	}, [timeLeft, showAnswer, currentQuestion]);

	return (
		<div className="min-h-screen bg-[url('/image/pirate-wood.jpg')] bg-cover p-12 text-yellow-100 font-pirate relative">
			<h1 className="text-6xl text-center font-bold text-yellow-300 mb-10">
				🧠 Thử thách trí tuệ!
			</h1>

			{/* Treasure Progress */}
			<div className="absolute top-10 right-10 w-28 h-28">
				<CircularProgressbarWithChildren
					value={correctCount * 20}
					styles={buildStyles({ pathColor: "#facc15", trailColor: "#1e293b" })}
				>
					<span className="text-lg font-bold">{correctCount * 20}%</span>
				</CircularProgressbarWithChildren>
			</div>

			{/* Question Box */}
			<div className="max-w-6xl mx-auto bg-black/50 rounded-3xl border-4 border-yellow-600 p-12 shadow-2xl">
				{!isGameOver ? (
					<>
						<h2 className="text-4xl text-yellow-300 mb-8">
							Câu {currentIndex + 1}: {currentQuestion.question}
						</h2>

						<div className="flex justify-between items-start gap-12">
							<div className="flex-1 grid grid-cols-2 gap-6">
								{currentQuestion.responses.map((res, idx) => (
									<ButtonSound
										key={idx}
										soundUrl="/sound/press.mp3"
										onClick={() => selectResponse(idx)}
										className={`py-5 px-6 text-center text-2xl rounded-2xl transition cursor-pointer
                      ${
												showAnswer && idx === currentQuestion.result
													? "bg-green-500 text-white"
													: showAnswer && idx === selected
													? "bg-red-500 text-white"
													: "bg-white text-black hover:bg-yellow-100"
											}`}
									>
										{res}
									</ButtonSound>
								))}
							</div>

							<div className="w-32">
								<CircularProgressbarWithChildren
									value={(timeLeft / 10) * 100}
									styles={buildStyles({
										pathColor: timeLeft <= 3 ? "#ef4444" : "#facc15",
										trailColor: "#1e293b",
									})}
								>
									<div className="text-xl font-bold">{timeLeft}s</div>
								</CircularProgressbarWithChildren>
							</div>
						</div>

						{showAnswer && (
							<div className="mt-10 bg-yellow-100 text-yellow-900 border-4 border-yellow-600 p-6 rounded-2xl text-xl font-semibold shadow-xl">
								<strong className="block mb-2 text-2xl">📖 Giải thích:</strong>
								{currentQuestion.explanation}
							</div>
						)}
					</>
				) : (
					<div className="text-center">
						<h2 className="text-5xl font-bold text-green-400 mb-6">
							🎉 Hoàn thành trò chơi!
						</h2>
						<p className="text-2xl mb-4">
							Số câu đúng: {correctCount} / {questions.length}
						</p>
						{(() => {
							const reward = getReward();
							return reward.rarity !== "none" ? (
								<>
									<img
										src={
											rewardImages[reward.rarity as keyof typeof rewardImages]
										}
										alt={reward.label}
										className="w-40 h-40 mx-auto my-6"
									/>
									<p className="text-3xl font-bold text-yellow-300">
										{reward.label}
									</p>
								</>
							) : (
								<p className="text-2xl text-red-400 font-bold">
									{reward.label}
								</p>
							);
						})()}
					</div>
				)}
			</div>

			{/* Sound Effects */}
			<audio ref={tickRef} src="/sound/tick.mp3" preload="auto" />
			<audio ref={tickFastRef} src="/sound/hurry.mp3" preload="auto" />
			<audio ref={correctRef} src="/sound/correct.mp3" preload="auto" />
			<audio ref={wrongRef} src="/sound/wrong.mp3" preload="auto" />
		</div>
	);
}
