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

  const toggleQuestionMap = (key: keyof Omit<Document, "id" | "mappedQuestions" | "content">) => {
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
    <div className="p-8 max-w-5xl mx-auto text-left bg-gradient-to-b from-purple-50 to-blue-50 h-full rounded-xl shadow-md">
      <h2 className="text-4xl font-extrabold text-purple-700 mb-6 text-center">📄 Cài đặt Tài liệu Bay</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
        <input
          type="text"
          placeholder="📘 Loại tài liệu (type)"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg shadow-sm"
        />
        <input
          type="text"
          placeholder="✍️ Tác giả (author)"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg shadow-sm"
        />
        <input
          type="text"
          placeholder="🏷️ Lĩnh vực (field)"
          value={form.field}
          onChange={(e) => setForm({ ...form, field: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg shadow-sm"
        />
        <input
          type="text"
          placeholder="📝 Nội dung mô tả (content)"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg shadow-sm"
        />
      </div>

      <div className="mb-6">
        <p className="font-semibold text-gray-700 mb-2 text-center">🔍 Trường sẽ dùng làm câu hỏi:</p>
        <div className="flex gap-4 justify-center">
          {(["type", "author", "field"] as const).map((key) => (
            <button
              key={key}
              onClick={() => toggleQuestionMap(key)}
              className={`px-4 py-2 rounded-lg font-medium shadow ${
                form.mappedQuestions.includes(key) ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}>
              {key.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold shadow-md" onClick={handleAddDocument}>
          ➕ Thêm tài liệu
        </button>
      </div>

      <hr className="my-8 border-purple-300" />

      <h3 className="text-2xl font-bold text-gray-800 mb-4">📚 Danh sách tài liệu:</h3>
      <ul className="space-y-4">
        {documents.map((doc, idx) => (
          <li key={doc.id} className="border p-5 rounded-lg bg-white shadow">
            <strong className="block text-lg text-purple-700 mb-2">Tài liệu {idx + 1}</strong>
            <p>
              <strong>Loại:</strong> {doc.type}
            </p>
            <p>
              <strong>Tác giả:</strong> {doc.author}
            </p>
            <p>
              <strong>Lĩnh vực:</strong> {doc.field}
            </p>
            <p>
              <strong>Nội dung:</strong> {doc.content}
            </p>
            <p className="mt-1 text-sm text-gray-500 italic">⤷ Dùng làm câu hỏi: {doc.mappedQuestions.join(", ") || "Không có"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
