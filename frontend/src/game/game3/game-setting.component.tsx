import { useState } from "react";

export default function Game3Setting() {
  const [words, setWords] = useState([
    { word: "VIETNAM", hint: "Tên quốc gia" },
    { word: "HOCHIMINH", hint: "Tên vị lãnh tụ" },
    { word: "SAIGON", hint: "Tên cũ của TP.HCM" },
  ]);

  const [newWord, setNewWord] = useState("");
  const [newHint, setNewHint] = useState("");

  const handleAdd = () => {
    if (newWord.trim() && newHint.trim()) {
      setWords([...words, { word: newWord.toUpperCase(), hint: newHint }]);
      setNewWord("");
      setNewHint("");
    }
  };

  return (
    <div className="h-full bg-slate-900 text-white p-6">
      <div className="max-w-xl mx-auto bg-white/10 p-6 rounded-xl space-y-6">
        <h2 className="text-2xl font-bold text-center text-pink-300">Cài đặt từ vựng cho Flowerman</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nhập từ (KHÔNG dấu)"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            className="w-full bg-white/20 px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Gợi ý"
            value={newHint}
            onChange={(e) => setNewHint(e.target.value)}
            className="w-full bg-white/20 px-4 py-2 rounded"
          />
          <button onClick={handleAdd} className="bg-pink-500 px-4 py-2 rounded hover:bg-pink-600 transition w-full">
            Thêm từ
          </button>
        </div>

        <hr className="border-white/20" />

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Danh sách từ hiện tại:</h3>
          <ul className="list-disc pl-6 space-y-1">
            {words.map((entry, i) => (
              <li key={i}>
                <span className="text-pink-300 font-bold">{entry.word}</span> - {entry.hint}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
