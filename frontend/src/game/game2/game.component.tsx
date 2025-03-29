import { useEffect, useRef, useState } from "react";
import ButtonSound from "../../feature/button-sound/button-sound.component";
import {
	CircularProgressbarWithChildren,
	buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Navigator from "../../shared/navigator/navigator.component";

export default function Game() {
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

	const [shuffledQuestions] = useState(() => {
		const shuffled = [...questions].sort(() => 0.5 - Math.random());
		return shuffled.slice(0, 5);
	});

	const [currentIndex, setCurrentIndex] = useState(0);
	const [selected, setSelected] = useState<number | null>(null);
	const [timeLeft, setTimeLeft] = useState(10);
	const [showAnswer, setShowAnswer] = useState(false);
	const [timedOut, setTimedOut] = useState(false);
	const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
	const [fiftyUsed, setFiftyUsed] = useState(false);
	const [progress, setProgress] = useState<(null | "correct" | "wrong")[]>(
		Array(5).fill(null)
	);
	const [correctCount, setCorrectCount] = useState(0);
	const [wrongCount, setWrongCount] = useState(0);
	const [skippedCount, setSkippedCount] = useState(0);

	const currentQuestion = shuffledQuestions[currentIndex];

	const tickRef = useRef<HTMLAudioElement>(null);
	const tickFastRef = useRef<HTMLAudioElement>(null);
	const correctRef = useRef<HTMLAudioElement>(null);
	const wrongRef = useRef<HTMLAudioElement>(null);

	const nextQuestion = () => {
		setSelected(null);
		setShowAnswer(false);
		setTimeLeft(10);
		setTimedOut(false);
		setDisabledOptions([]);
		setFiftyUsed(false);
		setCurrentIndex((prev) => prev + 1);
	};

	const selectResponse = (responseIndex: number) => {
		if (
			selected !== null ||
			!currentQuestion ||
			disabledOptions.includes(responseIndex)
		)
			return;

		setSelected(responseIndex);
		setShowAnswer(true);
		setTimedOut(false);

		const isCorrect = responseIndex === currentQuestion.result;
		setProgress((prev) => {
			const updated = [...prev];
			updated[currentIndex] = isCorrect ? "correct" : "wrong";
			return updated;
		});

		if (isCorrect) {
			correctRef.current?.play();
			setCorrectCount((prev) => prev + 1);
		} else {
			wrongRef.current?.play();
			setWrongCount((prev) => prev + 1);
		}

		setTimeout(nextQuestion, 3000);
	};

	const useFiftyFifty = () => {
		if (fiftyUsed || !currentQuestion) return;
		const correctIndex = currentQuestion.result;
		const wrongIndexes = currentQuestion.responses
			.map((_, i) => i)
			.filter((i) => i !== correctIndex);
		const toHide = wrongIndexes.sort(() => 0.5 - Math.random()).slice(0, 2);
		setDisabledOptions(toHide);
		setFiftyUsed(true);
	};

	useEffect(() => {
		if (!currentQuestion || showAnswer) return;

		if (timeLeft === 0) {
			setShowAnswer(true);
			setTimedOut(true);
			wrongRef.current?.play();
			setProgress((prev) => {
				const updated = [...prev];
				updated[currentIndex] = "wrong";
				return updated;
			});
			setSkippedCount((prev) => prev + 1);
			setTimeout(nextQuestion, 3000);
			return;
		}

		const timer = setTimeout(() => {
			setTimeLeft((prev) => prev - 1);
			if (timeLeft <= 3) tickFastRef.current?.play();
			else tickRef.current?.play();
		}, 1000);

		return () => clearTimeout(timer);
	}, [timeLeft, currentQuestion, showAnswer]);

	const getResponseStyle = (index: number) => {
		if (disabledOptions.includes(index) && !showAnswer)
			return "bg-gray-200 text-gray-400 cursor-not-allowed";
		if (!showAnswer)
			return selected === index
				? "bg-blue-400 text-white"
				: "bg-white text-black hover:bg-blue-100";
		if (index === currentQuestion?.result) return "bg-green-500 text-white";
		if (index === selected) return "bg-red-500 text-white";
		return "bg-white text-black";
	};

	const isGameOver = currentIndex >= shuffledQuestions.length;

	return (
		<div className="w-full min-h-screen px-6 py-10 flex flex-col items-center bg-gradient-to-b from-blue-50 to-blue-100">
			<h1 className="text-5xl font-extrabold text-blue-700 mb-6 text-center">
				Trò chơi 2: Câu hỏi
			</h1>

			{/* Progress Dots */}
			<div className="flex justify-center gap-4 mb-6">
				{progress.map((status, idx) => (
					<div
						key={idx}
						className={`w-6 h-6 rounded-full border-2 ${
							status === "correct"
								? "bg-green-500 border-green-700"
								: status === "wrong"
								? "bg-red-500 border-red-700"
								: "bg-gray-300 border-gray-500"
						}`}
					/>
				))}
			</div>

			<div className="w-[80%] max-w-[1200px] min-w-[900px] min-h-[500px] p-10 rounded-[2rem] bg-white shadow-2xl text-xl">
				{!isGameOver ? (
					<>
						{/* Question Box */}
						<div className="bg-blue-50 border border-blue-300 rounded-xl p-6 shadow-sm mb-10 text-center">
							<h2 className="text-3xl font-bold mb-2">
								Câu hỏi {currentIndex + 1}:
							</h2>
							<p className="text-2xl">{currentQuestion.question}</p>
						</div>

						{/* Answer + Timer Side by Side */}
						<div className="flex items-start justify-between gap-10">
							<div className="flex-1 flex flex-col gap-4">
								{currentQuestion.responses.map((res, index) => (
									<ButtonSound
										key={index}
										soundUrl="/sounds/press.mp3"
										onClick={() => selectResponse(index)}
										className={`py-3 px-6 text-lg rounded-lg transition border text-center cursor-pointer ${getResponseStyle(
											index
										)}`}
									>
										{res}
									</ButtonSound>
								))}
							</div>

							{/* Timer + Explanation + 50/50 */}
							<div className="flex flex-col items-center gap-4 mt-2 w-36">
								<div className="w-full">
									<CircularProgressbarWithChildren
										value={(timeLeft / 10) * 100}
										strokeWidth={8}
										styles={buildStyles({
											pathColor: timeLeft <= 3 ? "#dc2626" : "#2563eb",
											trailColor: "#e5e7eb",
										})}
									>
										<div
											className={`text-2xl font-bold ${
												timeLeft <= 3 ? "text-red-600" : "text-blue-600"
											}`}
										>
											{timeLeft}s
										</div>
									</CircularProgressbarWithChildren>
								</div>

								{!fiftyUsed && (
									<ButtonSound
										soundUrl="/sounds/press.mp3"
										onClick={useFiftyFifty}
										className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700"
									>
										50/50
									</ButtonSound>
								)}

								{showAnswer && (
									<div className="bg-yellow-100 text-yellow-900 border border-yellow-300 p-3 rounded-lg text-sm w-full">
										<strong>Giải thích:</strong> {currentQuestion.explanation}
										{timedOut && (
											<p className="text-red-500 mt-2 font-semibold">
												⏰ Hết giờ! Bạn chưa chọn đáp án.
											</p>
										)}
									</div>
								)}
							</div>
						</div>
					</>
				) : (
					<div className="text-green-700 font-semibold text-2xl text-center">
						🎉 Bạn đã hoàn thành trò chơi!
						<div className="mt-4 text-base text-gray-800 bg-green-100 p-4 rounded-lg max-w-md mx-auto">
							<p>
								<strong>Tổng số câu hỏi:</strong> {shuffledQuestions.length}
							</p>
							<p>
								<strong>Trả lời đúng:</strong> {correctCount}
							</p>
							<p>
								<strong>Trả lời sai:</strong> {wrongCount}
							</p>
							<p>
								<strong>Bỏ qua (hết giờ):</strong> {skippedCount}
							</p>
						</div>
						<div className="mt-8">
							<Navigator previewLink="../game1" nextLink="../game3" />
						</div>
					</div>
				)}
			</div>

			{/* Sound FX */}
			<audio ref={tickRef} src="/sounds/tick.mp3" preload="auto" />
			<audio ref={tickFastRef} src="/sounds/tick-fast.mp3" preload="auto" />
			<audio ref={correctRef} src="/sounds/correct.mp3" preload="auto" />
			<audio ref={wrongRef} src="/sounds/wrong.mp3" preload="auto" />
		</div>
	);
}
