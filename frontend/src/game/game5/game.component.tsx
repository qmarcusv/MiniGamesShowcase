import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useTranslation } from "react-i18next";

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
  {
    type: "Instruction",
    author: "Health Ministry",
    field: "Science",
    content: "New instruction for hospital waste.",
  },
  {
    type: "Directive",
    author: "Transport Authority",
    field: "Law",
    content: "Safety directive for drivers.",
  },
  {
    type: "Announcement",
    author: "Education Dept",
    field: "Science",
    content: "New curriculum reforms in schools.",
  },
  {
    type: "Notification",
    author: "Health Ministry",
    field: "Law",
    content: "Vaccination campaign announcement.",
  },
  {
    type: "Bulletin",
    author: "Transport Authority",
    field: "Science",
    content: "Public transport innovations.",
  },
];

const fields = ["author", "type", "field"] as const;
const directions = ["horizontal", "vertical", "diagonal"] as const;

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
  direction: (typeof directions)[number];
};

function getRandomDirection(used: Set<string>): "horizontal" | "vertical" | "diagonal" {
  const available = directions.filter((d) => !used.has(d));
  if (available.length === 0) return directions[Math.floor(Math.random() * 3)];
  const chosen = available[Math.floor(Math.random() * available.length)];
  used.add(chosen);
  return chosen;
}

function getRandomSafePosition(direction: string): [number, number] {
  const margin = 100;
  let x = Math.random() * (window.innerWidth - 2 * margin) + margin;
  let y = Math.random() * (window.innerHeight - 2 * margin) + margin;
  if (direction === "horizontal") y = Math.random() * (window.innerHeight - 2 * margin) + margin;
  else if (direction === "vertical") x = Math.random() * (window.innerWidth - 2 * margin) + margin;
  return [x, y];
}

export default function Game5() {
  const { t } = useTranslation();
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

    // Step 1: pick field and value that has at least 4 matches
    let field: keyof Doc = "author";
    let value = "";
    let matches: DocField[] = [];

    for (let attempt = 0; attempt < 10; attempt++) {
      const randomField = fields[Math.floor(Math.random() * fields.length)] as keyof Doc;
      const valueCounts: Record<string, DocField[]> = {};
      for (const doc of sampleDocs) {
        const val = doc[randomField as keyof DocField];
        if (!valueCounts[val]) valueCounts[val] = [];
        valueCounts[val].push(doc);
      }
      const validValues = Object.entries(valueCounts).filter(([_, list]) => list.length >= 4);
      if (validValues.length > 0) {
        const [chosenValue, chosenDocs] = validValues[Math.floor(Math.random() * validValues.length)];
        field = randomField;
        value = chosenValue;
        matches = chosenDocs;
        break;
      }
    }

    // Step 2: take 4 matching + 1 wrong
    const correctDocs = matches.slice(0, 4);
    const incorrectDoc = sampleDocs.find((d) => d[field as keyof DocField] !== value)!;

    const combined = [...correctDocs, incorrectDoc];
    const usedDirs = new Set<string>();
    const placed: Doc[] = combined.map((doc) => {
      const direction = getRandomDirection(usedDirs);
      const [x, y] = getRandomSafePosition(direction);
      return { ...doc, id: uuidv4(), x, y, direction };
    });

    setQuestion({
      field,
      value,
      correctCount: 4,
      label: `${field.toUpperCase()}: ${value}`,
    });
    setScore(0);
    setTimer(10);
    setDocs(placed);
    setSpeed(1);
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
        if (section === 5 && endTime === null) setEndTime(Date.now());
        setSection((s) => s + 1);
        setScore(0);
      } else setScore(newScore);
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
    const timePlayed = Math.round(((endTime ?? Date.now()) - startTimeRef.current) / 1000);
    const accuracy = correctAnswers === 0 ? 0 : Math.round((correctAnswers / 20) * 100);
    return (
      <div className="px-6 py-10 flex flex-col items-center text-center bg-gradient-to-b from-green-100 to-green-300 min-h-screen">
        <div className="w-[80%] max-w-[800px] min-w-[400px] min-h-[500px] p-10 rounded-[2rem] bg-white shadow-2xl text-xl animate-fade-in">
          <h2 className="text-3xl font-extrabold text-green-700 mb-6">{t("game5.summary")}</h2>
          <div className="flex flex-col items-center gap-4 text-lg">
            <p>
              <span className="text-2xl">⏱️</span> {t("game5.playtime")}:{" "}
              <span className="font-semibold">
                {timePlayed} {t("game5.seconds")}
              </span>
            </p>
            <p>
              <span className="text-2xl">🎯</span> {t("game5.accuracy")}: <span className="font-semibold text-blue-600">{accuracy}%</span>
            </p>
            <p>
              <span className="text-2xl">✅</span> {t("game5.correctPicks")}:{" "}
              <span className="font-semibold text-green-600">{correctAnswers} / 20</span>
            </p>
          </div>
          <div className="mt-10"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-blue-50 to-blue-100 overflow-hidden">
      <div className="flex items-center gap-4 px-6 py-3 bg-white shadow-md z-50 relative w-fit max-w-[90%] mt-2 ml-4 rounded-xl border border-blue-200">
        <h1 className="text-base font-semibold text-blue-600">
          {t("game5.question", { section })}: {question?.label} ({t("game5.correct")}: {score}/{question?.correctCount})
        </h1>
        <div className="w-10 h-10">
          <CircularProgressbarWithChildren
            value={(timer / 10) * 100}
            styles={buildStyles({
              pathColor: timer <= 3 ? "red" : "#3b82f6",
              trailColor: "#eee",
            })}>
            <div className={`text-xs font-bold ${timer <= 3 ? "text-red-600" : "text-blue-600"}`}>{timer}s</div>
          </CircularProgressbarWithChildren>
        </div>
      </div>

      {docs.map((doc) => (
        <motion.div
          key={doc.id}
          onClick={() => handleClick(doc)}
          className="absolute w-64 h-80 p-4 bg-white rounded-lg shadow-md border text-sm cursor-pointer hover:scale-105 transition"
          style={{ top: doc.y, left: doc.x }}>
          <p>
            <strong>{t("game5.type")}:</strong> {doc.type}
          </p>
          <p>
            <strong>{t("game5.author")}:</strong> {doc.author}
          </p>
          <p>
            <strong>{t("game5.field")}:</strong> {doc.field}
          </p>
          <p className="mt-2 italic text-gray-500">{doc.content}</p>
        </motion.div>
      ))}

      <audio ref={correctRef} src="/sounds/correct.mp3" preload="auto" />
      <audio ref={wrongRef} src="/sounds/wrong.mp3" preload="auto" />
    </div>
  );
}
