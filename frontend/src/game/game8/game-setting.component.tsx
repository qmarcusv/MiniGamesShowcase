import { useTranslation } from "react-i18next";

export default function Game8Setting() {
	const { t } = useTranslation();

	return (
		<div className="h-full bg-[url('/image/pirate-bg.jpg')] bg-cover bg-center flex items-center justify-center px-4">
			<div className="bg-[#0f72a]/80 backdrop-blur-md border-4 border-cyan-600 rounded-2xl shadow-2xl p-10 max-w-3xl w-full text-center space-y-8 text-cyan-100 font-pirate">
				<h1 className="text-5xl font-bold text-cyan-400 drop-shadow-lg tracking-wider">
					⚙️ {t("description8.setting") || "Cài đặt"}
				</h1>

				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-lg">⏱️ Thời gian</span>
						<span className="px-3 py-1 bg-cyan-700 rounded-lg">2 phút</span>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-lg">🎯 Số câu hỏi</span>
						<span className="px-3 py-1 bg-cyan-700 rounded-lg">3 câu</span>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-lg">💡 Gợi ý</span>
						<div className="flex gap-2">
							<span className="px-3 py-1 bg-cyan-700 rounded-lg">
								Câu 1: 2 gợi ý
							</span>
							<span className="px-3 py-1 bg-cyan-700 rounded-lg">
								Câu 2: 1 gợi ý
							</span>
							<span className="px-3 py-1 bg-cyan-700 rounded-lg">
								Câu 3: 0 gợi ý
							</span>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-lg">🎮 Điều khiển</span>
						<span className="px-3 py-1 bg-cyan-700 rounded-lg">
							Click chuột để chọn điểm
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
