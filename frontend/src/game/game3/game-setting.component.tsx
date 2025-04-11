import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	FaArrowLeft,
	FaSave,
	FaPlus,
	FaTrash,
	FaEdit,
	FaQuestion,
	FaStar,
} from "react-icons/fa";

interface Word {
	id: string;
	text: string;
	hint: string;
	difficulty: number;
}

export default function Game3Setting() {
	const navigate = useNavigate();
	const [words, setWords] = useState<Word[]>([
		{ id: "1", text: "Hello", hint: "Lời chào phổ biến nhất", difficulty: 1 },
		{ id: "2", text: "World", hint: "Từ thường đi với Hello", difficulty: 1 },
		{
			id: "3",
			text: "Programming",
			hint: "Viết code cho máy tính",
			difficulty: 2,
		},
		{
			id: "4",
			text: "JavaScript",
			hint: "Ngôn ngữ lập trình web phổ biến",
			difficulty: 2,
		},
		{
			id: "5",
			text: "Algorithm",
			hint: "Thuật toán xử lý vấn đề",
			difficulty: 3,
		},
	]);
	const [editingWord, setEditingWord] = useState<Word | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState<Word>({
		id: "",
		text: "",
		hint: "",
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
		console.log("Đã lưu danh sách từ:", words);
		alert("Đã lưu thành công!");
	};

	const handleAdd = () => {
		setEditingWord(null);
		setFormData({
			id: (words.length + 1).toString(),
			text: "",
			hint: "",
			difficulty: 1,
		});
		setShowForm(true);
	};

	const handleEdit = (word: Word) => {
		setEditingWord(word);
		setFormData(word);
		setShowForm(true);
	};

	const handleDelete = (id: string) => {
		if (window.confirm("Bạn có chắc muốn xóa từ này?")) {
			setWords(words.filter((w) => w.id !== id));
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.text.trim()) {
			alert("Vui lòng nhập từ!");
			return;
		}

		if (editingWord) {
			setWords(words.map((w) => (w.id === editingWord.id ? formData : w)));
		} else {
			setWords([...words, formData]);
		}

		setShowForm(false);
		setEditingWord(null);
	};

	const getDifficultyStars = (difficulty: number) => {
		return Array(difficulty)
			.fill(0)
			.map((_, i) => (
				<FaStar key={i} className="text-yellow-400 inline-block" />
			));
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
							Cài đặt từ vựng Game 3
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
								<li>Thêm từ mới bằng nút "Thêm từ"</li>
								<li>Chỉnh sửa từ bằng cách nhấn vào biểu tượng bút chì</li>
								<li>Xóa từ bằng cách nhấn vào biểu tượng thùng rác</li>
								<li>Độ khó được biểu thị bằng số sao (1-3 sao)</li>
								<li>Nhớ nhấn "Lưu thay đổi" sau khi hoàn tất</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Danh sách từ */}
				<div className="bg-white/10 border-2 border-emerald-500/30 rounded-lg p-6 backdrop-blur-sm">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-xl font-bold text-emerald-300">
							Danh sách từ vựng
						</h2>
						<button
							onClick={handleAdd}
							className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-all"
						>
							<FaPlus /> Thêm từ
						</button>
					</div>
					<div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-500/30 scrollbar-track-transparent">
						{words.map((word) => (
							<div
								key={word.id}
								className="bg-white/10 p-4 rounded-lg border border-emerald-500/20 hover:border-emerald-500/40 transition-all group"
							>
								<div className="flex justify-between items-center">
									<div>
										<p className="text-lg font-medium text-white">
											{word.text}
										</p>
										<div className="mt-1 text-sm text-emerald-400">
											{getDifficultyStars(word.difficulty)}
										</div>
									</div>
									<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
										<button
											onClick={() => handleEdit(word)}
											className="p-2 bg-amber-600/30 hover:bg-amber-500/50 rounded-lg transition-all"
											title="Chỉnh sửa"
										>
											<FaEdit />
										</button>
										<button
											onClick={() => handleDelete(word.id)}
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

			{/* Modal thêm/sửa từ */}
			{showForm && (
				<div className="fixed inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
					<div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-emerald-500/30 rounded-lg p-6 w-[400px]">
						<h2 className="text-xl font-bold text-emerald-300 mb-4">
							{editingWord ? "Sửa từ" : "Thêm từ mới"}
						</h2>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-emerald-200 mb-1">
									Từ
								</label>
								<input
									value={formData.text}
									onChange={(e) =>
										setFormData({ ...formData, text: e.target.value })
									}
									className="w-full px-3 py-2 bg-white/10 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500/60"
									placeholder="Nhập từ..."
									required
								/>
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
										Dễ (⭐)
									</option>
									<option value={2} className="bg-slate-800">
										Trung bình (⭐⭐)
									</option>
									<option value={3} className="bg-slate-800">
										Khó (⭐⭐⭐)
									</option>
								</select>
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
									{editingWord ? "Cập nhật" : "Thêm mới"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
