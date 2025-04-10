export interface DifferenceSpot {
	id: string;
	title: string;
	position: { x: number; y: number };
	description: string;
	hint?: string;
}

export interface VietnamLocation {
	id: string;
	name: string;
	pastMap: string;
	currentMap: string;
	differences: DifferenceSpot[];
}

export const vietnamLocations: VietnamLocation[] = [
	{
		id: "halong-bay",
		name: "Vịnh Hạ Long",
		pastMap: "/game/game4/notredame-past.jpg",
		currentMap: "/game/game4/notredame-now.jpg",
		differences: [
			{
				id: "1",
				title: "Đảo đá đã biến mất",
				position: { x: 0.4, y: 0.6 },
				description: "Đảo đá đã biến mất",
				hint: "Một hòn đảo đá vôi đã xói mòn và biến mất theo thời gian",
			},
		],
	},
	{
		id: "mekong-delta",
		name: "Đồng bằng sông Cửu Long",
		pastMap: "/game/game4/mekong-past.jpg",
		currentMap: "/game/game4/mekong-now.jpg",
		differences: [
			{
				id: "river-path",
				title: "Dòng sông đổi hướng",
				description:
					"Dòng chảy của sông đã thay đổi hướng do phù sa và xói mòn.",
				position: { x: 0.45, y: 0.38 },
			},
			{
				id: "land-expansion",
				title: "Đất liền mở rộng",
				description: "Phù sa đã tạo nên vùng đất mới, mở rộng bờ sông.",
				position: { x: 0.72, y: 0.65 },
			},
			{
				id: "lost-tributary",
				title: "Phụ lưu biến mất",
				description: "Một nhánh phụ lưu của sông đã khô cạn và biến mất.",
				position: { x: 0.28, y: 0.52 },
			},
			{
				id: "new-island",
				title: "Cù lao mới",
				description: "Một cù lao mới đã được hình thành giữa dòng sông.",
				position: { x: 0.56, y: 0.45 },
			},
			{
				id: "forest-cleared",
				title: "Rừng ngập mặn bị mất",
				description:
					"Một vùng rừng ngập mặn đã bị khai phá thành đất canh tác.",
				position: { x: 0.18, y: 0.32 },
			},
		],
	},
	{
		id: "hue-citadel",
		name: "Kinh thành Huế",
		pastMap: "/game/game4/hue-past.jpg",
		currentMap: "/game/game4/hue-now.jpg",
		differences: [
			{
				id: "wall-broken",
				title: "Tường thành bị đổ",
				description:
					"Một phần tường thành đã bị đổ sập sau nhiều năm chiến tranh.",
				position: { x: 0, y: 0 },
			},
			{
				id: "moat-filled",
				title: "Hào nước bị lấp",
				description:
					"Hào nước bao quanh thành đã bị lấp một phần để làm đường.",
				position: { x: 0.2, y: 0 },
			},
		],
	},
	{
		id: "hanoi-old-quarter",
		name: "Phố cổ Hà Nội",
		pastMap: "/game/game4/hanoi-past.jpg",
		currentMap: "/game/game4/hanoi-now.jpg",
		differences: [
			{
				id: "street-widened",
				title: "Đường phố mở rộng",
				description: "Con phố đã được mở rộng để đáp ứng giao thông hiện đại.",
				position: { x: 0.48, y: 0.56 },
			},
			{
				id: "old-building-gone",
				title: "Tòa nhà cổ biến mất",
				description:
					"Một tòa nhà lịch sử đã bị phá bỏ và thay thế bằng công trình mới.",
				position: { x: 0.23, y: 0.35 },
			},
			{
				id: "lake-shrunk",
				title: "Hồ thu hẹp",
				description: "Hồ nước trong khu vực đã bị thu hẹp diện tích.",
				position: { x: 0.76, y: 0.42 },
			},
			{
				id: "temple-relocated",
				title: "Đền chùa dịch chuyển",
				description:
					"Ngôi đền đã được di dời đến vị trí khác trong quá trình quy hoạch.",
				position: { x: 0.34, y: 0.68 },
			},
			{
				id: "bridge-new",
				title: "Cầu mới xuất hiện",
				description:
					"Một cây cầu mới đã được xây dựng, không có trong bản đồ cổ.",
				position: { x: 0.62, y: 0.22 },
			},
		],
	},
	{
		id: "dalat-valley",
		name: "Thung lũng Đà Lạt",
		pastMap: "/game/game4/dalat-past.jpg",
		currentMap: "/game/game4/dalat-now.jpg",
		differences: [
			{
				id: "forest-reduced",
				title: "Rừng thông thu hẹp",
				description: "Diện tích rừng thông đã giảm đáng kể do đô thị hóa.",
				position: { x: 0.42, y: 0.35 },
			},
			{
				id: "lake-expanded",
				title: "Hồ mở rộng",
				description: "Hồ nước đã được mở rộng và điều chỉnh bờ.",
				position: { x: 0.65, y: 0.48 },
			},
			{
				id: "hill-leveled",
				title: "Đồi bị san phẳng",
				description: "Một ngọn đồi đã bị san phẳng để xây dựng.",
				position: { x: 0.28, y: 0.62 },
			},
			{
				id: "waterfall-diverted",
				title: "Thác nước đổi hướng",
				description: "Dòng thác đã thay đổi hướng chảy do địa hình biến đổi.",
				position: { x: 0.78, y: 0.25 },
			},
			{
				id: "valley-narrowed",
				title: "Thung lũng thu hẹp",
				description: "Thung lũng đã trở nên hẹp hơn do sạt lở đất.",
				position: { x: 0.53, y: 0.72 },
			},
		],
	},
];

export default vietnamLocations;
