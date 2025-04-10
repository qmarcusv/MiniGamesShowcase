import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import correctSound from "/sound/correct.mp3";
import wrongSound from "/sound/wrong.mp3";
import tickSound from "/sound/tick.mp3";
import endSound from "/sound/end.mp3";
import Conclusion5 from "./game-conclusion.component";
import { FaCog, FaHome, FaArrowLeft } from "react-icons/fa";

interface Document {
	id: string;
	imageUrl: string;
	author: string;
	type: string;
	field: string;
	title: string;
	x: number;
	y: number;
	dx: number;
	dy: number;
	speed: number;
	selected: boolean;
	hidden: boolean;
}

interface Question {
	type: "type" | "author" | "field";
	text: string;
	correctAnswers: string[];
	wrongAttempts: number;
}

export default function Game5() {
	const navigate = useNavigate();
	const [documents, setDocuments] = useState<Document[]>([]);
	const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
	const [score, setScore] = useState(0);
	const [timeLeft, setTimeLeft] = useState(15);
	const [questionCount, setQuestionCount] = useState(0);
	const [correctCount, setCorrectCount] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const playZoneRef = useRef<HTMLDivElement>(null);
	const animationFrameRef = useRef<number | undefined>(undefined);
	const [baseSpeed] = useState(2);
	const [wrongAttempts, setWrongAttempts] = useState(0);
	const [selectedCorrectDocs, setSelectedCorrectDocs] = useState<string[]>([]);
	const [showSettings, setShowSettings] = useState(false);

	useEffect(() => {
		// Xóa dữ liệu cũ
		localStorage.removeItem("game5-documents");

		const savedDocuments = localStorage.getItem("game5-documents");
		if (!savedDocuments) {
			const sampleDocuments = [
				{
					id: "1",
					imageUrl: "/game/game5/donxin.png",
					author: "Nguyễn Văn A",
					type: "Đơn xin",
					field: "Hành chính",
					title: "Đơn xin nghỉ phép",
				},
				{
					id: "2",
					imageUrl: "/game/game5/donxin2.png",
					author: "Nguyễn Văn A",
					type: "Đơn xin",
					field: "Hành chính",
					title: "Đơn xin tạm ứng",
				},
				{
					id: "3",
					imageUrl: "/game/game5/thongtu1.png",
					author: "Bộ Tài chính",
					type: "Thông tư",
					field: "Tài chính",
					title: "Thông tư hướng dẫn thuế",
				},
				{
					id: "4",
					imageUrl: "/game/game5/thongtu2.png",
					author: "Bộ Tài chính",
					type: "Thông tư",
					field: "Tài chính",
					title: "Thông tư về phí, lệ phí",
				},
				{
					id: "5",
					imageUrl: "/game/game5/quyetdinh1.png",
					author: "Tòa án nhân dân",
					type: "Quyết định",
					field: "Tư pháp",
					title: "Quyết định ly hôn",
				},
				{
					id: "6",
					imageUrl: "/game/game5/quyetdinh2.png",
					author: "Tòa án nhân dân",
					type: "Quyết định",
					field: "Tư pháp",
					title: "Quyết định giám hộ",
				},
			];
			localStorage.setItem("game5-documents", JSON.stringify(sampleDocuments));
			initializeGame(sampleDocuments);
		} else {
			initializeGame(JSON.parse(savedDocuments));
		}

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, []);

	const initializeGame = (savedDocs: any[]) => {
		console.log("=== DEBUG: initializeGame ===");
		console.log("savedDocs:", savedDocs);

		if (!playZoneRef.current) {
			console.error("playZoneRef.current is null");
			return;
		}

		const { width, height } = playZoneRef.current.getBoundingClientRect();
		console.log("Playzone dimensions:", { width, height });

		const initializedDocs = generateGameDocuments(savedDocs, width, height);
		console.log("Initialized documents:", initializedDocs);

		setDocuments(initializedDocs);
		generateNewQuestion(initializedDocs);
	};

	const generateGameDocuments = (
		baseDocs: any[],
		width: number,
		height: number
	) => {
		console.log("=== DEBUG: generateGameDocuments ===");
		console.log("Input docs:", baseDocs);

		const numDocs = Math.floor(Math.random() * 3) + 4; // 4-6 văn bản
		console.log("Number of docs to generate:", numDocs);

		const selectedDocs = [...baseDocs]
			.sort(() => Math.random() - 0.5)
			.slice(0, numDocs);
		console.log("Selected docs:", selectedDocs);

		// Chia màn hình thành các làn theo chiều dọc
		const docSize = 300;
		const safeMargin = 150;
		const availableHeight = height - 2 * safeMargin;
		const laneHeight = availableHeight / numDocs;

		console.log("Layout calculations:", {
			docSize,
			safeMargin,
			availableHeight,
			laneHeight,
		});

		// Mảng lưu hướng di chuyển của các làn
		const laneDirections: boolean[] = [];
		let prevDirection = Math.random() < 0.5;

		// Đảm bảo các làn liền kề có hướng ngược nhau
		for (let i = 0; i < numDocs; i++) {
			laneDirections.push(prevDirection);
			prevDirection = !prevDirection;
		}

		// Tạo mảng vị trí ban đầu cho mỗi làn
		const initialPositions = laneDirections.map((isMovingLeft) => {
			if (isMovingLeft) {
				// Bắt đầu từ bên phải màn hình
				return width - docSize; // Trừ đi kích thước văn bản để không bị sát cạnh
			} else {
				// Bắt đầu từ bên trái màn hình
				return 0; // Bắt đầu từ vị trí 0 thay vì âm
			}
		});

		// Đảm bảo khoảng cách tối thiểu giữa các văn bản
		for (let i = 0; i < initialPositions.length; i++) {
			for (let j = i + 1; j < initialPositions.length; j++) {
				const minDistance = docSize * 2; // Tăng khoảng cách tối thiểu
				const distance = Math.abs(initialPositions[i] - initialPositions[j]);

				if (distance < minDistance) {
					// Điều chỉnh vị trí để đảm bảo khoảng cách tối thiểu
					initialPositions[j] = initialPositions[i] + minDistance;
				}
			}
		}

		return selectedDocs.map((doc, index): Document => {
			const isMovingLeft = laneDirections[index];
			const speed = baseSpeed * (0.8 + Math.random() * 0.3); // Giảm biên độ dao động tốc độ
			const laneY = safeMargin + laneHeight * index + laneHeight / 2;

			return {
				...doc,
				x: initialPositions[index],
				y: laneY,
				dx: isMovingLeft ? -speed : speed,
				dy: 0,
				speed: speed,
				selected: false,
				hidden: false,
			};
		});
	};

	const generateNewQuestion = (docs: Document[]) => {
		console.log("=== DEBUG: generateNewQuestion ===");
		console.log("Input docs:", docs);

		const types: Array<"type" | "author" | "field"> = [
			"type",
			"author",
			"field",
		];
		const validQuestions: {
			type: "type" | "author" | "field";
			answers: string[];
		}[] = [];

		// Tìm các loại câu hỏi hợp lệ (có ít nhất 2 đáp án giống nhau)
		types.forEach((type) => {
			console.log(`\nChecking type: ${type}`);
			const answerCounts = new Map<string, string[]>();

			docs.forEach((doc) => {
				const answer = doc[type];
				console.log(`Document ${doc.id} has ${type}: ${answer}`);
				const docIds = answerCounts.get(answer) || [];
				docIds.push(doc.id);
				answerCounts.set(answer, docIds);
			});

			console.log(
				`Answer counts for ${type}:`,
				Object.fromEntries(answerCounts)
			);

			// Chỉ giữ lại các đáp án có ít nhất 2 văn bản
			const validAnswers = Array.from(answerCounts.entries())
				.filter(([_, ids]) => ids.length >= 2)
				.map(([answer]) => answer);

			console.log(`Valid answers for ${type}:`, validAnswers);

			if (validAnswers.length > 0) {
				validQuestions.push({ type, answers: validAnswers });
				console.log(`Added ${type} to valid questions`);
			}
		});

		console.log("\nFinal valid questions:", validQuestions);

		if (validQuestions.length === 0) {
			console.error("Không đủ dữ liệu để tạo câu hỏi hợp lệ");
			return;
		}

		// Chọn ngẫu nhiên một loại câu hỏi hợp lệ
		const selectedQuestion =
			validQuestions[Math.floor(Math.random() * validQuestions.length)];
		const selectedType = selectedQuestion.type;

		// Chọn ngẫu nhiên 2 đáp án đúng từ danh sách đáp án hợp lệ
		const correctAnswers = selectedQuestion.answers
			.sort(() => Math.random() - 0.5)
			.slice(0, 2);

		// Tạo danh sách đáp án nhiễu (3-4 đáp án)
		const wrongAnswers = docs
			.map((doc) => doc[selectedType])
			.filter((answer) => !correctAnswers.includes(answer))
			.filter((answer, index, self) => self.indexOf(answer) === index)
			.sort(() => Math.random() - 0.5)
			.slice(0, Math.random() < 0.5 ? 3 : 4);

		console.log("Selected question type:", selectedType);
		console.log("Correct answers:", correctAnswers);
		console.log("Wrong answers:", wrongAnswers);

		let text = "";
		switch (selectedType) {
			case "type":
				text = "Tìm 2 văn bản thuộc loại:";
				break;
			case "author":
				text = "Tìm 2 văn bản được ban hành bởi:";
				break;
			case "field":
				text = "Tìm 2 văn bản thuộc lĩnh vực:";
				break;
		}

		const question = {
			type: selectedType,
			text,
			correctAnswers,
			wrongAttempts: 0,
		};

		console.log("Generated question:", question);
		setCurrentQuestion(question);
		setWrongAttempts(0);
		setTimeLeft(15);
	};

	const updateDocumentPositions = () => {
		if (!playZoneRef.current) return;

		const { width } = playZoneRef.current.getBoundingClientRect();
		const docSize = 300;

		setDocuments((prevDocs) => {
			return prevDocs.map((doc) => {
				let newX = doc.x + doc.dx;

				// Kiểm tra hướng di chuyển và wrap position
				if (doc.dx > 0 && newX > width) {
					// Di chuyển sang phải
					newX = -docSize;
				} else if (doc.dx < 0 && newX < -docSize) {
					// Di chuyển sang trái
					newX = width;
				}

				return {
					...doc,
					x: newX,
					y: doc.y, // Giữ nguyên vị trí Y
				};
			});
		});

		animationFrameRef.current = requestAnimationFrame(updateDocumentPositions);
	};

	useEffect(() => {
		if (!gameOver) {
			animationFrameRef.current = requestAnimationFrame(
				updateDocumentPositions
			);
		}
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [gameOver]);

	useEffect(() => {
		if (!gameOver && currentQuestion) {
			const interval = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						handleTimeUp(currentQuestion);
						return 15;
					}
					if (prev <= 5 && prev > 1) {
						new Audio(tickSound)
							.play()
							.catch((err) => console.error("Error playing sound:", err));
					}
					return prev - 1;
				});
			}, 1000);

			return () => clearInterval(interval);
		}
	}, [gameOver, currentQuestion]);

	const handleTimeUp = (question: Question) => {
		setQuestionCount((prev) => {
			const newCount = prev + 1;
			if (newCount >= 5) {
				setGameOver(true);
				return prev;
			}
			const { width, height } =
				playZoneRef.current?.getBoundingClientRect() || { width: 0, height: 0 };
			const newDocs = generateGameDocuments(documents, width, height);
			setDocuments(newDocs);
			generateNewQuestion(newDocs);
			return newCount;
		});
	};

	const handleDocumentClick = (clickedDoc: Document) => {
		if (!currentQuestion) return;

		const isCorrect = currentQuestion.correctAnswers.includes(
			clickedDoc[currentQuestion.type]
		);

		if (!isCorrect) {
			// Tăng số lần click sai
			const newWrongAttempts = wrongAttempts + 1;
			setWrongAttempts(newWrongAttempts);

			// Tăng tốc độ mỗi lần sai, nhưng chỉ tăng tối đa 3 lần
			if (newWrongAttempts <= 3) {
				setDocuments((prev) =>
					prev.map((doc) => {
						const speedMultiplier = 1.5;
						const newSpeed = doc.speed * speedMultiplier;
						return {
							...doc,
							speed: newSpeed,
							dx: Math.sign(doc.dx) * newSpeed,
						};
					})
				);
			}

			// Trừ điểm khi click sai (4 điểm)
			setScore((prev) => Math.max(0, prev - 4));

			new Audio(wrongSound)
				.play()
				.catch((err) => console.error("Error playing sound:", err));
			return;
		}

		// Kiểm tra xem văn bản này đã được chọn chưa
		if (selectedCorrectDocs.includes(clickedDoc.id)) {
			return; // Nếu đã chọn rồi thì không làm gì cả
		}

		// Xử lý khi chọn đúng
		new Audio(correctSound)
			.play()
			.catch((err) => console.error("Error playing sound:", err));

		// Cộng 2 điểm khi click đúng
		setScore((prev) => prev + 2);
		setCorrectCount((prev) => prev + 1);

		// Thêm văn bản vào danh sách đã chọn
		const newSelectedDocs = [...selectedCorrectDocs, clickedDoc.id];
		setSelectedCorrectDocs(newSelectedDocs);

		// Đánh dấu văn bản đã được chọn và ẩn nó đi
		setDocuments((prev) =>
			prev.map((doc) =>
				doc.id === clickedDoc.id
					? { ...doc, selected: true, hidden: true }
					: doc
			)
		);

		// Nếu đã chọn đủ 2 văn bản đúng, chuyển câu mới
		if (newSelectedDocs.length === 2) {
			setSelectedCorrectDocs([]);
			handleNextQuestion();
		}
	};

	const handleNextQuestion = () => {
		setQuestionCount((prev) => {
			const newCount = prev + 1;
			if (newCount >= 5) {
				setGameOver(true);
				new Audio(endSound)
					.play()
					.catch((err) => console.error("Error playing sound:", err));
				return prev;
			}
			const { width, height } =
				playZoneRef.current?.getBoundingClientRect() || {
					width: 0,
					height: 0,
				};
			const newDocs = generateGameDocuments(documents, width, height);
			setDocuments(newDocs);
			generateNewQuestion(newDocs);
			return newCount;
		});
	};

	return (
		<div
			className="relative w-full h-screen overflow-hidden"
			style={{
				backgroundImage: "url('/game/game5/gameplay.png')",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			{!gameOver ? (
				<>
					<div
						ref={playZoneRef}
						className="w-full h-full pt-16 px-32 relative overflow-hidden"
					>
						<AnimatePresence>
							{documents.map((doc) => {
								if (doc.hidden) return null; // Không render văn bản đã ẩn

								const containerRect =
									playZoneRef.current?.getBoundingClientRect() || {
										width: 0,
										height: 0,
									};
								const { width } = containerRect;

								return (
									<motion.div
										key={doc.id}
										initial={{
											x: doc.dx > 0 ? -500 : width,
											y: doc.y,
											opacity: 1,
										}}
										animate={{
											x: doc.x,
											y: doc.y,
											opacity: 1, // Luôn giữ opacity là 1
										}}
										exit={{ opacity: 0 }}
										transition={{
											duration: 0,
											ease: "linear",
										}}
										className="absolute cursor-pointer"
										style={{
											transform: `translate(-50%, -50%)`,
											willChange: "transform",
										}}
										onClick={() => handleDocumentClick(doc)}
									>
										<div
											className={`relative inline-block ${
												doc.selected
													? "border-4 border-green-500 bg-green-500/10"
													: ""
											}`}
										>
											<img
												src={doc.imageUrl}
												alt={doc.title}
												className="w-auto h-[500px] object-contain hover:scale-102 transition-transform"
												style={{
													filter: doc.selected
														? "drop-shadow(0 0 10px rgba(34,197,94,0.5))"
														: "drop-shadow(0 0 2px rgba(255,255,255,0.2))",
													transform: `scale(1)`,
													padding: "0",
													margin: "0",
												}}
											/>
										</div>
									</motion.div>
								);
							})}
						</AnimatePresence>
					</div>

					{/* Timer, Score và Mission */}
					<div className="absolute top-4 left-4 flex items-center gap-4">
						{/* Timer */}
						<div className="relative">
							<div className="w-[72px] h-[72px] rounded-full border-4 border-orange-900/30 flex items-center justify-center bg-gradient-to-b from-orange-900/40 to-orange-950/40 shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(0,0,0,0.3)]">
								<div className="absolute inset-[6px]">
									<svg className="w-full h-full -rotate-90">
										<circle
											className="text-orange-900/20"
											strokeWidth="4"
											stroke="currentColor"
											fill="transparent"
											r="28"
											cx="30"
											cy="30"
										/>
										<circle
											className="text-orange-500"
											strokeWidth="4"
											strokeDasharray={175}
											strokeDashoffset={175 - (timeLeft / 15) * 175}
											strokeLinecap="round"
											stroke="currentColor"
											fill="transparent"
											r="28"
											cx="30"
											cy="30"
										/>
									</svg>
								</div>
								<div className="relative text-center">
									<div className="text-2xl font-bold text-orange-300 leading-none mb-1">
										{timeLeft}
									</div>
									<div className="text-[10px] text-orange-400/60 uppercase tracking-wider">
										giây
									</div>
								</div>
							</div>
						</div>

						{/* Score */}
						<div className="bg-gradient-to-b from-orange-900/40 to-orange-950/40 px-5 py-3 rounded-xl border border-orange-900/30 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
							<div className="text-[10px] text-orange-400/60 uppercase tracking-wider mb-1">
								Câu hỏi
							</div>
							<div className="text-2xl font-bold text-orange-300">
								{questionCount + 1}/5
							</div>
						</div>

						{/* Mission */}
						<div className="bg-gradient-to-b from-orange-900/40 to-orange-950/40 px-5 py-3 rounded-xl border border-orange-900/30 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
							<div className="text-[10px] text-orange-400/60 uppercase tracking-wider mb-1">
								NHIỆM VỤ CỦA BẠN
							</div>
							<div className="flex items-center gap-2">
								<div className="text-orange-300 font-medium">
									Tìm 2 văn bản thuộc{" "}
									{currentQuestion?.type === "type"
										? "loại"
										: currentQuestion?.type === "field"
										? "lĩnh vực"
										: "tác giả"}
									:
								</div>
								<div className="text-orange-400 font-bold">
									{currentQuestion?.correctAnswers[0]}
								</div>
							</div>
						</div>
					</div>

					{/* Settings Menu */}
					<div className="absolute top-4 right-4">
						<button
							onClick={() => setShowSettings(!showSettings)}
							className="w-11 h-11 rounded-full bg-gradient-to-b from-orange-900/40 to-orange-950/40 hover:from-orange-800/40 hover:to-orange-900/40 text-orange-400 flex items-center justify-center transition-all border border-orange-900/30 shadow-lg"
						>
							<FaCog
								className={`transition-transform duration-300 ${
									showSettings ? "rotate-180" : ""
								}`}
							/>
						</button>

						{showSettings && (
							<div className="absolute top-full right-0 mt-2 bg-gradient-to-b from-orange-900/40 to-orange-950/40 rounded-xl border border-orange-900/30 p-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.3)] z-30 min-w-[160px]">
								<button
									onClick={() => {
										navigate("/");
										setShowSettings(false);
									}}
									className="w-full px-4 py-2.5 bg-orange-900/40 hover:bg-orange-800/40 text-orange-200 rounded-lg transition-all flex items-center gap-2 text-sm font-medium mb-2"
								>
									<FaHome /> Trang chủ
								</button>
								<button
									onClick={() => {
										navigate(-1);
										setShowSettings(false);
									}}
									className="w-full px-4 py-2.5 bg-orange-900/40 hover:bg-orange-800/40 text-orange-200 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
								>
									<FaArrowLeft /> Quay lại
								</button>
							</div>
						)}
					</div>
				</>
			) : (
				<Conclusion5
					timeUsed={75 - timeLeft}
					correctClicks={correctCount}
					wrongClicks={wrongAttempts}
					totalQuestions={5}
				/>
			)}
		</div>
	);
}
