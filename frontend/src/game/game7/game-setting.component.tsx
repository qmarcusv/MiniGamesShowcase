import { useTranslation } from "react-i18next";

export default function Game7Setting() {
	const { t } = useTranslation();

	return (
		<div className="h-full bg-[url('/image/pirate-bg.jpg')] bg-cover bg-center flex items-center justify-center px-4">
			<div className="bg-[#0f172a]/80 backdrop-blur-md border-4 border-orange-600 rounded-2xl shadow-2xl p-10 max-w-3xl w-full text-center space-y-8 text-orange-100 font-pirate">
				<h1 className="text-5xl font-bold text-orange-400 drop-shadow-lg tracking-wider">
					⚙️ {t("description7.setting") || "Cài đặt"}
				</h1>

				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-lg">🎮 Điều khiển</span>
						<div className="flex gap-2">
							<span className="px-3 py-1 bg-orange-700 rounded-lg">←</span>
							<span className="px-3 py-1 bg-orange-700 rounded-lg">→</span>
							<span className="px-3 py-1 bg-orange-700 rounded-lg">↓</span>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-lg">⏱️ Thời gian</span>
						<span className="px-3 py-1 bg-orange-700 rounded-lg">60 giây</span>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-lg">🎯 Mục tiêu</span>
						<span className="px-3 py-1 bg-orange-700 rounded-lg">
							Sắp xếp càng nhiều tài liệu càng tốt
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
