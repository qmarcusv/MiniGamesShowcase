import des from "../../assets/temp/game1.png";
import Navigator from "../../shared/navigator/navigator.component";

export default function Description1() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center px-4">
			<div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-10 max-w-3xl w-full text-center space-y-8">
				<h1 className="text-4xl font-extrabold text-blue-400 drop-shadow">
					Trò chơi 1: Tìm địa điểm
				</h1>

				<img
					src={des}
					alt="Tìm địa điểm preview"
					className="rounded-xl w-full max-w-md mx-auto shadow-lg border border-white/20"
				/>

				<p className="text-lg text-slate-100 leading-relaxed">
					Khó nhất là phần cho các điểm di chuyển và đổi vị trí với nhau một
					cách mượt mà. 🌀
				</p>

				<Navigator previewLink="" nextLink="../game2" />
			</div>
		</div>
	);
}
