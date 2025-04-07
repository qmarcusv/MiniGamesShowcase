import { useEffect, useRef, useState } from "react";
import ButtonSound from "../../feature/button-sound/button-sound.component";
import {
	CircularProgressbarWithChildren,
	buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Conclusion2 from "./game-conclusion.component";
import { useNavigate } from "react-router-dom";
import {
	FaQuestion,
	FaClock,
	FaCheckCircle,
	FaTimesCircle,
	FaLightbulb,
	FaHome,
	FaCog,
	FaSyncAlt,
	FaArrowRight,
	FaLeaf,
	FaSeedling,
	FaTree,
	FaFeather,
} from "react-icons/fa";

export default function Game() {
	const navigate = useNavigate();
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
	const [showSettings, setShowSettings] = useState(false);
	const [hasFiftyFiftyBeenUsed, setHasFiftyFiftyBeenUsed] = useState(false);

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
			disabledOptions.includes(responseIndex) ||
			timedOut ||
			showAnswer
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
		if (fiftyUsed || !currentQuestion || hasFiftyFiftyBeenUsed) return;

		const correctIndex = currentQuestion.result;
		const wrongIndexes = currentQuestion.responses
			.map((_, i) => i)
			.filter((i) => i !== correctIndex);
		const toHide = wrongIndexes.sort(() => 0.5 - Math.random()).slice(0, 2);
		setDisabledOptions(toHide);
		setFiftyUsed(true);
		setHasFiftyFiftyBeenUsed(true);
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
		if (timedOut) {
			return index === currentQuestion?.result
				? "bg-[#5d8c54]/70 backdrop-blur-sm text-white border-[#3c5d37]"
				: "bg-gray-500/20 text-gray-400 cursor-not-allowed border-[#5d8c54]/20";
		}

		if (disabledOptions.includes(index) && !showAnswer)
			return "bg-gray-500/20 text-gray-400 cursor-not-allowed border-[#5d8c54]/20";
		if (!showAnswer)
			return selected === index
				? "bg-[#5d8c54]/75 text-white border-[#4a7344]"
				: "bg-[#f7fcf2]/60 backdrop-blur-sm text-[#1c4c3b] hover:bg-[#e0edd0]/70 border-[#5d8c54]/30 hover:border-[#5d8c54]/40";
		if (index === currentQuestion?.result)
			return "bg-[#5d8c54]/70 backdrop-blur-sm text-white border-[#3c5d37]";
		if (index === selected)
			return "bg-[#b05757]/70 backdrop-blur-sm text-white border-[#8e4545]";
		return "bg-[#f7fcf2]/60 backdrop-blur-sm text-[#1c4c3b] border-[#5d8c54]/30";
	};

	const isGameOver = currentIndex >= shuffledQuestions.length;

	if (isGameOver) {
		return (
			<Conclusion2
				timeUsed={timeLeft}
				matchedCards={correctCount}
				totalCards={shuffledQuestions.length}
				win={correctCount > wrongCount}
			/>
		);
	}

	return (
		<div
			className="game-zone h-full flex flex-col items-center bg-cover bg-center py-8 px-6 relative"
			style={{
				backgroundImage: "url('/game/game2/gameplay.png')",
			}}
		>
			{/* Overlay layer - làm mờ nhẹ nền để nhấn mạnh khung tranh */}
			<div className="absolute inset-0 bg-[#0a261a]/5"></div>

			{/* Header với nút cài đặt */}
			<div className="absolute top-4 right-4 z-50">
				<div className="relative">
					<button
						onClick={() => setShowSettings(!showSettings)}
						className="w-12 h-12 bg-[#1c4c3b]/80 hover:bg-[#123c2b] rounded-full flex items-center justify-center text-[#d6ebdf] shadow-lg border-2 border-[#94c77f]/40"
					>
						<FaCog className="w-6 h-6" />
					</button>

					{showSettings && (
						<div className="absolute top-full right-0 mt-2 bg-[#f3f9ea]/95 backdrop-blur-sm border-2 border-[#5d8c54]/70 rounded-lg shadow-xl p-2 w-48">
							<ul className="space-y-2">
								<li>
									<button
										onClick={() => navigate("/")}
										className="w-full text-left px-3 py-2 hover:bg-[#e0edd0]/80 rounded flex items-center gap-2 text-[#1c4c3b]"
									>
										<FaHome /> Trang chính
									</button>
								</li>
								<li>
									<button
										onClick={() => window.location.reload()}
										className="w-full text-left px-3 py-2 hover:bg-[#e0edd0]/80 rounded flex items-center gap-2 text-[#1c4c3b]"
									>
										<FaSyncAlt /> Chơi lại
									</button>
								</li>
								<li>
									<button
										onClick={() => navigate("/game2")}
										className="w-full text-left px-3 py-2 hover:bg-[#e0edd0]/80 rounded flex items-center gap-2 text-[#1c4c3b]"
									>
										<FaArrowRight /> Quay lại
									</button>
								</li>
							</ul>
						</div>
					)}
				</div>
			</div>

			<div className="relative z-10 flex flex-col items-center w-full mt-4">
				{/* Tiêu đề trò chơi đã bị xóa */}

				{/* Progress Dots - dạng lá */}
				<div className="flex justify-center gap-3 mb-6">
					{progress.map((status, idx) => (
						<div
							key={idx}
							className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transform ${
								idx % 2 === 0 ? "rotate-12" : "-rotate-12"
							} ${
								status === "correct"
									? "bg-[#5d8c54]/75 border-[#94c77f]/80 text-white"
									: status === "wrong"
									? "bg-[#b05757]/75 border-[#e49891]/80 text-white"
									: "bg-[#e0edd0]/60 border-[#94c77f]/70 text-[#1c4c3b]"
							}`}
						>
							{status === "correct" ? (
								<FaCheckCircle className="text-sm" />
							) : status === "wrong" ? (
								<FaTimesCircle className="text-sm" />
							) : (
								<FaLeaf className="text-sm" />
							)}
						</div>
					))}
				</div>

				{/* Main container - redesigned to look like an ancient parchment */}
				<div className="w-[98%] max-w-[1300px] min-h-[500px] p-3 relative">
					{/* Background texture của khung giấy cổ */}
					<div className="absolute inset-0 rounded-[2rem] bg-[#f0f5e9]/70 opacity-90 shadow-xl"></div>

					{/* Border giả cổ */}
					<div className="absolute inset-0 rounded-[2rem] border-8 border-[#5d8c54]/20 box-border shadow-inner"></div>

					{/* Họa tiết dây leo tại các góc */}
					<div className="absolute top-0 left-0 w-20 h-20">
						<FaLeaf className="text-[#5d8c54]/50 text-4xl absolute top-3 left-3 transform -rotate-45" />
					</div>
					<div className="absolute top-0 right-0 w-20 h-20">
						<FaLeaf className="text-[#5d8c54]/50 text-4xl absolute top-3 right-3 transform rotate-45" />
					</div>
					<div className="absolute bottom-0 left-0 w-20 h-20">
						<FaLeaf className="text-[#5d8c54]/50 text-4xl absolute bottom-3 left-3 transform -rotate-135" />
					</div>
					<div className="absolute bottom-0 right-0 w-20 h-20">
						<FaLeaf className="text-[#5d8c54]/50 text-4xl absolute bottom-3 right-3 transform rotate-135" />
					</div>

					{/* Nội dung */}
					<div className="relative p-8 flex flex-col space-y-6">
						{/* Question Box - phong cách cổ xưa */}
						<div className="bg-[#f7fcf2]/70 backdrop-blur-sm rounded-xl p-8 shadow-md mb-4 text-center border-2 border-[#5d8c54]/30 relative">
							{/* Trang trí góc */}
							<div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#5d8c54]/20 rounded-tl-lg"></div>
							<div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#5d8c54]/20 rounded-tr-lg"></div>
							<div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#5d8c54]/20 rounded-bl-lg"></div>
							<div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#5d8c54]/20 rounded-br-lg"></div>

							<h2 className="text-3xl font-bold mb-5 text-[#1c4c3b] flex items-center justify-center font-sans">
								<FaQuestion className="text-[#5d8c54] mr-3" /> Câu hỏi{" "}
								{currentIndex + 1}:
							</h2>
							<p className="text-4xl text-[#2a5d45] font-sans">
								{currentQuestion.question}
							</p>
						</div>

						{/* Answer + Timer Side by Side */}
						<div className="flex items-start justify-between gap-8">
							<div className="flex-1 flex flex-col gap-5">
								{currentQuestion.responses.map((res, index) => (
									<ButtonSound
										key={index}
										soundUrl="/sound/press.mp3"
										onClick={() => selectResponse(index)}
										className={`py-5 px-7 text-2xl rounded-lg transition text-center cursor-pointer flex items-center relative border-2 font-sans ${getResponseStyle(
											index
										)}`}
									>
										{/* Hiệu ứng viền cổ kính */}
										<div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#5d8c54]/30"></div>
										<div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#5d8c54]/30"></div>
										<div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#5d8c54]/30"></div>
										<div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#5d8c54]/30"></div>

										<span className="w-12 h-12 inline-flex items-center justify-center bg-[#e0edd0]/60 rounded-full mr-4 text-[#1c4c3b] font-sans font-bold text-2xl">
											{String.fromCharCode(65 + index)}
										</span>
										<span className="flex-1">{res}</span>
									</ButtonSound>
								))}
							</div>

							{/* Timer + Explanation + 50/50 */}
							<div className="flex flex-col items-center gap-6 mt-2 w-72">
								<div className="w-36 h-36 p-2 bg-[#f7fcf2]/60 backdrop-blur-sm rounded-full border-4 border-[#5d8c54]/20 shadow-md">
									<CircularProgressbarWithChildren
										value={(timeLeft / 10) * 100}
										strokeWidth={8}
										styles={buildStyles({
											pathColor: timeLeft <= 3 ? "#b05757" : "#5d8c54",
											trailColor: "#e0edd0",
											pathTransitionDuration: 0.5,
										})}
									>
										<div className="flex flex-col items-center">
											<FaClock
												className={`text-2xl ${
													timeLeft <= 3 ? "text-[#b05757]" : "text-[#5d8c54]"
												}`}
											/>
											<div
												className={`text-5xl font-bold font-sans ${
													timeLeft <= 3 ? "text-[#b05757]" : "text-[#5d8c54]"
												}`}
											>
												{timeLeft}
											</div>
										</div>
									</CircularProgressbarWithChildren>
								</div>

								{!hasFiftyFiftyBeenUsed && (
									<ButtonSound
										soundUrl="/sound/press.mp3"
										onClick={useFiftyFifty}
										className="bg-[#5d8c54]/75 hover:bg-[#4a7344]/80 text-white px-5 py-3 rounded-lg w-full flex items-center justify-center font-bold text-xl border-b-4 border-[#3c5d37]/80 active:border-b-0 active:mt-1 transition-all font-sans"
									>
										<FaLightbulb className="mr-2" /> 50/50
									</ButtonSound>
								)}

								{showAnswer && (
									<div className="bg-[#f7fcf2]/70 backdrop-blur-sm text-[#1c4c3b] border-2 border-[#5d8c54]/30 p-4 rounded-lg w-full shadow-md">
										<h3 className="font-bold flex items-center font-sans text-xl">
											<FaSeedling className="text-[#5d8c54] mr-2" /> Giải thích:
										</h3>
										<p className="mt-2 font-sans text-lg">
											{currentQuestion.explanation}
										</p>
										{timedOut && (
											<>
												<p className="text-[#b05757] mt-3 font-semibold flex items-center font-sans">
													<FaTimesCircle className="mr-2" /> Hết giờ! Bạn chưa
													chọn đáp án.
												</p>
												<p className="text-[#5d8c54] mt-1 font-semibold font-sans">
													Đáp án đúng là:{" "}
													{String.fromCharCode(65 + currentQuestion.result)} -{" "}
													{currentQuestion.responses[currentQuestion.result]}
												</p>
											</>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Audio elements */}
			<audio ref={tickRef} src="/sound/tick.mp3" />
			<audio ref={tickFastRef} src="/sound/hurry.mp3" />
			<audio ref={correctRef} src="/sound/correct.mp3" />
			<audio ref={wrongRef} src="/sound/wrong.mp3" />
		</div>
	);
}
