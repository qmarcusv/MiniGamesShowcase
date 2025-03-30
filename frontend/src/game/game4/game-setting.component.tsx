import { useState } from "react";
import {
	mapComparisons,
	MapComparison,
	DifferenceSpot,
} from "./game4-maps.tsx";

export default function Game4Setting() {
	const [selectedMap, setSelectedMap] = useState<MapComparison | null>(
		mapComparisons[0]
	);
	const [editingSpots, setEditingSpots] = useState<DifferenceSpot[]>(
		selectedMap?.differences || []
	);
	const [activeImage, setActiveImage] = useState<"past" | "current">("past");

	const handleClick = (e: React.MouseEvent, imageRef: HTMLDivElement) => {
		const rect = imageRef.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width;
		const y = (e.clientY - rect.top) / rect.height;

		const newSpot: DifferenceSpot = {
			id: `spot-${Date.now()}`,
			title: prompt("Tên điểm khác biệt:") || "Chưa đặt tên",
			description: prompt("Giải thích chi tiết:") || "Không có mô tả",
			position: { x, y },
		};

		setEditingSpots((prev) => [...prev, newSpot]);
	};

	const handleRemove = (id: string) => {
		setEditingSpots((prev) => prev.filter((s) => s.id !== id));
	};

	return (
		<div className="min-h-screen bg-slate-900 text-white p-4">
			<h1 className="text-3xl font-bold mb-6 text-center">
				🛠 Cài đặt bản đồ so sánh
			</h1>

			<div className="text-center mb-4">
				<select
					className="bg-white/10 text-white px-4 py-2 rounded"
					value={selectedMap?.id}
					onChange={(e) => {
						const found = mapComparisons.find((m) => m.id === e.target.value);
						if (found) {
							setSelectedMap(found);
							setEditingSpots(found.differences);
						}
					}}
				>
					{mapComparisons.map((m) => (
						<option key={m.id} value={m.id}>
							{m.name}
						</option>
					))}
				</select>
			</div>

			<div className="grid grid-cols-2 gap-4">
				{/* Image for marking spots */}
				<div>
					<h2 className="text-lg mb-2 text-center">
						Ảnh {activeImage === "past" ? "Quá Khứ" : "Hiện Tại"}
					</h2>
					<div
						className="relative w-full aspect-video border-2 border-white rounded-xl overflow-hidden cursor-crosshair"
						onClick={(e) => handleClick(e, e.currentTarget)}
					>
						<img
							src={
								activeImage === "past"
									? selectedMap?.pastImage
									: selectedMap?.currentImage
							}
							alt={activeImage}
							className="absolute inset-0 w-full h-full object-cover"
						/>
						{editingSpots.map((spot) => (
							<div
								key={spot.id}
								className="absolute border border-yellow-400 bg-yellow-300/30 rounded-full w-6 h-6 -ml-3 -mt-3"
								style={{
									left: `${spot.position.x * 100}%`,
									top: `${spot.position.y * 100}%`,
								}}
								title={spot.title}
							/>
						))}
					</div>

					<div className="flex justify-center gap-4 mt-4">
						<button
							className={`px-4 py-2 rounded-lg ${
								activeImage === "past" ? "bg-green-500" : "bg-gray-600"
							}`}
							onClick={() => setActiveImage("past")}
						>
							Quá khứ
						</button>
						<button
							className={`px-4 py-2 rounded-lg ${
								activeImage === "current" ? "bg-green-500" : "bg-gray-600"
							}`}
							onClick={() => setActiveImage("current")}
						>
							Hiện tại
						</button>
					</div>
				</div>

				{/* List of editable differences */}
				<div className="bg-white/5 p-4 rounded-xl max-h-[80vh] overflow-y-auto">
					<h3 className="text-xl font-semibold mb-4">
						📋 Danh sách điểm khác biệt
					</h3>
					{editingSpots.map((spot) => (
						<div key={spot.id} className="mb-4 bg-white/10 p-3 rounded">
							<div className="font-bold text-emerald-400">{spot.title}</div>
							<div className="text-sm text-slate-100">{spot.description}</div>
							<button
								onClick={() => handleRemove(spot.id)}
								className="mt-2 text-red-400 text-sm hover:underline"
							>
								Xóa điểm này
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
