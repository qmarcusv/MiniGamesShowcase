import { useState } from "react";
import ButtonSound from "../../feature/button-sound/button-sound.component";

export default function Game9() {
	const [started, setStarted] = useState(false);

	return (
		<div className="h-full bg-[url('/game/image/description/game.png')] bg-cover bg-no-repeat bg-center">
			<div className="h-full flex items-center justify-center px-4 py-8 bg-black/30">
				<div className="bg-[#0f172a]/40 backdrop-blur-sm border-2 border-amber-500/20 rounded-2xl p-8 shadow-lg max-w-3xl w-full">
					<h1 className="text-4xl font-semibold text-amber-400/90 text-center mb-8">
						Trò Chơi Trí Nhớ
					</h1>

					{!started ? (
						<div className="flex justify-center">
							<ButtonSound
								onClick={() => setStarted(true)}
								className="bg-green-800/40 hover:bg-green-700/40 text-amber-200/90 px-8 py-3 rounded-xl font-medium transition-colors border border-amber-500/20"
							>
								Bắt đầu chơi
							</ButtonSound>
						</div>
					) : (
						<div className="text-center text-amber-200/90">
							Game đang được phát triển...
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
