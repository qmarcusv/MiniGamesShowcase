import { useState } from "react";
import Navigator from "../../shared/navigator/navigator.component";
import ButtonSound from "../../feature/button-sound/button-sound.component";
import Game3 from "./game.component";
import Game3Setting from "./game-setting.component";

export default function Description3() {
	const [view, setView] = useState<"description" | "game" | "setting">(
		"description"
	);

	if (view === "game") return <Game3 />;
	if (view === "setting") return <Game3Setting />;

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center px-4">
			<div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-10 max-w-3xl w-full text-center space-y-8">
				<h1 className="text-4xl font-extrabold text-pink-400 drop-shadow">
					Trò chơi 3: Giải cứu bí mật cùng Flowerman
				</h1>

				<p className="text-lg text-slate-100 leading-relaxed whitespace-pre-line">
					Bạn sẽ thấy 9 tấm thẻ che phủ một bản đồ kho báu bí ẩn.
					{"\n"}Mỗi thẻ đại diện cho một câu đố chữ cái.
					{"\n"}Hãy chọn 1 ô để bắt đầu trò chơi "Flowerman" — phiên bản thân
					thiện của Hangman!
					{"\n\n"}🌸 Thay vì treo người, một bông hoa sẽ rụng từng cánh nếu bạn
					đoán sai.
					{"\n"}🌟 Đoán đúng từ để lật thẻ và khám phá bản đồ bên dưới.
					{"\n\n"}Chúc bạn vui vẻ và đừng để bông hoa rụng hết nhé!
				</p>

				<div className="flex justify-center gap-4 flex-wrap items-center">
					<ButtonSound
						soundUrl="/sounds/press.mp3"
						onClick={() => setView("setting")}
						className="bg-white/20 text-white px-6 py-2 rounded-xl hover:bg-white/30 transition shadow-md"
					>
						Cài đặt
					</ButtonSound>

					<ButtonSound
						soundUrl="/sounds/press.mp3"
						onClick={() => setView("game")}
						className="bg-pink-500 text-white px-6 py-2 rounded-xl hover:bg-pink-600 transition shadow-md"
					>
						Bắt đầu chơi
					</ButtonSound>
				</div>

				<Navigator previewLink="../game2" nextLink="../game4" />
			</div>
		</div>
	);
}
