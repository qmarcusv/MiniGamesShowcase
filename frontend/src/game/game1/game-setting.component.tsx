import { places } from "./game1-places";

export default function Game1Setting() {
	return (
		<div className="min-h-screen bg-slate-800 text-white px-4 py-10 flex items-center justify-center">
			<div className="max-w-4xl w-full bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-xl space-y-6">
				<h2 className="text-2xl font-bold text-center text-emerald-400">
					🛠️ Cài đặt địa điểm
				</h2>

				<p className="text-sm text-slate-300 text-center">
					Dữ liệu bên dưới là các điểm trên bản đồ. Mỗi điểm có thông tin đầy đủ
					như tên, hình ảnh, lịch sử...
				</p>

				<div className="grid gap-4 max-h-[70vh] overflow-y-auto">
					{places.map((place) => (
						<div
							key={place.id}
							className="bg-slate-700 p-4 rounded-lg space-y-1 text-sm shadow"
						>
							<p>
								<strong>📍 Tên:</strong> {place.name}
							</p>
							<p>
								<strong>📅 Năm xây:</strong> {place.builtYear} —{" "}
								<strong>Tuổi:</strong> {place.age} năm
							</p>
							<p>
								<strong>🛠️ Kiến trúc sư:</strong> {place.architect}
							</p>
							<p>
								<strong>📍 Vị trí:</strong> x: {place.position.x}, y:{" "}
								{place.position.y}
							</p>
							<p className="text-slate-400 whitespace-pre-line">
								<strong>📖 Lịch sử:</strong> {place.history}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
