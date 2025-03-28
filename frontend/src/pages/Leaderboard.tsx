const Leaderboard = () => {
	// In the future, fetch from database
	const dummyScores = [
		{ name: "Linh", score: 120 },
		{ name: "Tom", score: 100 },
		{ name: "An", score: 95 },
	];

	return (
		<div className="p-6 max-w-xl mx-auto text-center">
			<h1 className="text-3xl font-bold mb-4">🏆 Leaderboard</h1>
			<ul className="divide-y border rounded shadow">
				{dummyScores.map((entry, idx) => (
					<li
						key={idx}
						className="flex justify-between px-4 py-3 even:bg-gray-50"
					>
						<span>{entry.name}</span>
						<span className="font-bold">{entry.score}</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Leaderboard;
