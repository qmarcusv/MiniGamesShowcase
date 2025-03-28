import { useState } from "react";

export default function GameSetting() {
  const [questions, setQuestions] = useState([
    {
      question: "Thủ đô của Việt Nam là gì?",
      responses: ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Huế"],
      result: 0,
      explanation: "Thủ đô của Việt Nam là Hà Nội – trung tâm chính trị, văn hóa và giáo dục.",
    },
    {
      question: "Quốc kỳ Việt Nam có màu gì?",
      responses: ["Xanh", "Đỏ và Vàng", "Trắng", "Tím"],
      result: 1,
      explanation: "Quốc kỳ Việt Nam có nền đỏ với ngôi sao vàng tượng trưng cho cách mạng và đoàn kết dân tộc.",
    },
  ]);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const [newQuestion, setNewQuestion] = useState({
    question: "",
    responses: ["", "", "", ""],
    result: 0,
    explanation: "",
  });

  const toggleUpdate = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const updateField = (index: number, field: keyof (typeof questions)[0], value: any) => {
    const updated = [...questions];
    (updated[index] as any)[field] = value;
    setQuestions(updated);
  };

  const updateResponse = (qIndex: number, rIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].responses[rIndex] = value;
    setQuestions(updated);
  };

  const deleteQuestion = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const addQuestion = () => {
    if (!newQuestion.question.trim()) return;
    setQuestions([newQuestion, ...questions]);
    setNewQuestion({
      question: "",
      responses: ["", "", "", ""],
      result: 0,
      explanation: "",
    });
    setShowNewForm(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-left">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Cài đặt câu hỏi</h1>

      {/* Toggle Add Form Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowNewForm((prev) => !prev)}
          className={`px-4 py-2 rounded font-semibold ${
            showNewForm ? "bg-gray-500 text-white hover:bg-gray-600" : "bg-green-600 text-white hover:bg-green-700"
          }`}>
          {showNewForm ? "✖ Đóng biểu mẫu" : "➕ Thêm câu hỏi"}
        </button>
      </div>

      {/* Add New Question Form */}
      {showNewForm && (
        <div className="mb-8 border border-green-300 p-4 rounded-md bg-green-50">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Thêm câu hỏi mới</h2>

          <input
            className="block border px-2 py-1 w-full mb-2"
            placeholder="Câu hỏi"
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
          />

          {newQuestion.responses.map((res, index) => (
            <input
              key={index}
              className="block border px-2 py-1 w-full mb-1"
              placeholder={`Đáp án ${index + 1}`}
              value={res}
              onChange={(e) => {
                const updated = [...newQuestion.responses];
                updated[index] = e.target.value;
                setNewQuestion({ ...newQuestion, responses: updated });
              }}
            />
          ))}

          <input
            type="number"
            min={0}
            max={3}
            className="block border px-2 py-1 w-20 mb-2"
            placeholder="Kết quả đúng"
            value={newQuestion.result}
            onChange={(e) => setNewQuestion({ ...newQuestion, result: Number(e.target.value) })}
          />

          <textarea
            rows={2}
            className="block border px-2 py-1 w-full mb-4"
            placeholder="Giải thích"
            value={newQuestion.explanation}
            onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
          />

          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={addQuestion}>
            ✔ Lưu câu hỏi
          </button>
        </div>
      )}

      {/* List of Questions */}
      {questions.map((q, index) => (
        <div key={index} className="mb-4 border border-gray-300 p-4 rounded-md bg-white">
          <div className="flex justify-between items-start">
            <p className="font-semibold text-gray-800">
              Câu {index + 1}: {q.question}
            </p>
            <div className="flex gap-2">
              <button onClick={() => deleteQuestion(index)} className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                Xóa
              </button>
              <button onClick={() => toggleUpdate(index)} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                {expandedIndex === index ? "Đóng" : "Cập nhật"}
              </button>
            </div>
          </div>

          {expandedIndex === index && (
            <div className="mt-4 border-t pt-4">
              <label className="font-semibold">Câu hỏi:</label>
              <input
                className="block border px-2 py-1 w-full mt-1 mb-2"
                value={q.question}
                onChange={(e) => updateField(index, "question", e.target.value)}
              />

              <label className="font-semibold">Đáp án:</label>
              {q.responses.map((res, rIndex) => (
                <input
                  key={rIndex}
                  className="block border px-2 py-1 w-full mt-1 mb-1"
                  value={res}
                  onChange={(e) => updateResponse(index, rIndex, e.target.value)}
                />
              ))}

              <label className="font-semibold">Đáp án đúng (0-3):</label>
              <input
                type="number"
                min={0}
                max={3}
                className="block border px-2 py-1 w-20 mt-1 mb-2"
                value={q.result}
                onChange={(e) => updateField(index, "result", Number(e.target.value))}
              />

              <label className="font-semibold">Giải thích:</label>
              <textarea
                className="block border px-2 py-1 w-full mt-1"
                rows={2}
                value={q.explanation}
                onChange={(e) => updateField(index, "explanation", e.target.value)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
