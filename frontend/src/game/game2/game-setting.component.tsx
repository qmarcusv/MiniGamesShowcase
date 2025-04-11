import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	FaArrowLeft,
	FaSave,
	FaPlus,
	FaTrash,
	FaEdit,
	FaQuestion,
} from "react-icons/fa";

interface Question {
	id: string;
	text: string;
	answers: string[];
	correctAnswer: number;
	explanation: string;
	difficulty: number;
}

export default function Game2Setting() {
	const navigate = useNavigate();
	const [questions, setQuestions] = useState<Question[]>([
		{
			id: "1",
			text: "Thủ đô của Việt Nam là gì?",
			answers: ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Huế"],
			correctAnswer: 0,
			explanation: "Hà Nội là thủ đô của Việt Nam từ năm 1945",
			difficulty: 1,
		},
		{
			id: "2",
			text: "Quốc kỳ Việt Nam có màu gì?",
			answers: ["Xanh", "Đỏ và vàng", "Trắng", "Tím"],
			correctAnswer: 1,
			explanation: "Quốc kỳ Việt Nam có nền đỏ và ngôi sao vàng ở giữa",
			difficulty: 2,
		},
	]);
	const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState<Question>({
		id: "",
		text: "",
		answers: ["", "", "", ""],
		correctAnswer: 0,
		explanation: "",
		difficulty: 1,
	});

	const handleBack = () => {
		if (
			window.confirm(
				"Bạn có chắc muốn quay lại? Các thay đổi chưa lưu sẽ bị mất."
			)
		) {
			navigate(-1);
		}
	};

	const handleSave = () => {
		// Trong thực tế, đây sẽ là API call để lưu vào database
		console.log("Đã lưu danh sách câu hỏi:", questions);
		alert("Đã lưu thành công!");
	};

	const handleAdd = () => {
		setEditingQuestion(null);
		setFormData({
			id: (questions.length + 1).toString(),
			text: "",
			answers: ["", "", "", ""],
			correctAnswer: 0,
			explanation: "",
			difficulty: 1,
		});
		setShowForm(true);
	};

	const handleEdit = (question: Question) => {
		setEditingQuestion(question);
		setFormData(question);
		setShowForm(true);
	};

	const handleDelete = (id: string) => {
		if (window.confirm("Bạn có chắc muốn xóa câu hỏi này?")) {
			setQuestions(questions.filter((q) => q.id !== id));
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.text.trim()) {
			alert("Vui lòng nhập nội dung câu hỏi!");
			return;
		}

		if (editingQuestion) {
			setQuestions(
				questions.map((q) => (q.id === editingQuestion.id ? formData : q))
			);
		} else {
			setQuestions([...questions, formData]);
		}

		setShowForm(false);
		setEditingQuestion(null);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
			{/* Header */}
			<div className="bg-black/40 border-b border-white/20 shadow-lg">
				<div className="max-w-6xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<button
							onClick={handleBack}
							className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
						>
							<FaArrowLeft /> Quay lại
						</button>
						<h1 className="text-2xl font-bold text-center bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
							Cài đặt câu hỏi Game 2
						</h1>
						<button
							onClick={handleSave}
							className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-all"
						>
							<FaSave /> Lưu thay đổi
						</button>
					</div>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-4 py-8">
				{/* Hướng dẫn */}
				<div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-4 mb-8">
					<div className="flex items-start gap-3">
						<FaQuestion className="text-emerald-400 text-xl mt-1" />
						<div>
							<h3 className="font-semibold text-emerald-400 mb-2">Hướng dẫn</h3>
							<ul className="list-disc list-inside space-y-1 text-sm text-emerald-100">
								<li>Thêm câu hỏi mới bằng nút "Thêm câu hỏi"</li>
								<li>Chỉnh sửa câu hỏi bằng cách nhấn vào biểu tượng bút chì</li>
								<li>Xóa câu hỏi bằng cách nhấn vào biểu tượng thùng rác</li>
								<li>Nhớ nhấn "Lưu thay đổi" sau khi hoàn tất</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Danh sách câu hỏi */}
				<div className="bg-white/10 border-2 border-emerald-500/30 rounded-lg p-6 backdrop-blur-sm">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-xl font-bold text-emerald-300">
							Danh sách câu hỏi
						</h2>
						<button
							onClick={handleAdd}
							className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-all"
						>
							<FaPlus /> Thêm câu hỏi
						</button>
					</div>
					<div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-500/30 scrollbar-track-transparent">
						{questions.map((question) => (
							<div
								key={question.id}
								className="bg-white/10 p-4 rounded-lg border border-emerald-500/20 hover:border-emerald-500/40 transition-all group"
							>
								<div className="flex justify-between items-start gap-4">
									<div className="flex-1">
										<div className="flex items-start gap-2">
											<span className="text-sm font-medium text-emerald-400 mt-1">
												Câu {question.id}:
											</span>
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<p className="text-white">{question.text}</p>
													<span
														className={`text-xs px-2 py-0.5 rounded ${
															question.difficulty === 1
																? "bg-green-500/20 text-green-300"
																: question.difficulty === 2
																? "bg-yellow-500/20 text-yellow-300"
																: "bg-red-500/20 text-red-300"
														}`}
													>
														Độ khó: {question.difficulty}
													</span>
												</div>
												<div className="mt-2 space-y-1">
													{question.answers.map((answer, idx) => (
														<div
															key={idx}
															className={`text-sm ${
																idx === question.correctAnswer
																	? "text-emerald-400 font-medium"
																	: "text-gray-300"
															}`}
														>
															{idx + 1}. {answer}
														</div>
													))}
												</div>
												<p className="text-xs text-emerald-300/90 mt-2">
													{question.explanation}
												</p>
											</div>
										</div>
									</div>
									<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
										<button
											onClick={() => handleEdit(question)}
											className="p-2 bg-amber-600/30 hover:bg-amber-500/50 rounded-lg transition-all"
											title="Chỉnh sửa"
										>
											<FaEdit />
										</button>
										<button
											onClick={() => handleDelete(question.id)}
											className="p-2 bg-red-600/30 hover:bg-red-500/50 rounded-lg transition-all"
											title="Xóa"
										>
											<FaTrash />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Modal thêm/sửa câu hỏi */}
			{showForm && (
				<div className="fixed inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
					<div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-emerald-500/30 rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto">
						<h2 className="text-xl font-bold text-emerald-300 mb-4">
							{editingQuestion ? "Sửa câu hỏi" : "Thêm câu hỏi mới"}
						</h2>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-emerald-200 mb-1">
									Câu hỏi
								</label>
								<input
									value={formData.text}
									onChange={(e) =>
										setFormData({ ...formData, text: e.target.value })
									}
									className="w-full px-3 py-2 bg-white/10 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500/60"
									placeholder="Nhập câu hỏi..."
									required
								/>
							</div>

							<div className="space-y-3">
								{formData.answers.map((answer, idx) => (
									<div key={idx}>
										<label className="block text-sm font-medium text-emerald-200 mb-1">
											Đáp án {idx + 1}
										</label>
										<input
											value={answer}
											onChange={(e) => {
												const newAnswers = [...formData.answers];
												newAnswers[idx] = e.target.value;
												setFormData({ ...formData, answers: newAnswers });
											}}
											className="w-full px-3 py-2 bg-white/10 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500/60"
											placeholder={`Đáp án ${idx + 1}...`}
											required
										/>
									</div>
								))}
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-emerald-200 mb-1">
										Đáp án đúng
									</label>
									<select
										value={formData.correctAnswer}
										onChange={(e) =>
											setFormData({
												...formData,
												correctAnswer: Number(e.target.value),
											})
										}
										className="w-full px-3 py-2 bg-white/10 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500/60"
									>
										{[1, 2, 3, 4].map((num) => (
											<option
												key={num}
												value={num - 1}
												className="bg-slate-800"
											>
												Đáp án {num}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-emerald-200 mb-1">
										Độ khó
									</label>
									<select
										value={formData.difficulty}
										onChange={(e) =>
											setFormData({
												...formData,
												difficulty: Number(e.target.value),
											})
										}
										className="w-full px-3 py-2 bg-white/10 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500/60"
									>
										<option value={1} className="bg-slate-800">
											Dễ
										</option>
										<option value={2} className="bg-slate-800">
											Trung bình
										</option>
										<option value={3} className="bg-slate-800">
											Khó
										</option>
									</select>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-emerald-200 mb-1">
									Giải thích
								</label>
								<textarea
									value={formData.explanation}
									onChange={(e) =>
										setFormData({ ...formData, explanation: e.target.value })
									}
									className="w-full px-3 py-2 bg-white/10 border border-emerald-500/30 rounded-lg text-white resize-none focus:outline-none focus:border-emerald-500/60"
									placeholder="Giải thích đáp án..."
									rows={2}
									required
								/>
							</div>

							<div className="flex justify-end gap-4 pt-4">
								<button
									type="button"
									onClick={() => setShowForm(false)}
									className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
								>
									Hủy
								</button>
								<button
									type="submit"
									className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-all"
								>
									{editingQuestion ? "Cập nhật" : "Thêm mới"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
