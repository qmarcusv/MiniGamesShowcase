export interface PlaceInfo {
	id: string;
	name: string;
	position: { x: number; y: number }; // relative (0–1)
	builtYear: number;
	architect: string;
	age: number;
	image: string; // can be updated later
	history: string;
}

export const places: PlaceInfo[] = [
	{
		id: "notredame",
		name: "Nhà thờ Đức Bà",
		position: { x: 0.45, y: 0.32 },
		builtYear: 1880,
		architect: "Jules Bourard",
		age: 144,
		image: "/places/nhathoducba.jpg",
		history:
			"Nhà thờ Đức Bà là một trong những biểu tượng nổi bật của TP.HCM, được xây dựng bởi người Pháp với kiến trúc Gothic độc đáo.",
	},
	{
		id: "hoguom",
		name: "Hồ Gươm",
		position: { x: 0.22, y: 0.5 },
		builtYear: 1407,
		architect: "Không rõ",
		age: 617,
		image: "/places/hanoi.jpg",
		history:
			"Hồ Gươm là địa danh gắn liền với truyền thuyết trả gươm thần, nằm giữa trung tâm Hà Nội.",
	},
	{
		id: "langbac",
		name: "Lăng Chủ tịch Hồ Chí Minh",
		position: { x: 0.3, y: 0.65 },
		builtYear: 1975,
		architect: "Nhóm kiến trúc sư Liên Xô",
		age: 49,
		image: "/places/hue.jpg",
		history:
			"Lăng là nơi an nghỉ của Chủ tịch Hồ Chí Minh và là điểm đến tâm linh quan trọng.",
	},
	{
		id: "halong",
		name: "Vịnh Hạ Long",
		position: { x: 0.72, y: 0.28 },
		builtYear: 0,
		architect: "Tự nhiên",
		age: 500000,
		image: "/places/halong.jpg",
		history:
			"Vịnh Hạ Long là di sản thiên nhiên thế giới với hàng nghìn đảo đá vôi tuyệt đẹp.",
	},
	{
		id: "hoian",
		name: "Phố cổ Hội An",
		position: { x: 0.6, y: 0.45 },
		builtYear: 1595,
		architect: "Người Việt, Nhật, Trung",
		age: 429,
		image: "/places/hoian.jpg",
		history:
			"Phố cổ Hội An là một thương cảng cổ được bảo tồn gần như nguyên vẹn, phản ánh sự giao thoa văn hóa.",
	},
	{
		id: "danang",
		name: "Cầu Rồng Đà Nẵng",
		position: { x: 0.8, y: 0.55 },
		builtYear: 2013,
		architect: "Louis Berger",
		age: 11,
		image: "/places/nharong.jpg",
		history:
			"Cầu Rồng là cây cầu nổi bật ở Đà Nẵng với thiết kế hình rồng có thể phun lửa và nước.",
	},
	{
		id: "nhatrang",
		name: "Tháp Bà Ponagar",
		position: { x: 0.85, y: 0.75 },
		builtYear: 781,
		architect: "Người Chăm",
		age: 1243,
		image: "/places/myson.jpg",
		history:
			"Tháp Bà là công trình tôn giáo của người Chăm, vẫn được thờ cúng đến ngày nay.",
	},
	{
		id: "sapa",
		name: "Thị trấn Sapa",
		position: { x: 0.12, y: 0.28 },
		builtYear: 1903,
		architect: "Thực dân Pháp",
		age: 121,
		image: "/places/sapa.jpg",
		history:
			"Sapa là điểm du lịch nổi tiếng với cảnh quan núi non và nền văn hóa dân tộc phong phú.",
	},
	{
		id: "dalat",
		name: "Thành phố Đà Lạt",
		position: { x: 0.5, y: 0.78 },
		builtYear: 1893,
		architect: "Alexandre Yersin",
		age: 131,
		image: "/places/dalat.jpg",
		history:
			"Đà Lạt là thành phố nghỉ dưỡng được người Pháp quy hoạch với biệt thự cổ kính và khí hậu ôn hòa.",
	},
	{
		id: "phuquoc",
		name: "Đảo Phú Quốc",
		position: { x: 0.1, y: 0.85 },
		builtYear: 0,
		architect: "Tự nhiên",
		age: 500000,
		image: "/places/phuquoc.jpg",
		history:
			"Phú Quốc là đảo lớn nhất Việt Nam, nổi tiếng với bãi biển đẹp và nước mắm truyền thống.",
	},
];
