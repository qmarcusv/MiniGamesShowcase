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
	{
		id: "myson",
		name: "Thánh địa Mỹ Sơn",
		position: { x: 0.35, y: 0.15 },
		builtYear: 400,
		architect: "Người Chăm",
		age: 1624,
		image: "/places/myson.jpg",
		history:
			"Thánh địa Mỹ Sơn là quần thể đền đài Chăm Pa cổ, di sản văn hóa thế giới.",
	},
	{
		id: "phongnha",
		name: "Động Phong Nha",
		position: { x: 0.65, y: 0.15 },
		builtYear: 0,
		architect: "Tự nhiên",
		age: 400000,
		image: "/places/phongnha.jpg",
		history:
			"Động Phong Nha là một trong những hang động đẹp nhất thế giới với hệ thống sông ngầm.",
	},
	{
		id: "cantho",
		name: "Chợ nổi Cần Thơ",
		position: { x: 0.15, y: 0.7 },
		builtYear: 1915,
		architect: "Người dân địa phương",
		age: 109,
		image: "/places/cantho.jpg",
		history:
			"Chợ nổi Cần Thơ là nét văn hóa đặc trưng của vùng sông nước miền Tây Nam Bộ.",
	},
	{
		id: "condao",
		name: "Côn Đảo",
		position: { x: 0.9, y: 0.35 },
		builtYear: 1862,
		architect: "Thực dân Pháp",
		age: 162,
		image: "/places/condao.jpg",
		history:
			"Côn Đảo là quần đảo với nhiều di tích lịch sử và bãi biển hoang sơ.",
	},
	{
		id: "mocchau",
		name: "Cao nguyên Mộc Châu",
		position: { x: 0.25, y: 0.35 },
		builtYear: 0,
		architect: "Tự nhiên",
		age: 1000000,
		image: "/places/mocchau.jpg",
		history:
			"Mộc Châu nổi tiếng với đồi chè, thảo nguyên và không khí trong lành.",
	},
	{
		id: "catba",
		name: "Đảo Cát Bà",
		position: { x: 0.75, y: 0.65 },
		builtYear: 0,
		architect: "Tự nhiên",
		age: 500000,
		image: "/places/catba.jpg",
		history:
			"Cát Bà là quần đảo đa dạng sinh học với vườn quốc gia và bãi biển đẹp.",
	},
	{
		id: "cucphuong",
		name: "Vườn quốc gia Cúc Phương",
		position: { x: 0.4, y: 0.45 },
		builtYear: 1962,
		architect: "Tự nhiên",
		age: 500000,
		image: "/places/cucphuong.jpg",
		history:
			"Cúc Phương là vườn quốc gia đầu tiên của Việt Nam với hệ sinh thái phong phú.",
	},
	{
		id: "samson",
		name: "Biển Sầm Sơn",
		position: { x: 0.55, y: 0.6 },
		builtYear: 1907,
		architect: "Tự nhiên",
		age: 117,
		image: "/places/samson.jpg",
		history:
			"Sầm Sơn là bãi biển du lịch nổi tiếng với bờ cát trắng và sóng biển trong xanh.",
	},
	{
		id: "hagiang",
		name: "Cao nguyên đá Hà Giang",
		position: { x: 0.18, y: 0.15 },
		builtYear: 0,
		architect: "Tự nhiên",
		age: 1000000,
		image: "/places/hagiang.jpg",
		history:
			"Cao nguyên đá Hà Giang nổi tiếng với cảnh quan hùng vĩ và văn hóa dân tộc đặc sắc.",
	},
	{
		id: "baibe",
		name: "Hồ Ba Bể",
		position: { x: 0.35, y: 0.25 },
		builtYear: 0,
		architect: "Tự nhiên",
		age: 500000,
		image: "/places/baibe.jpg",
		history:
			"Hồ Ba Bể là hồ nước ngọt tự nhiên lớn nhất Việt Nam, được bao quanh bởi núi đá vôi và rừng nguyên sinh.",
	},
];
