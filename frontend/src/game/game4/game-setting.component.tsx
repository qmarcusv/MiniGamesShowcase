import { useState, useRef } from "react";
import {
	vietnamLocations,
	VietnamLocation,
	DifferenceSpot,
} from "./vietnam-locations";
import { motion } from "framer-motion";
import {
	FaMapMarkedAlt,
	FaCompass,
	FaSave,
	FaTrash,
	FaPlus,
	FaUpload,
	FaPencilAlt,
	FaCheck,
	FaTimes,
	FaImage,
	FaInfoCircle,
	FaArrowLeft,
	FaCog,
	FaHome,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Game4Setting() {
	const navigate = useNavigate();
	const [locations, setLocations] =
		useState<VietnamLocation[]>(vietnamLocations);
	const [selectedLocation, setSelectedLocation] =
		useState<VietnamLocation | null>(locations[0]);
	const [activeImage, setActiveImage] = useState<"pastMap" | "currentMap">(
		"pastMap"
	);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [editingSpot, setEditingSpot] = useState<DifferenceSpot | null>(null);
	const [showSpotForm, setShowSpotForm] = useState(false);
	const [showLocationForm, setShowLocationForm] = useState(false);
	const [newLocation, setNewLocation] = useState<Partial<VietnamLocation>>({
		id: "",
		name: "",
		pastMap: "",
		currentMap: "",
		differences: [],
	});

	const pastMapRef = useRef<HTMLImageElement>(null);
	const currentMapRef = useRef<HTMLImageElement>(null);
	const pastFileInputRef = useRef<HTMLInputElement>(null);
	const currentFileInputRef = useRef<HTMLInputElement>(null);

	// Thêm component Circle để hiển thị vòng tròn
	const Circle = ({
		x,
		y,
		onClick,
	}: {
		x: number;
		y: number;
		onClick?: (e: React.MouseEvent) => void;
	}) => (
		<div
			className="absolute w-6 h-6 border-2 border-red-500 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
			style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
			onClick={onClick}
		/>
	);

	// Xử lý khi click vào bản đồ để thêm điểm khác biệt
	const handleMapClick = (e: React.MouseEvent<HTMLImageElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		console.log(`Clicked at (${x}, ${y})`);
		// Thêm logic xử lý click vào đây
	};

	// Lưu điểm khác biệt
	const handleSaveSpot = () => {
		if (!selectedLocation || !editingSpot) return;

		setLocations((prevLocations) => {
			const updatedLocations = [...prevLocations];
			const locationIndex = updatedLocations.findIndex(
				(loc) => loc.id === selectedLocation.id
			);

			if (locationIndex === -1) return prevLocations;

			// Nếu đang chỉnh sửa điểm hiện có
			if (editingIndex !== null) {
				updatedLocations[locationIndex].differences[editingIndex] = editingSpot;
			} else {
				// Thêm điểm mới
				updatedLocations[locationIndex].differences.push(editingSpot);
			}

			// Cập nhật state
			setSelectedLocation(updatedLocations[locationIndex]);
			return updatedLocations;
		});

		// Reset form
		setEditingSpot(null);
		setEditingIndex(null);
		setShowSpotForm(false);
	};

	// Xử lý chỉnh sửa điểm khác biệt
	const handleEditSpot = (index: number) => {
		if (!selectedLocation) return;
		setEditingSpot({ ...selectedLocation.differences[index] });
		setEditingIndex(index);
		setShowSpotForm(true);
	};

	// Xóa điểm khác biệt
	const handleDeleteSpot = (index: number) => {
		if (!selectedLocation) return;

		if (!window.confirm("Bạn có chắc chắn muốn xóa điểm khác biệt này?"))
			return;

		setLocations((prevLocations) => {
			const updatedLocations = [...prevLocations];
			const locationIndex = updatedLocations.findIndex(
				(loc) => loc.id === selectedLocation.id
			);

			if (locationIndex === -1) return prevLocations;

			// Xóa điểm
			updatedLocations[locationIndex].differences.splice(index, 1);

			// Cập nhật state
			setSelectedLocation(updatedLocations[locationIndex]);
			return updatedLocations;
		});
	};

	// Thêm địa điểm mới
	const handleAddLocation = () => {
		if (!newLocation.id || !newLocation.name) {
			alert("Vui lòng nhập ID và tên địa điểm");
			return;
		}

		// Kiểm tra ID đã tồn tại
		if (locations.some((loc) => loc.id === newLocation.id)) {
			alert("ID địa điểm đã tồn tại, vui lòng chọn ID khác");
			return;
		}

		const locationToAdd: VietnamLocation = {
			id: newLocation.id,
			name: newLocation.name,
			pastMap: newLocation.pastMap || "/game/game4/placeholder.jpg",
			currentMap: newLocation.currentMap || "/game/game4/placeholder.jpg",
			differences: [],
		};

		setLocations((prev) => [...prev, locationToAdd]);
		setSelectedLocation(locationToAdd);
		setNewLocation({
			id: "",
			name: "",
			pastMap: "",
			currentMap: "",
			differences: [],
		});
		setShowLocationForm(false);
	};

	// Xử lý xóa địa điểm
	const handleDeleteLocation = () => {
		if (!selectedLocation) return;

		if (
			!window.confirm(
				`Bạn có chắc chắn muốn xóa địa điểm "${selectedLocation.name}"?`
			)
		)
			return;

		setLocations((prev) =>
			prev.filter((loc) => loc.id !== selectedLocation.id)
		);
		setSelectedLocation(locations.length > 1 ? locations[0] : null);
	};

	// Xử lý upload ảnh
	const handleImageUpload = (
		e: React.ChangeEvent<HTMLInputElement>,
		mapType: "pastMap" | "currentMap"
	) => {
		if (!e.target.files || !e.target.files[0] || !selectedLocation) return;

		const file = e.target.files[0];
		const reader = new FileReader();

		reader.onload = (event) => {
			if (!event.target || typeof event.target.result !== "string") return;

			// Trong môi trường thực tế, bạn sẽ muốn lưu file lên server thay vì sử dụng Data URL
			// Đây chỉ là mô phỏng
			const imageUrl = event.target.result;

			setLocations((prevLocations) => {
				const updatedLocations = [...prevLocations];
				const locationIndex = updatedLocations.findIndex(
					(loc) => loc.id === selectedLocation.id
				);

				if (locationIndex === -1) return prevLocations;

				// Cập nhật URL ảnh
				updatedLocations[locationIndex] = {
					...updatedLocations[locationIndex],
					[mapType]: imageUrl,
				};

				// Cập nhật state
				setSelectedLocation(updatedLocations[locationIndex]);
				return updatedLocations;
			});
		};

		reader.readAsDataURL(file);
	};

	// Lưu tất cả thay đổi
	const handleSaveAll = () => {
		// Trong môi trường thực tế, bạn sẽ muốn lưu các thay đổi lên server
		localStorage.setItem("vietnamLocations", JSON.stringify(locations));
		alert("Đã lưu thay đổi thành công!");
	};

	return (
		<div className="relative min-h-screen bg-[#2b1d0e] text-amber-100 p-4">
			{/* Header */}
			<div className="fixed top-0 left-0 right-0 bg-[#1a120a] shadow-md z-50 px-4 py-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<button
							onClick={() => navigate("/")}
							className="text-amber-300 p-2 rounded hover:bg-amber-800/30"
						>
							<FaHome className="text-xl" />
						</button>
						<button
							onClick={() => navigate("/game4")}
							className="text-amber-300 p-2 rounded hover:bg-amber-800/30"
						>
							<FaArrowLeft className="text-xl" />
						</button>
						<h1 className="text-xl md:text-2xl font-pirate text-amber-300 flex items-center">
							<FaCog className="mr-2" /> Quản lý Game "Trở về tương lai"
						</h1>
					</div>

					<button
						onClick={handleSaveAll}
						className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded flex items-center"
					>
						<FaSave className="mr-2" /> Lưu tất cả
					</button>
				</div>
			</div>

			{/* Main Content */}
			<div className="pt-16 pb-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					{/* Sidebar - Danh sách địa điểm */}
					<div className="bg-[#1a120a]/80 rounded-lg p-4 md:col-span-1">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl text-amber-300 font-bold">Địa điểm</h2>
							<button
								onClick={() => setShowLocationForm(true)}
								className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded"
							>
								<FaPlus />
							</button>
						</div>

						<div className="space-y-2 max-h-[500px] overflow-y-auto">
							{locations.map((location) => (
								<button
									key={location.id}
									onClick={() => setSelectedLocation(location)}
									className={`w-full text-left px-3 py-2 rounded flex items-center ${
										selectedLocation?.id === location.id
											? "bg-amber-800/70 text-amber-200"
											: "hover:bg-amber-900/40 text-amber-300"
									}`}
								>
									<FaMapMarkedAlt className="mr-2" />
									<span className="truncate">{location.name}</span>
									<span className="ml-auto text-xs bg-amber-900/60 px-2 py-1 rounded-full">
										{location.differences.length}
									</span>
								</button>
							))}
						</div>
					</div>

					{/* Main content - Chỉnh sửa bản đồ */}
					<div className="md:col-span-3">
						{selectedLocation ? (
							<div className="bg-[#1a120a]/80 rounded-lg p-4">
								<div className="flex justify-between items-center mb-4">
									<h2 className="text-2xl text-amber-300 font-bold flex items-center">
										<FaCompass className="mr-2" /> {selectedLocation.name}
									</h2>

									<div className="flex space-x-2">
										<button
											onClick={() => setShowLocationForm(true)}
											className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded flex items-center"
										>
											<FaPencilAlt className="mr-1" /> Sửa
										</button>
										<button
											onClick={handleDeleteLocation}
											className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center"
										>
											<FaTrash className="mr-1" /> Xóa
										</button>
									</div>
								</div>

								{/* Tabs */}
								<div className="flex mb-4 border-b border-amber-800/50">
									<button
										onClick={() => setActiveImage("pastMap")}
										className={`px-4 py-2 ${
											activeImage === "pastMap"
												? "border-b-2 border-amber-500 text-amber-300"
												: "text-amber-400/70 hover:text-amber-300"
										}`}
									>
										Bản đồ quá khứ
									</button>
									<button
										onClick={() => setActiveImage("currentMap")}
										className={`px-4 py-2 ${
											activeImage === "currentMap"
												? "border-b-2 border-amber-500 text-amber-300"
												: "text-amber-400/70 hover:text-amber-300"
										}`}
									>
										Bản đồ hiện tại
									</button>
								</div>

								{/* Khu vực bản đồ */}
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
									{/* Bản đồ */}
									<div>
										<div className="bg-[#0a0705]/80 rounded-lg p-2 mb-3">
											<div className="flex justify-between items-center mb-2">
												<h3 className="text-lg text-amber-300">
													{activeImage === "pastMap"
														? "Bản đồ quá khứ"
														: "Bản đồ hiện tại"}
												</h3>

												<div>
													<input
														type="file"
														ref={
															activeImage === "pastMap"
																? pastFileInputRef
																: currentFileInputRef
														}
														onChange={(e) => handleImageUpload(e, activeImage)}
														accept="image/*"
														className="hidden"
													/>
													<button
														onClick={() =>
															activeImage === "pastMap"
																? pastFileInputRef.current?.click()
																: currentFileInputRef.current?.click()
														}
														className="bg-amber-700/70 hover:bg-amber-700 text-white px-3 py-1 rounded flex items-center text-sm"
													>
														<FaUpload className="mr-1" /> Tải ảnh lên
													</button>
												</div>
											</div>

											<div className="relative">
												<img
													ref={pastMapRef}
													src={selectedLocation.pastMap}
													alt="Past Map"
													className="max-h-[calc(100%-2rem)] max-w-[calc(100%-2rem)] object-contain"
													onClick={handleMapClick}
												/>
												{selectedLocation.differences.map((diff, index) => (
													<Circle
														key={index}
														x={diff.position.x}
														y={diff.position.y}
														onClick={(e) => handleEditSpot(index)}
													/>
												))}
											</div>

											<div className="mt-2 text-amber-300/70 text-sm text-center">
												<FaInfoCircle className="inline-block mr-1" />
												Click vào bản đồ để thêm điểm khác biệt mới
											</div>
										</div>
									</div>

									{/* Danh sách các điểm */}
									<div className="bg-[#0a0705]/80 rounded-lg p-3">
										<h3 className="text-lg text-amber-300 mb-3 flex items-center">
											<FaCompass className="mr-2" /> Danh sách điểm khác biệt (
											{selectedLocation.differences.length})
										</h3>

										<div className="max-h-[350px] overflow-y-auto space-y-3">
											{selectedLocation.differences.length > 0 ? (
												selectedLocation.differences.map((spot, index) => (
													<div
														key={spot.id}
														className="bg-amber-900/20 border border-amber-800/40 rounded-lg p-3 hover:bg-amber-900/30"
													>
														<div className="flex justify-between">
															<h4 className="font-bold text-amber-300 flex items-center">
																<span className="bg-amber-800 text-amber-200 rounded-full w-5 h-5 inline-flex items-center justify-center text-xs mr-2">
																	{index + 1}
																</span>
																{spot.title}
															</h4>

															<div className="flex space-x-1">
																<button
																	onClick={() => handleEditSpot(index)}
																	className="text-amber-400 hover:text-amber-300 p-1"
																>
																	<FaPencilAlt />
																</button>
																<button
																	onClick={() => handleDeleteSpot(index)}
																	className="text-red-400 hover:text-red-300 p-1"
																>
																	<FaTrash />
																</button>
															</div>
														</div>

														<p className="text-sm text-amber-200/80 mt-1">
															{spot.description}
														</p>

														<div className="mt-2 text-xs text-amber-400/60">
															Vị trí: {Math.round(spot.position.x * 100)}%,{" "}
															{Math.round(spot.position.y * 100)}%
														</div>
													</div>
												))
											) : (
												<div className="text-center py-10 text-amber-400/60">
													<FaInfoCircle className="text-3xl mx-auto mb-3" />
													<p>
														Chưa có điểm khác biệt nào. Click vào bản đồ để thêm
														điểm mới.
													</p>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className="bg-[#1a120a]/80 rounded-lg p-8 text-center">
								<FaMapMarkedAlt className="text-5xl mx-auto mb-4 text-amber-400/60" />
								<h2 className="text-2xl text-amber-300 mb-3">
									Không có địa điểm nào
								</h2>
								<p className="text-amber-200/80 mb-4">
									Vui lòng tạo một địa điểm mới để bắt đầu
								</p>
								<button
									onClick={() => setShowLocationForm(true)}
									className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded inline-flex items-center"
								>
									<FaPlus className="mr-2" /> Thêm địa điểm mới
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Modal thêm/sửa địa điểm */}
			{showLocationForm && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-[#1a120a] rounded-lg shadow-xl max-w-md w-full p-5">
						<h2 className="text-xl text-amber-300 mb-4 font-bold flex items-center">
							<FaMapMarkedAlt className="mr-2" />
							{newLocation.id ? "Thêm địa điểm mới" : "Chỉnh sửa địa điểm"}
						</h2>

						<div className="space-y-4">
							<div>
								<label className="block text-amber-200 mb-1">ID địa điểm</label>
								<input
									type="text"
									value={newLocation.id}
									onChange={(e) =>
										setNewLocation({ ...newLocation, id: e.target.value })
									}
									className="w-full bg-[#2b1d0e] text-amber-100 border border-amber-800/50 rounded px-3 py-2"
									placeholder="hanoi-old-quarter"
								/>
								<p className="text-xs text-amber-400/70 mt-1">
									ID phải là duy nhất và không có khoảng trắng
								</p>
							</div>

							<div>
								<label className="block text-amber-200 mb-1">
									Tên địa điểm
								</label>
								<input
									type="text"
									value={newLocation.name}
									onChange={(e) =>
										setNewLocation({ ...newLocation, name: e.target.value })
									}
									className="w-full bg-[#2b1d0e] text-amber-100 border border-amber-800/50 rounded px-3 py-2"
									placeholder="Phố cổ Hà Nội"
								/>
							</div>
						</div>

						<div className="flex justify-end space-x-3 mt-6">
							<button
								onClick={() => setShowLocationForm(false)}
								className="px-4 py-2 text-amber-300 hover:bg-amber-900/30 rounded"
							>
								Hủy
							</button>
							<button
								onClick={handleAddLocation}
								className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded flex items-center"
							>
								<FaSave className="mr-2" /> Lưu
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Modal thêm/sửa điểm khác biệt */}
			{showSpotForm && editingSpot && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-[#1a120a] rounded-lg shadow-xl max-w-md w-full p-5">
						<h2 className="text-xl text-amber-300 mb-4 font-bold flex items-center">
							<FaCompass className="mr-2" />
							{editingIndex !== null
								? "Chỉnh sửa điểm khác biệt"
								: "Thêm điểm khác biệt mới"}
						</h2>

						<div className="space-y-4">
							<div>
								<label className="block text-amber-200 mb-1">Tiêu đề</label>
								<input
									type="text"
									value={editingSpot.title}
									onChange={(e) =>
										setEditingSpot({ ...editingSpot, title: e.target.value })
									}
									className="w-full bg-[#2b1d0e] text-amber-100 border border-amber-800/50 rounded px-3 py-2"
									placeholder="Ví dụ: Cây cầu mới xuất hiện"
								/>
							</div>

							<div>
								<label className="block text-amber-200 mb-1">
									Mô tả chi tiết
								</label>
								<textarea
									value={editingSpot.description}
									onChange={(e) =>
										setEditingSpot({
											...editingSpot,
											description: e.target.value,
										})
									}
									className="w-full bg-[#2b1d0e] text-amber-100 border border-amber-800/50 rounded px-3 py-2 h-24"
									placeholder="Mô tả chi tiết về điểm khác biệt này..."
								/>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className="block text-amber-200 mb-1">
										Vị trí X (%)
									</label>
									<input
										type="number"
										min="0"
										max="100"
										value={Math.round(editingSpot.position.x * 100)}
										onChange={(e) =>
											setEditingSpot({
												...editingSpot,
												position: {
													...editingSpot.position,
													x: Number(e.target.value) / 100,
												},
											})
										}
										className="w-full bg-[#2b1d0e] text-amber-100 border border-amber-800/50 rounded px-3 py-2"
									/>
								</div>

								<div>
									<label className="block text-amber-200 mb-1">
										Vị trí Y (%)
									</label>
									<input
										type="number"
										min="0"
										max="100"
										value={Math.round(editingSpot.position.y * 100)}
										onChange={(e) =>
											setEditingSpot({
												...editingSpot,
												position: {
													...editingSpot.position,
													y: Number(e.target.value) / 100,
												},
											})
										}
										className="w-full bg-[#2b1d0e] text-amber-100 border border-amber-800/50 rounded px-3 py-2"
									/>
								</div>
							</div>
						</div>

						<div className="flex justify-end space-x-3 mt-6">
							<button
								onClick={() => {
									setEditingSpot(null);
									setEditingIndex(null);
									setShowSpotForm(false);
								}}
								className="px-4 py-2 text-amber-300 hover:bg-amber-900/30 rounded flex items-center"
							>
								<FaTimes className="mr-2" /> Hủy
							</button>
							<button
								onClick={handleSaveSpot}
								className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded flex items-center"
							>
								<FaCheck className="mr-2" /> Lưu
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
