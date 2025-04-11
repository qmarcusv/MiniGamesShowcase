import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
	FaArrowLeft,
	FaSave,
	FaPlus,
	FaTrash,
	FaEdit,
	FaMapMarkedAlt,
	FaUpload,
	FaImage,
	FaInfoCircle,
} from "react-icons/fa";

interface Location {
	id: string;
	name: string;
	pastMap: string;
	currentMap: string;
	differences: {
		position: { x: number; y: number };
		hint: string;
	}[];
}

export default function Game4Setting() {
	const navigate = useNavigate();
	const [locations, setLocations] = useState<Location[]>([
		{
			id: "1",
			name: "Hồ Gươm",
			pastMap: "/maps/past/hoguom.jpg",
			currentMap: "/maps/current/hoguom.jpg",
			differences: [
				{
					position: { x: 0.3, y: 0.4 },
					hint: "Cầu Thê Húc có màu sắc khác biệt",
				},
			],
		},
	]);
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(
		null
	);
	const [showAddForm, setShowAddForm] = useState(false);
	const [formData, setFormData] = useState<{
		id: string;
		name: string;
		pastMap: string;
		currentMap: string;
		differences: {
			position: { x: number; y: number };
			hint: string;
		}[];
	}>({
		id: "",
		name: "",
		pastMap: "",
		currentMap: "",
		differences: [],
	});
	const [activeMap, setActiveMap] = useState<"past" | "current">("past");
	const [editingDiff, setEditingDiff] = useState<{
		index: number;
		x: number;
		y: number;
		hint: string;
	} | null>(null);

	const pastMapRef = useRef<HTMLImageElement>(null);
	const currentMapRef = useRef<HTMLImageElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleBack = () => {
		if (
			window.confirm(
				"Bạn có chắc muốn quay lại? Các thay đổi chưa lưu sẽ bị mất."
			)
		) {
			navigate(-1);
		}
	};

	const handleSave = () => {
		console.log("Đã lưu:", locations);
		alert("Đã lưu thành công!");
	};

	const handleAddLocation = () => {
		setFormData({
			id: (locations.length + 1).toString(),
			name: "",
			pastMap: "",
			currentMap: "",
			differences: [],
		});
		setShowAddForm(true);
		setSelectedLocation(null);
	};

	const handleEditLocation = (location: Location) => {
		setFormData(location);
		setShowAddForm(true);
	};

	const handleDeleteLocation = (id: string) => {
		if (window.confirm("Bạn có chắc muốn xóa địa điểm này?")) {
			setLocations(locations.filter((l) => l.id !== id));
			setSelectedLocation(null);
		}
	};

	const handleMapClick = (e: React.MouseEvent<HTMLImageElement>) => {
		if (!showAddForm) return;

		const rect = e.currentTarget.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width;
		const y = (e.clientY - rect.top) / rect.height;

		setEditingDiff({
			index: formData.differences.length,
			x,
			y,
			hint: "Nhập gợi ý cho điểm khác biệt này",
		});
	};

	const handleSaveDiff = () => {
		if (!editingDiff) return;

		const newDiffs = [...formData.differences];
		if (editingDiff.index < newDiffs.length) {
			newDiffs[editingDiff.index] = {
				position: { x: editingDiff.x, y: editingDiff.y },
				hint: editingDiff.hint,
			};
		} else {
			newDiffs.push({
				position: { x: editingDiff.x, y: editingDiff.y },
				hint: editingDiff.hint,
			});
		}

		setFormData({ ...formData, differences: newDiffs });
		setEditingDiff(null);
	};

	const handleImageUpload = (
		e: React.ChangeEvent<HTMLInputElement>,
		type: "past" | "current"
	) => {
		if (!e.target.files || !e.target.files[0]) return;

		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onloadend = () => {
			const imageUrl = reader.result as string;
			setFormData({
				...formData,
				[type === "past" ? "pastMap" : "currentMap"]: imageUrl,
			});
		};
		reader.readAsDataURL(file);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-amber-900 to-amber-950 text-amber-100">
			{/* Header */}
			<div className="bg-black/40 border-b border-amber-800/30 shadow-lg">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<button
							onClick={handleBack}
							className="flex items-center gap-2 px-4 py-2 bg-amber-900/50 hover:bg-amber-800/50 rounded-lg transition-all"
						>
							<FaArrowLeft /> Quay lại
						</button>
						<h1 className="text-2xl font-bold text-center text-amber-400">
							Quản lý Game "Trở về tương lai"
						</h1>
						<button
							onClick={handleSave}
							className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg transition-all"
						>
							<FaSave /> Lưu thay đổi
						</button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="grid grid-cols-12 gap-6">
					{/* Sidebar - Danh sách địa điểm */}
					<div className="col-span-3">
						<div className="bg-black/30 rounded-lg p-4">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-lg font-semibold text-amber-400">
									Danh sách địa điểm
								</h2>
								<button
									onClick={handleAddLocation}
									className="flex items-center gap-2 px-3 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg transition-all text-white"
									title="Thêm địa điểm mới"
								>
									<FaPlus /> Thêm mới
								</button>
							</div>
							<div className="space-y-2">
								{locations.map((location) => (
									<div
										key={location.id}
										className="flex items-center justify-between p-3 rounded-lg bg-black/20 hover:bg-amber-900/20 border border-transparent"
									>
										<div className="flex items-center gap-2 flex-1">
											<FaMapMarkedAlt className="text-amber-500" />
											<span className="truncate">{location.name}</span>
										</div>
										<div className="flex gap-2 ml-2">
											<button
												onClick={() => handleDeleteLocation(location.id)}
												className="p-1.5 text-red-400 hover:text-red-300"
												title="Xóa"
											>
												<FaTrash />
											</button>
										</div>
									</div>
								))}
								{locations.length === 0 && (
									<div className="text-center py-8 text-amber-400/60">
										<FaMapMarkedAlt className="text-4xl mx-auto mb-2" />
										<p>Chưa có địa điểm nào</p>
										<p className="text-sm">Click "Thêm mới" để bắt đầu</p>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Right side - Preview area */}
					<div className="col-span-9">
						<div className="bg-black/30 rounded-lg p-8 text-center h-full flex items-center justify-center">
							<div>
								<FaMapMarkedAlt className="text-6xl text-amber-500/50 mx-auto mb-4" />
								<p className="text-xl text-amber-300 mb-4">
									Chào mừng đến với trình quản lý địa điểm
								</p>
								<button
									onClick={handleAddLocation}
									className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg transition-all text-white text-lg"
								>
									<FaPlus /> Thêm địa điểm mới
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Add Location Form Modal */}
			{showAddForm && (
				<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
					<div className="bg-gradient-to-br from-amber-900 to-amber-950 rounded-lg p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto">
						<h2 className="text-2xl font-bold text-amber-400 mb-6">
							Thêm địa điểm mới
						</h2>

						<div className="grid grid-cols-12 gap-6">
							{/* Left Column - Basic Info */}
							<div className="col-span-4">
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-amber-300 mb-1">
											Tên địa điểm
										</label>
										<input
											type="text"
											value={formData.name}
											onChange={(e) =>
												setFormData({ ...formData, name: e.target.value })
											}
											className="w-full px-3 py-2 bg-black/20 border border-amber-500/30 rounded-lg text-white"
											placeholder="Nhập tên địa điểm..."
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-amber-300 mb-1">
											Ảnh bản đồ quá khứ
										</label>
										<input
											type="file"
											onChange={(e) => handleImageUpload(e, "past")}
											accept="image/*"
											className="w-full px-3 py-2 bg-black/20 border border-amber-500/30 rounded-lg text-white"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-amber-300 mb-1">
											Ảnh bản đồ hiện tại
										</label>
										<input
											type="file"
											onChange={(e) => handleImageUpload(e, "current")}
											accept="image/*"
											className="w-full px-3 py-2 bg-black/20 border border-amber-500/30 rounded-lg text-white"
										/>
									</div>
								</div>
							</div>

							{/* Right Column - Map and Differences */}
							<div className="col-span-8">
								{/* Map Display */}
								<div className="relative border-2 border-amber-500/30 rounded-lg overflow-hidden bg-black/20 mb-6">
									<div className="flex gap-4 p-4 border-b border-amber-500/30">
										<button
											onClick={() => setActiveMap("past")}
											className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
												activeMap === "past"
													? "bg-amber-600 text-white"
													: "bg-amber-900/30 text-amber-300 hover:bg-amber-800/30"
											}`}
										>
											<FaImage /> Bản đồ quá khứ
										</button>
										<button
											onClick={() => setActiveMap("current")}
											className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
												activeMap === "current"
													? "bg-amber-600 text-white"
													: "bg-amber-900/30 text-amber-300 hover:bg-amber-800/30"
											}`}
										>
											<FaImage /> Bản đồ hiện tại
										</button>
									</div>
									<img
										src={
											activeMap === "past"
												? formData.pastMap
												: formData.currentMap
										}
										alt={`${formData.name} - ${
											activeMap === "past" ? "Past" : "Current"
										}`}
										className="w-full h-[400px] object-contain"
										onClick={handleMapClick}
									/>
									{activeMap === "past" &&
										formData.differences.map((diff, index) => (
											<div
												key={index}
												className="absolute w-6 h-6 -mt-3 -ml-3 border-2 border-amber-400 rounded-full cursor-pointer hover:bg-amber-400/20"
												style={{
													left: `${diff.position.x * 100}%`,
													top: `${diff.position.y * 100}%`,
												}}
												onClick={() =>
													setEditingDiff({
														index,
														x: diff.position.x,
														y: diff.position.y,
														hint: diff.hint,
													})
												}
											/>
										))}
								</div>

								{/* Differences List */}
								<div>
									<h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
										<FaInfoCircle /> Điểm khác biệt
									</h3>
									<div className="space-y-3">
										{formData.differences.map((diff, index) => (
											<div
												key={index}
												className="flex items-start gap-4 bg-black/20 p-4 rounded-lg"
											>
												<div className="flex-1">
													<div className="flex items-center gap-2 text-sm text-amber-300 mb-1">
														<span>Vị trí:</span>
														<span>X: {Math.round(diff.position.x * 100)}%</span>
														<span>Y: {Math.round(diff.position.y * 100)}%</span>
													</div>
													<p className="text-amber-100">{diff.hint}</p>
												</div>
												<div className="flex gap-2">
													<button
														onClick={() =>
															setEditingDiff({
																index,
																x: diff.position.x,
																y: diff.position.y,
																hint: diff.hint,
															})
														}
														className="p-2 text-amber-400 hover:text-amber-300"
													>
														<FaEdit />
													</button>
													<button
														onClick={() => {
															const newDiffs = formData.differences.filter(
																(_, i) => i !== index
															);
															setFormData({
																...formData,
																differences: newDiffs,
															});
														}}
														className="p-2 text-red-400 hover:text-red-300"
													>
														<FaTrash />
													</button>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>

						{/* Form Actions */}
						<div className="flex justify-end gap-4 mt-6 pt-4 border-t border-amber-500/30">
							<button
								onClick={() => setShowAddForm(false)}
								className="px-4 py-2 bg-amber-900/50 hover:bg-amber-800/50 rounded-lg"
							>
								Hủy
							</button>
							<button
								onClick={() => {
									setLocations([...locations, formData]);
									setShowAddForm(false);
								}}
								className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg"
							>
								Lưu địa điểm
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Difference Edit Modal */}
			{editingDiff && (
				<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
					<div className="bg-gradient-to-br from-amber-900 to-amber-950 rounded-lg p-6 w-[500px]">
						<h2 className="text-xl font-bold text-amber-400 mb-4">
							Chỉnh sửa điểm khác biệt
						</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-amber-300 mb-1">
									Gợi ý
								</label>
								<textarea
									value={editingDiff.hint}
									onChange={(e) =>
										setEditingDiff({ ...editingDiff, hint: e.target.value })
									}
									className="w-full px-3 py-2 bg-black/20 border border-amber-500/30 rounded-lg text-white"
									placeholder="Nhập gợi ý cho điểm khác biệt..."
									rows={3}
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-amber-300 mb-1">
										Vị trí X (%)
									</label>
									<input
										type="number"
										value={Math.round(editingDiff.x * 100)}
										onChange={(e) =>
											setEditingDiff({
												...editingDiff,
												x: Number(e.target.value) / 100,
											})
										}
										className="w-full px-3 py-2 bg-black/20 border border-amber-500/30 rounded-lg text-white"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-amber-300 mb-1">
										Vị trí Y (%)
									</label>
									<input
										type="number"
										value={Math.round(editingDiff.y * 100)}
										onChange={(e) =>
											setEditingDiff({
												...editingDiff,
												y: Number(e.target.value) / 100,
											})
										}
										className="w-full px-3 py-2 bg-black/20 border border-amber-500/30 rounded-lg text-white"
									/>
								</div>
							</div>
							<div className="flex justify-end gap-4 pt-4">
								<button
									onClick={() => setEditingDiff(null)}
									className="px-4 py-2 bg-amber-900/50 hover:bg-amber-800/50 rounded-lg"
								>
									Hủy
								</button>
								<button
									onClick={handleSaveDiff}
									className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg"
								>
									Lưu
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
