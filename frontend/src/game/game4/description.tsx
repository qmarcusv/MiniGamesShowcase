import Navigator from "../../shared/navigator/navigator.component";

export default function Description3() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center px-4">
			<div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-10 max-w-3xl w-full text-center space-y-8">
				<h1 className="text-4xl font-extrabold text-blue-400 drop-shadow">
					Trò chơi 4: So sánh quá khứ và hiện tại
				</h1>

				<p className="text-lg text-slate-100 leading-relaxed">
					Cháu chưa có nghĩ ra display như nào nhưng đại khái trò này sẽ có các
					ảnh về các địa điểm như Nhà thờ Đức Bà hoặc bản đồ của một khu vực nào
					đó trước đây và bây giờ. Người chơi sẽ phải so sánh và chọn ra các
					điểm khác biệt (các điểm này sẽ được mình đặt trước). Rồi các kiểu các
					kiểu nữa 😄
				</p>

				<Navigator previewLink="../game3" nextLink="../game5" />
			</div>
		</div>
	);
}
