import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GameWrapper = () => {
	const [name, setName] = useState("");
	const navigate = useNavigate();

	const handleStart = () => {
		if (!name.trim()) return;
		// Store name in localStorage (or global state in the future)
		localStorage.setItem("playerName", name);
		// Navigate to actual game logic (to be implemented later)
		alert(`Starting game for ${name}...`);
	};

	return (
		<div className="flex flex-col items-center justify-center h-full p-6 text-center">
			<h1 className="text-3xl font-bold mb-6">Enter Your Name</h1>
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="Your name"
				className="px-4 py-2 border rounded mb-4 w-full max-w-xs text-center"
			/>
			<button
				onClick={handleStart}
				className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
			>
				Start Game
			</button>
		</div>
	);
};

export default GameWrapper;
