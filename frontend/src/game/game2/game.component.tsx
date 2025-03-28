import { useEffect, useState } from "react";
import Navigator from "../../shared/navigator/navigator.component";
import ButtonSound from "../../feature/button-sound/button-sound.component";

export default function Game() {
  const questions = [
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
    // Add more questions here
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  // Help & feedback
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [fiftyUsed, setFiftyUsed] = useState(false);

  // Statistics
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);

  const currentQuestion = questions[currentIndex] ?? null;

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
    if (selected !== null || !currentQuestion || disabledOptions.includes(responseIndex)) return;

    // show answer +  explication & reset
    setSelected(responseIndex);
    setShowAnswer(true);
    setTimedOut(false);

    const isCorrect = responseIndex === currentQuestion.result;
    setCorrectCount((prev) => prev + (isCorrect ? 1 : 0));
    setWrongCount((prev) => prev + (isCorrect ? 0 : 1));

    // Delay next question to show result
    setTimeout(nextQuestion, 3000);
  };

  const useFiftyFifty = () => {
    if (fiftyUsed || !currentQuestion) return;

    const correctIndex = currentQuestion.result;
    const wrongIndexes = currentQuestion.responses.map((_, idx) => idx).filter((idx) => idx !== correctIndex);

    const shuffled = wrongIndexes.sort(() => 0.5 - Math.random());
    const toHide = shuffled.slice(0, 2); // remove 2 wrong answers

    setDisabledOptions(toHide);
    setFiftyUsed(true);
  };

  useEffect(() => {
    if (!currentQuestion || showAnswer) return;

    if (timeLeft === 0) {
      setShowAnswer(true);
      setTimedOut(true);
      setSkippedCount((prev) => prev + 1);
      setTimeout(nextQuestion, 3000);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, currentQuestion, showAnswer]);

  const getResponseStyle = (index: number) => {
    if (disabledOptions.includes(index) && !showAnswer) {
      return "bg-gray-200 text-gray-400 cursor-not-allowed";
    }

    if (!showAnswer) {
      return selected === index ? "bg-blue-400 text-white" : "bg-white text-black hover:bg-blue-100";
    }

    if (index === currentQuestion?.result) {
      return "bg-green-500 text-white"; // ✅ correct
    }

    if (index === selected) {
      return "bg-red-500 text-white"; // ❌ incorrect
    }

    return "bg-white text-black";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      {currentIndex < questions.length ? (
        <>
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Trò chơi 2: Câu hỏi</h1>

          {!showAnswer && (
            <div className="flex justify-center gap-4 items-center mb-4">
              <div className="text-xl text-red-500 font-bold">⏱ {timeLeft}s</div>
              {!fiftyUsed && (
                <ButtonSound onClick={useFiftyFifty} className="bg-purple-500 text-white px-4 py-1 rounded hover:bg-purple-600 transition">
                  50/50
                </ButtonSound>
              )}
            </div>
          )}

          <div className="question mb-4 flex gap-2 justify-center">
            <h2 className="text-2xl font-semibold">Câu hỏi {currentIndex + 1}:</h2>
            <h2 className="text-2xl font-semibold">{currentQuestion.question}</h2>
          </div>

          <div className="responses grid grid-cols-2 gap-4 mb-4">
            {currentQuestion.responses.map((res, index) => (
              <div key={index} className={`py-2 px-4 rounded-lg transition border ${getResponseStyle(index)}`} onClick={() => selectResponse(index)}>
                {res}
              </div>
            ))}
          </div>

          {showAnswer && (
            <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 p-4 rounded-lg max-w-xl mx-auto mb-4 transition">
              <strong>Giải thích:</strong> {currentQuestion.explanation}
              {timedOut && <p className="text-red-500 mt-2 font-medium">⏰ Hết giờ! Bạn chưa chọn đáp án.</p>}
            </div>
          )}
        </>
      ) : (
        <div className="text-green-700 font-semibold mt-6 text-2xl">
          🎉 Bạn đã hoàn thành trò chơi!
          <div className="mt-4 text-base text-gray-800 bg-green-100 p-4 rounded-lg max-w-md mx-auto">
            <p>
              <strong>Tổng số câu hỏi:</strong> {questions.length}
            </p>
            <p>
              <strong>Trả lời đúng:</strong> {correctCount}
            </p>
            <p>
              <strong>Trả lời sai:</strong> {wrongCount}
            </p>
            <p>
              <strong>Bỏ qua (hết giờ):</strong> {skippedCount}
            </p>
          </div>
        </div>
      )}

      <p className="text-lg text-gray-500 mt-6 mb-6">Sau này có thể thêm các năng lực đặc biệt như thêm thời gian hoặc đổi câu hỏi.</p>

      <Navigator previewLink="../game1" nextLink="../game3" />
    </div>
  );
}
