import ButtonSound from "../../feature/button-sound/button-sound.component";

export default function Game9Setting() {
	return (
		<div className="h-full bg-[url('/game/image/description/game.png')] bg-cover bg-no-repeat bg-center">
			<div className="h-full flex items-center justify-center px-4 py-8 bg-black/30">
				<div className="bg-[#0f172a]/40 backdrop-blur-sm border-2 border-amber-500/20 rounded-2xl p-8 shadow-lg max-w-3xl w-full">
					<h1 className="text-4xl font-semibold text-amber-400/90 text-center mb-8">
						Cài Đặt
					</h1>

					<div className="text-center text-amber-200/90">
						Tính năng cài đặt đang được phát triển...
					</div>
				</div>
			</div>
		</div>
	);
}
