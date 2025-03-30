import React from "react";
import { useNavigate } from "react-router-dom";

interface Game6SettingProps {
	gridSize: "4x4" | "6x6";
	setGridSize: (value: "4x4" | "6x6") => void;
	timers: {
		"4x4": number;
		"6x6": number;
	};
	setTimers: React.Dispatch<
		React.SetStateAction<{
			"4x4": number;
			"6x6": number;
		}>
	>;
}

export default function Game6Setting({ timers, setTimers }: Game6SettingProps) {
	const navigate = useNavigate();

	const handleTimerChange = (size: "4x4" | "6x6", value: string) => {
		const seconds = parseInt(value);
		if (!isNaN(seconds)) {
			setTimers((prev) => ({ ...prev, [size]: seconds }));
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4 bg-slate-800 text-white">
			<div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8 max-w-xl w-full space-y-6">
				<h2 className="text-2xl font-bold text-center text-emerald-300">
					Cài đặt thời gian cho từng chế độ
				</h2>

				<div className="space-y-4">
					{(["4x4", "6x6"] as const).map((size) => (
						<div key={size} className="flex justify-between items-center">
							<label className="text-lg font-medium">{size}</label>
							<input
								type="number"
								min={10}
								value={timers[size]}
								onChange={(e) =>
									handleTimerChange(size as "4x4" | "6x6", e.target.value)
								}
								className="bg-white/20 text-white px-4 py-2 rounded-lg w-24 text-center"
							/>
						</div>
					))}
				</div>

				<div className="text-center pt-6">
					<button
						onClick={() => navigate(-1)}
						className="bg-emerald-500 text-white px-6 py-2 rounded-xl hover:bg-emerald-600 transition shadow"
					>
						Quay lại
					</button>
				</div>
			</div>
		</div>
	);
}
