// Định nghĩa kiểu dữ liệu cho địa điểm
export interface Place {
	id: string;
	name: string;
	position: {
		x: number; // Tọa độ x trên bản đồ (0-1)
		y: number; // Tọa độ y trên bản đồ (0-1)
	};
	builtYear: number; // Năm xây dựng
	architect: string; // Kiến trúc sư/người xây dựng
	age: number; // Tuổi công trình
	image: string; // Đường dẫn hình ảnh
	history: string; // Lịch sử/mô tả
}

// Định nghĩa kiểu dữ liệu cho mảnh tàu
export interface ShipPart {
	name: string; // Tên mảnh tàu
	image: string; // Hình ảnh mảnh tàu
	description: string; // Mô tả mảnh tàu
}

// Cấu hình game
export const gameConfig = {
	// Thời gian cho mỗi câu hỏi (giây)
	questionTime: 20,

	// Điểm thưởng
	baseScore: 20, // Điểm cơ bản cho mỗi câu đúng
	timeBonus: {
		// Điểm thưởng dựa vào thời gian còn lại
		fast: { threshold: 8, points: 10 }, // >= 8s: +10 điểm
		medium: { threshold: 5, points: 5 }, // >= 5s: +5 điểm
	},
	streakBonus: {
		// Điểm thưởng chuỗi đúng
		threshold: 2, // Từ 2 câu đúng liên tiếp
		points: 5, // Thưởng 5 điểm
	},

	// Cấu hình câu hỏi toán
	mathQuestion: {
		minResult: 1, // Kết quả nhỏ nhất
		maxResult: 20, // Kết quả lớn nhất
		minNumber: 1, // Số nhỏ nhất được sử dụng
		maxNumber: 99, // Số lớn nhất được sử dụng
	},
};

// Danh sách các mảnh tàu
export const shipParts: ShipPart[] = [
	{
		name: "Thân tàu",
		image: "/places/halong.jpg",
		description: "Mảnh thân tàu chính - phần quan trọng nhất của con tàu!",
	},
	{
		name: "Buồm",
		image: "/places/nhathoducba.jpg",
		description: "Cánh buồm giúp tàu di chuyển nhanh trên biển",
	},
	{
		name: "Mỏ neo",
		image: "/places/hoian.jpg",
		description: "Mỏ neo giúp tàu đậu an toàn khi cần",
	},
	{
		name: "Bánh lái",
		image: "/places/dalat.jpg",
		description: "Bánh lái điều khiển hướng đi của con tàu",
	},
	{
		name: "Súng thần công",
		image: "/places/nharong.jpg",
		description: "Súng thần công - vũ khí mạnh mẽ của cướp biển!",
	},
];

// Danh sách các địa điểm trên bản đồ
export const places: Place[] = [
	{
		id: "halong",
		name: "Vịnh Hạ Long",
		position: { x: 0.2, y: 0.3 },
		builtYear: -500000000,
		architect: "Thiên nhiên",
		age: 500000000,
		image: "/places/halong.jpg",
		history:
			"Vịnh Hạ Long là di sản thiên nhiên thế giới với hàng nghìn hòn đảo đá vôi...",
	},
	{
		id: "nhathoducba",
		name: "Nhà thờ Đức Bà",
		position: { x: 0.4, y: 0.5 },
		builtYear: 1880,
		architect: "Jules Bourard",
		age: 144,
		image: "/places/nhathoducba.jpg",
		history:
			"Nhà thờ chính tòa Đức Bà Sài Gòn là một công trình kiến trúc lớn...",
	},
	{
		id: "hoian",
		name: "Phố cổ Hội An",
		position: { x: 0.6, y: 0.4 },
		builtYear: 1595,
		architect: "Cộng đồng người Hoa và Nhật",
		age: 429,
		image: "/places/hoian.jpg",
		history: "Phố cổ Hội An là một đô thị cổ nằm ở hạ lưu sông Thu Bồn...",
	},
	{
		id: "dalat",
		name: "Ga Đà Lạt",
		position: { x: 0.5, y: 0.6 },
		builtYear: 1932,
		architect: "Kiến trúc sư người Pháp",
		age: 92,
		image: "/places/dalat.jpg",
		history: "Ga Đà Lạt là một trong những công trình kiến trúc độc đáo...",
	},
	{
		id: "nharong",
		name: "Nhà Rồng",
		position: { x: 0.3, y: 0.7 },
		builtYear: 1863,
		architect: "Công ty Thương mại Pháp",
		age: 161,
		image: "/places/nharong.jpg",
		history: "Bảo tàng Hồ Chí Minh - Chi nhánh Thành phố Hồ Chí Minh...",
	},
	// Thêm địa điểm mới ở đây
	{
		id: "kinhthanhHue",
		name: "Kinh thành Huế",
		position: { x: 0.45, y: 0.35 },
		builtYear: 1805,
		architect: "Triều Nguyễn",
		age: 219,
		image: "/places/hue.jpg",
		history: "Kinh thành Huế là quần thể di tích lịch sử văn hóa...",
	},
	// Có thể thêm nhiều địa điểm khác...
];

// Hàm hỗ trợ tạo địa điểm mới
export function createPlace(
	id: string,
	name: string,
	x: number,
	y: number,
	builtYear: number,
	architect: string,
	image: string,
	history: string
): Place {
	return {
		id,
		name,
		position: { x, y },
		builtYear,
		architect,
		age: new Date().getFullYear() - builtYear,
		image,
		history,
	};
}

// Hàm kiểm tra vị trí có hợp lệ
export function isValidPosition(x: number, y: number): boolean {
	return x >= 0 && x <= 1 && y >= 0 && y <= 1;
}

// Hàm kiểm tra xem vị trí mới có bị trùng với các vị trí hiện có không
export function isPositionAvailable(
	x: number,
	y: number,
	excludeId?: string
): boolean {
	const minDistance = 0.1; // Khoảng cách tối thiểu giữa các điểm

	return !places.some(
		(place) =>
			place.id !== excludeId && // Bỏ qua điểm đang được chỉnh sửa
			Math.sqrt(
				Math.pow(place.position.x - x, 2) + Math.pow(place.position.y - y, 2)
			) < minDistance
	);
}
