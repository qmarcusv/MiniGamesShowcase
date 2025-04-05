import { useState } from "react";
import ButtonSound from "../../feature/button-sound/button-sound.component";

export default function Game10Setting() {
	const [volume, setVolume] = useState(50);
	const [showGrid, setShowGrid] = useState(true);
	const [showRotation, setShowRotation] = useState(true);

	return (
		<div className="h-full bg-[url('/game/image/description/game.png')] bg-cover bg-center flex items-center justify-center px-4">
			<div className="bg-[#0f172a]/80 backdrop-blur-md border-4 border-purple-600 rounded-2xl shadow-2xl p-10 max-w-4xl w-full text-center space-y-8 text-purple-100">
				<h1 className="text-4xl font-bold text-purple-400">Cài đặt trò chơi</h1>

				<div className="space-y-6">
					<div className="bg-slate-800/50 rounded-xl p-6">
						<h2 className="text-2xl font-semibold text-purple-300 mb-4">
							Âm thanh
						</h2>
						<div className="flex items-center gap-4">
							<span className="text-lg">Âm lượng:</span>
							<input
								type="range"
								min="0"
								max="100"
								value={volume}
								onChange={(e) => setVolume(parseInt(e.target.value))}
								className="flex-1"
							/>
							<span className="text-lg">{volume}%</span>
						</div>
					</div>

					<div className="bg-slate-800/50 rounded-xl p-6">
						<h2 className="text-2xl font-semibold text-purple-300 mb-4">
							Giao diện
						</h2>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-lg">Hiển thị lưới:</span>
								<label className="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										checked={showGrid}
										onChange={(e) => setShowGrid(e.target.checked)}
										className="sr-only peer"
									/>
									<div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
								</label>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-lg">Hiển thị góc xoay:</span>
								<label className="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										checked={showRotation}
										onChange={(e) => setShowRotation(e.target.checked)}
										className="sr-only peer"
									/>
									<div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
								</label>
							</div>
						</div>
					</div>
				</div>

				<div className="flex justify-center gap-4">
					<ButtonSound
						onClick={() => window.history.back()}
						className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-xl"
					>
						Quay lại
					</ButtonSound>

					<ButtonSound
						onClick={() => window.location.reload()}
						className="bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-xl"
					>
						Lưu thay đổi
					</ButtonSound>
				</div>
			</div>
		</div>
	);
}
