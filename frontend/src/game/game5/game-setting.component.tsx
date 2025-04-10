import { useState, useRef } from "react";
import {
	FaUpload,
	FaSave,
	FaTrash,
	FaEdit,
	FaPlus,
	FaFileAlt,
	FaCheck,
	FaTimes,
} from "react-icons/fa";

interface Document {
	id: string;
	imageUrl: string;
	author: string;
	type: string;
	field: string;
	title: string;
}

const documentTypes = [
	"Công văn",
	"Biên bản",
	"Thông tư",
	"Đơn từ",
	"Quyết định",
	"Báo cáo",
	"Kế hoạch",
	"Tờ trình",
];

const documentFields = [
	"Giáo dục",
	"Y tế",
	"Tài nguyên môi trường",
	"Luật pháp",
	"Hình sự",
	"Dân sự",
	"Hành chính",
	"Kinh tế",
];

export default function GameSetting5() {
	const [documents, setDocuments] = useState<Document[]>([]);
	const [selectedDocument, setSelectedDocument] = useState<Document | null>(
		null
	);
	const [isEditing, setIsEditing] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Kiểm tra kích thước file (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			alert("File quá lớn. Vui lòng chọn file nhỏ hơn 5MB");
			return;
		}

		// Kiểm tra loại file
		if (!file.type.startsWith("image/")) {
			alert("Vui lòng chọn file hình ảnh");
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			const newDocument: Document = {
				id: Date.now().toString(),
				imageUrl: reader.result as string,
				author: "",
				type: documentTypes[0],
				field: documentFields[0],
				title: "",
			};
			setDocuments((prev) => [...prev, newDocument]);
			setSelectedDocument(newDocument);
			setIsEditing(true);
		};
		reader.readAsDataURL(file);
	};

	const handleSave = () => {
		if (!selectedDocument) return;

		if (isEditing) {
			setDocuments((prev) =>
				prev.map((doc) =>
					doc.id === selectedDocument.id ? selectedDocument : doc
				)
			);
		}
		setIsEditing(false);

		// Lưu vào localStorage
		localStorage.setItem("game5-documents", JSON.stringify(documents));
	};

	const handleDelete = (id: string) => {
		setDocuments((prev) => prev.filter((doc) => doc.id !== id));
		setSelectedDocument(null);
		setIsEditing(false);
		localStorage.setItem(
			"game5-documents",
			JSON.stringify(documents.filter((doc) => doc.id !== id))
		);
	};

	return (
		<div className="min-h-screen bg-[#1a1a1a] text-gray-100 p-6">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold text-amber-400 mb-8 flex items-center gap-3">
					<FaFileAlt /> Quản lý tài liệu
				</h1>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Danh sách tài liệu */}
					<div className="bg-[#2a2a2a] rounded-lg p-4 h-[calc(100vh-200px)] overflow-y-auto">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-semibold text-amber-300">Tài liệu</h2>
							<button
								onClick={() => fileInputRef.current?.click()}
								className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
							>
								<FaPlus /> Thêm
							</button>
							<input
								type="file"
								ref={fileInputRef}
								onChange={handleFileUpload}
								accept="image/*"
								className="hidden"
							/>
						</div>

						<div className="space-y-3">
							{documents.map((doc) => (
								<div
									key={doc.id}
									className={`p-3 rounded-lg cursor-pointer transition-all ${
										selectedDocument?.id === doc.id
											? "bg-amber-600/30 border border-amber-500"
											: "bg-[#333] hover:bg-[#444]"
									}`}
									onClick={() => {
										setSelectedDocument(doc);
										setIsEditing(false);
									}}
								>
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<h3 className="font-medium text-amber-200">
												{doc.title || "Chưa đặt tên"}
											</h3>
											<p className="text-sm text-gray-400">{doc.type}</p>
										</div>
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleDelete(doc.id);
											}}
											className="text-red-400 hover:text-red-300"
										>
											<FaTrash />
										</button>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Chi tiết tài liệu */}
					<div className="lg:col-span-2">
						{selectedDocument ? (
							<div className="bg-[#2a2a2a] rounded-lg p-6">
								<div className="flex justify-between items-start mb-6">
									<h2 className="text-xl font-semibold text-amber-300">
										Chi tiết tài liệu
									</h2>
									<div className="flex gap-2">
										{isEditing ? (
											<>
												<button
													onClick={handleSave}
													className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
												>
													<FaCheck /> Lưu
												</button>
												<button
													onClick={() => {
														setIsEditing(false);
														setSelectedDocument(
															documents.find(
																(doc) => doc.id === selectedDocument.id
															) || null
														);
													}}
													className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
												>
													<FaTimes /> Hủy
												</button>
											</>
										) : (
											<button
												onClick={() => setIsEditing(true)}
												className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
											>
												<FaEdit /> Sửa
											</button>
										)}
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<img
											src={selectedDocument.imageUrl}
											alt="Document preview"
											className="w-full h-auto rounded-lg border-2 border-amber-600/30"
										/>
									</div>

									<div className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-amber-300 mb-1">
												Tiêu đề
											</label>
											<input
												type="text"
												value={selectedDocument.title}
												onChange={(e) =>
													setSelectedDocument({
														...selectedDocument,
														title: e.target.value,
													})
												}
												disabled={!isEditing}
												className="w-full bg-[#333] border border-amber-600/30 rounded-lg px-3 py-2 text-gray-100 disabled:opacity-50"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-amber-300 mb-1">
												Tác giả/Đơn vị ban hành
											</label>
											<input
												type="text"
												value={selectedDocument.author}
												onChange={(e) =>
													setSelectedDocument({
														...selectedDocument,
														author: e.target.value,
													})
												}
												disabled={!isEditing}
												className="w-full bg-[#333] border border-amber-600/30 rounded-lg px-3 py-2 text-gray-100 disabled:opacity-50"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-amber-300 mb-1">
												Loại văn bản
											</label>
											<select
												value={selectedDocument.type}
												onChange={(e) =>
													setSelectedDocument({
														...selectedDocument,
														type: e.target.value,
													})
												}
												disabled={!isEditing}
												className="w-full bg-[#333] border border-amber-600/30 rounded-lg px-3 py-2 text-gray-100 disabled:opacity-50"
											>
												{documentTypes.map((type) => (
													<option key={type} value={type}>
														{type}
													</option>
												))}
											</select>
										</div>

										<div>
											<label className="block text-sm font-medium text-amber-300 mb-1">
												Lĩnh vực
											</label>
											<select
												value={selectedDocument.field}
												onChange={(e) =>
													setSelectedDocument({
														...selectedDocument,
														field: e.target.value,
													})
												}
												disabled={!isEditing}
												className="w-full bg-[#333] border border-amber-600/30 rounded-lg px-3 py-2 text-gray-100 disabled:opacity-50"
											>
												{documentFields.map((field) => (
													<option key={field} value={field}>
														{field}
													</option>
												))}
											</select>
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className="bg-[#2a2a2a] rounded-lg p-6 flex flex-col items-center justify-center h-full">
								<FaFileAlt className="text-6xl text-amber-600/30 mb-4" />
								<p className="text-gray-400">
									Chọn một tài liệu hoặc thêm tài liệu mới
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
