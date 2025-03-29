import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import {
	CircularProgressbarWithChildren,
	buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const sampleDocs = [
	{
		type: "Notice",
		author: "Health Ministry",
		field: "Law",
		content: "Important notice about health measures.",
	},
	{
		type: "Circular",
		author: "Transport Authority",
		field: "Health",
		content: "Notice about traffic law changes.",
	},
	{
		type: "Report",
		author: "Education Dept",
		field: "Law",
		content: "Waste management guidelines update.",
	},
	{
		type: "Report",
		author: "Transport Authority",
		field: "Health",
		content: "Proposal on scientific research in schools.",
	},
	{
		type: "Circular",
		author: "Education Dept",
		field: "Science",
		content: "Waste management guidelines.",
	},
];

const fields = ["author", "type", "field"];
const generateQuestion = (docs: DocField[]) => {
	const doc = docs[Math.floor(Math.random() * docs.length)];
	const field = fields[
		Math.floor(Math.random() * fields.length)
	] as keyof DocField;
	const value = doc[field];
	const correctCount = docs.filter((d) => d[field] === value).length;
	return {
		field,
		value,
		correctCount,
		label: `${field.toUpperCase()}: ${value}`,
	};
};

type DocField = {
	type: string;
	author: string;
	field: string;
	content: string;
};

type Doc = DocField & {
	id: string;
	x: number;
	y: number;
	direction: "horizontal" | "vertical" | "diagonal";
};

export default function Game5() {
	const startTimeRef = useRef(Date.now());
	const [endTime, setEndTime] = useState<number | null>(null);
	const [totalAnswers, setTotalAnswers] = useState(0);
	const [correctAnswers, setCorrectAnswers] = useState(0);
	const [section, setSection] = useState(1);
	const [docs, setDocs] = useState<Doc[]>([]);
	const [question, setQuestion] = useState<{
		field: keyof Doc;
		value: string;
		correctCount: number;
		label: string;
	} | null>(null);
	const [score, setScore] = useState(0);
	const [timer, setTimer] = useState(10);
	const [speed, setSpeed] = useState(1);

	const correctRef = useRef<HTMLAudioElement>(null);
	const wrongRef = useRef<HTMLAudioElement>(null);

	useEffect(() => {
		if (section > 5) return;

		const newDocs = Array.from({ length: 5 }, () => {
			const doc = sampleDocs[Math.floor(Math.random() * sampleDocs.length)];
			return {
				...doc,
				id: uuidv4(),
				x: Math.random() * window.innerWidth,
				y: 120 + Math.random() * (window.innerHeight - 150),
				direction: ["horizontal", "vertical", "diagonal"][
					Math.floor(Math.random() * 3)
				] as "horizontal" | "vertical" | "diagonal",
			};
		});

		const q = generateQuestion(newDocs);
		setQuestion(q);
		setScore(0);
		setTimer(10);
		setDocs(newDocs);
		setSpeed(1); // ✅ Reset speed every new section
	}, [section]);

	useEffect(() => {
		if (section > 5) return;
		if (timer === 0) {
			if (section === 5 && endTime === null) {
				setEndTime(Date.now());
			}
			setSection((prev) => prev + 1);
		}

		const id = setTimeout(() => setTimer((t) => t - 1), 1000);
		return () => clearTimeout(id);
	}, [section, timer, endTime]);

	const handleClick = (doc: Doc) => {
		if (!question || !question.field || !question.value) return;

		setTotalAnswers((t) => t + 1);
		const match = doc[question.field] === question.value;
		if (match) {
			setCorrectAnswers((c) => c + 1);
			correctRef.current?.play();
			const newScore = score + 1;

			if (newScore >= question.correctCount) {
				setSection((s) => s + 1);
				setScore(0);
			} else {
				setScore(newScore);
			}

			setDocs((prev) => prev.filter((d) => d.id !== doc.id));
		} else {
			wrongRef.current?.play();
			setSpeed((s) => s + 2);
		}
	};

	const updatePosition = (doc: Doc) => {
		const newDoc = { ...doc };
		if (doc.direction === "horizontal") {
			newDoc.x += 3 * speed;
			if (newDoc.x > window.innerWidth + 200) newDoc.x = -200;
		} else if (doc.direction === "vertical") {
			newDoc.y += 3 * speed;
			if (newDoc.y > window.innerHeight + 300) newDoc.y = -300;
		} else {
			newDoc.x += 1 * speed;
			newDoc.y += 1 * speed;
			if (newDoc.x > window.innerWidth + 200) newDoc.x = -200;
			if (newDoc.y > window.innerHeight + 300) newDoc.y = -300;
		}
		return newDoc;
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setDocs((prev) => prev.map(updatePosition));
		}, 30);
		return () => clearInterval(interval);
	}, [speed]);

	if (section > 5) {
		return (
			<div className="p-10 text-center">
				<div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto">
					<h2 className="text-xl font-semibold mb-4">Tổng kết</h2>
					<p>
						⏱️ Thời gian chơi:{" "}
						{Math.round(
							((endTime ?? Date.now()) - startTimeRef.current) / 1000
						)}{" "}
						giây
					</p>
					<p>
						🎯 Độ chính xác:{" "}
						{totalAnswers === 0
							? 0
							: Math.round((correctAnswers / totalAnswers) * 100)}
						%
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="relative w-full h-screen bg-gradient-to-b from-blue-50 to-blue-100 overflow-hidden">
			<div className="flex justify-between items-center px-6 py-4 bg-white shadow-md z-50 relative">
				<h1 className="text-xl font-bold text-blue-600">
					Câu {section}: {question?.label} (Correct: {score}/
					{question?.correctCount})
				</h1>
				<div className="w-12 h-12">
					<CircularProgressbarWithChildren
						value={(timer / 10) * 100}
						styles={buildStyles({
							pathColor: timer <= 3 ? "red" : "#3b82f6",
							trailColor: "#eee",
						})}
					>
						<div
							className={`text-sm font-bold ${
								timer <= 3 ? "text-red-600" : "text-blue-600"
							}`}
						>
							{timer}s
						</div>
					</CircularProgressbarWithChildren>
				</div>
			</div>

			{docs.map((doc) => (
				<motion.div
					key={doc.id}
					onClick={() => handleClick(doc)}
					className="absolute w-64 h-80 p-4 bg-white rounded-lg shadow-md border text-sm cursor-pointer hover:scale-105 transition"
					style={{ top: doc.y, left: doc.x }}
				>
					<p>
						<strong>Type:</strong> {doc.type}
					</p>
					<p>
						<strong>Author:</strong> {doc.author}
					</p>
					<p>
						<strong>Field:</strong> {doc.field}
					</p>
					<p className="mt-2 italic text-gray-500">{doc.content}</p>
				</motion.div>
			))}

			<audio ref={correctRef} src="/sounds/correct.mp3" preload="auto" />
			<audio ref={wrongRef} src="/sounds/wrong.mp3" preload="auto" />
		</div>
	);
}
