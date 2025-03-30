export interface DifferenceSpot {
	id: string;
	title: string;
	description: string;
	position: { x: number; y: number }; // relative (0–1)
}

export interface MapComparison {
	id: string;
	name: string;
	pastImage: string;
	currentImage: string;
	differences: DifferenceSpot[];
}

export const mapComparisons: MapComparison[] = [
	{
		id: "notre-dame",
		name: "Nhà thờ Đức Bà",
		pastImage: "/temp/notredame-past.jpg",
		currentImage: "/temp/notredame-now.jpg",
		differences: [
			{
				id: "tree-missing",
				title: "Cây bị chặt",
				description: "Cây cổ thụ phía trước nhà thờ đã bị chặt bỏ.",
				position: { x: 0.32, y: 0.45 },
			},
			{
				id: "banner-added",
				title: "Banner quảng cáo",
				description: "Xuất hiện banner quảng cáo bên trái.",
				position: { x: 0.15, y: 0.6 },
			},
			{
				id: "bench-changed",
				title: "Thay đổi ghế đá",
				description: "Ghế đá đã được thay bằng loại mới.",
				position: { x: 0.75, y: 0.8 },
			},
		],
	},
	{
		id: "ben-thanh",
		name: "Chợ Bến Thành",
		pastImage: "/temp/benthanh-past.jpg",
		currentImage: "/temp/benthanh-now.jpg",
		differences: [
			{
				id: "clock-color",
				title: "Đồng hồ thay đổi màu",
				description: "Màu sắc của đồng hồ trên tháp đã được sơn lại.",
				position: { x: 0.52, y: 0.25 },
			},
		],
	},
];
