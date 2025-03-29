import { useState } from "react";

type Document = {
	id: string;
	type: string;
	author: string;
	field: string;
	content: string;
	mappedQuestions: string[]; // e.g., ['type', 'author']
};

export default function Game5Setting() {
	const [documents, setDocuments] = useState<Document[]>([]);
	const [form, setForm] = useState<Omit<Document, "id">>({
		type: "",
		author: "",
		field: "",
		content: "",
		mappedQuestions: [],
	});

	const handleAddDocument = () => {
		const id = crypto.randomUUID();
		setDocuments([...documents, { ...form, id }]);
		setForm({
			type: "",
			author: "",
			field: "",
			content: "",
			mappedQuestions: [],
		});
	};

	const toggleQuestionMap = (
		key: keyof Omit<Document, "id" | "mappedQuestions" | "content">
	) => {
		setForm((prev) => {
			const updated = [...prev.mappedQuestions];
			if (updated.includes(key)) {
				return { ...prev, mappedQuestions: updated.filter((q) => q !== key) };
			} else {
				return { ...prev, mappedQuestions: [...updated, key] };
			}
		});
	};

	return (
		<div className="p-6 max-w-4xl mx-auto text-center">
			<h2 className="text-3xl font-bold text-purple-700 mb-4">
				Cài đặt Tài liệu Bay
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
				<input
					type="text"
					placeholder="Loại tài liệu (type)"
					value={form.type}
					onChange={(e) => setForm({ ...form, type: e.target.value })}
					className="p-2 border border-gray-300 rounded"
				/>
				<input
					type="text"
					placeholder="Tác giả (author)"
					value={form.author}
					onChange={(e) => setForm({ ...form, author: e.target.value })}
					className="p-2 border border-gray-300 rounded"
				/>
				<input
					type="text"
					placeholder="Lĩnh vực (field)"
					value={form.field}
					onChange={(e) => setForm({ ...form, field: e.target.value })}
					className="p-2 border border-gray-300 rounded"
				/>
				<input
					type="text"
					placeholder="Nội dung mô tả (content)"
					value={form.content}
					onChange={(e) => setForm({ ...form, content: e.target.value })}
					className="p-2 border border-gray-300 rounded"
				/>
			</div>

			<div className="mb-4">
				<p className="font-medium text-gray-600 mb-2">
					Trường sẽ dùng làm câu hỏi:
				</p>
				<div className="flex gap-4 justify-center">
					{["type", "author", "field"].map((key) => (
						<button
							key={key}
							onClick={() => toggleQuestionMap(key as any)}
							className={`px-4 py-2 rounded-lg border ${
								form.mappedQuestions.includes(key)
									? "bg-purple-500 text-white"
									: "bg-gray-100 text-gray-600"
							}`}
						>
							{key}
						</button>
					))}
				</div>
			</div>

			<button
				className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mb-6"
				onClick={handleAddDocument}
			>
				Thêm tài liệu
			</button>

			<hr className="my-4" />

			<h3 className="text-xl font-semibold mb-3">Danh sách tài liệu:</h3>
			<ul className="space-y-2 text-left">
				{documents.map((doc, idx) => (
					<li key={doc.id} className="border p-4 rounded bg-gray-50">
						<strong>Tài liệu {idx + 1}</strong>
						<div>Loại: {doc.type}</div>
						<div>Tác giả: {doc.author}</div>
						<div>Lĩnh vực: {doc.field}</div>
						<div>Nội dung: {doc.content}</div>
						<div className="mt-1 text-sm text-gray-500">
							⤷ Câu hỏi: {doc.mappedQuestions.join(", ")}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
