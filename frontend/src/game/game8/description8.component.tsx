import { Link } from "react-router-dom";

export default function Description8() {
	return (
		<div className="h-full bg-[url('/images/backgrounds/game8-bg.jpg')] bg-cover bg-center">
			<div className="h-full bg-slate-900/80">
				<div className="container mx-auto px-4 py-8">
					<div className="max-w-4xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border-2 border-cyan-500/30">
						<h1 className="text-4xl font-bold text-cyan-400 text-center mb-6">
							Giải Mã Hải Đồ
						</h1>

						<div className="space-y-6 text-cyan-100">
							<p className="text-lg">
								Bạn đã tìm thấy một tấm bản đồ cổ với những ký hiệu bí ẩn. Hãy
								giải mã các ký hiệu và tìm ra vị trí chính xác trên bản đồ Việt
								Nam.
							</p>

							<div className="bg-slate-700/50 rounded-xl p-6">
								<h2 className="text-2xl font-bold text-cyan-400 mb-4">
									Cách chơi:
								</h2>
								<ul className="list-disc list-inside space-y-2">
									<li>Đọc câu hỏi và giải mã các ký hiệu</li>
									<li>Chọn vị trí tương ứng trên bản đồ</li>
									<li>Mỗi câu trả lời đúng sẽ cho bạn điểm</li>
									<li>Bạn có 2 phút để hoàn thành trò chơi</li>
								</ul>
							</div>

							<div className="bg-slate-700/50 rounded-xl p-6">
								<h2 className="text-2xl font-bold text-cyan-400 mb-4">
									Phần thưởng:
								</h2>
								<ul className="list-disc list-inside space-y-2">
									<li>Đạt 70% độ chính xác để mở khóa mảnh ghép bản đồ</li>
									<li>Đạt 150 điểm để nhận phần thưởng đặc biệt</li>
								</ul>
							</div>

							<div className="flex justify-center gap-4 pt-4">
								<Link
									to="/games"
									className="px-6 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 transition text-white"
								>
									Quay lại
								</Link>
								<Link
									to="/games/game8/play"
									className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 transition text-white"
								>
									Bắt đầu
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
