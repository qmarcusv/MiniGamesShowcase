import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Place,
	places,
	createPlace,
	isValidPosition,
	isPositionAvailable,
} from "./game-setting";
import { FaArrowLeft, FaSave, FaPlus, FaTrash, FaEdit } from "react-icons/fa";

export default function GameSetting() {
	const navigate = useNavigate();
	const [placesList, setPlacesList] = useState<Place[]>(places);
	const [editingPlace, setEditingPlace] = useState<Place | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState<Partial<Place>>({
		id: "",
		name: "",
		position: { x: 0, y: 0 },
		builtYear: 0,
		architect: "",
		image: "",
		history: "",
	});

	const handleBack = () => {
		navigate(-1);
	};

	const handleSave = () => {
		// Lưu danh sách địa điểm vào file
		// Trong thực tế, đây sẽ là API call để lưu vào database
		console.log("Đã lưu danh sách địa điểm:", placesList);
		alert("Đã lưu thành công!");
	};

	const handleAdd = () => {
		setEditingPlace(null);
		setFormData({
			id: "",
			name: "",
			position: { x: 0, y: 0 },
			builtYear: 0,
			architect: "",
			image: "",
			history: "",
		});
		setShowForm(true);
	};

	const handleEdit = (place: Place) => {
		setEditingPlace(place);
		setFormData(place);
		setShowForm(true);
	};

	const handleDelete = (id: string) => {
		if (window.confirm("Bạn có chắc muốn xóa địa điểm này?")) {
			setPlacesList(placesList.filter((p) => p.id !== id));
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.id || !formData.name || !formData.position) {
			alert("Vui lòng điền đầy đủ thông tin!");
			return;
		}

		const { x, y } = formData.position;
		if (!isValidPosition(x, y)) {
			alert("Vị trí không hợp lệ! Tọa độ phải từ 0 đến 1.");
			return;
		}

		if (!isPositionAvailable(x, y, editingPlace?.id)) {
			alert("Vị trí này đã có địa điểm khác!");
			return;
		}

		const newPlace = createPlace(
			formData.id,
			formData.name,
			formData.position.x,
			formData.position.y,
			formData.builtYear || 0,
			formData.architect || "",
			formData.image || "",
			formData.history || ""
		);

		if (editingPlace) {
			setPlacesList(
				placesList.map((p) => (p.id === editingPlace.id ? newPlace : p))
			);
		} else {
			setPlacesList([...placesList, newPlace]);
		}

		setShowForm(false);
		setEditingPlace(null);
	};

	return (
		<div className="min-h-screen bg-[#1a2035] text-white p-8">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<button
						onClick={handleBack}
						className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
					>
						<FaArrowLeft /> Quay lại
					</button>
					<h1 className="text-2xl font-bold text-amber-400">
						Cài đặt địa điểm
					</h1>
					<button
						onClick={handleSave}
						className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg"
					>
						<FaSave /> Lưu
					</button>
				</div>

				{/* Danh sách địa điểm */}
				<div className="bg-[#0c1e35] border-4 border-amber-600 rounded-lg p-6 mb-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-bold text-amber-300">
							Danh sách địa điểm
						</h2>
						<button
							onClick={handleAdd}
							className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
						>
							<FaPlus /> Thêm địa điểm
						</button>
					</div>
					<div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
						{placesList.map((place) => (
							<div
								key={place.id}
								className="bg-[#1a2035] p-4 rounded-lg border border-amber-600/30"
							>
								<div className="flex justify-between items-start">
									<div>
										<h3 className="text-lg font-semibold text-amber-300">
											{place.name}
										</h3>
										<p className="text-sm text-gray-400">
											Vị trí: x: {place.position.x.toFixed(2)}, y:{" "}
											{place.position.y.toFixed(2)}
										</p>
										<p className="text-sm text-gray-400">
											Năm xây dựng: {place.builtYear} (Tuổi: {place.age} năm)
										</p>
										<p className="text-sm text-gray-400">
											Kiến trúc sư: {place.architect}
										</p>
									</div>
									<div className="flex gap-2">
										<button
											onClick={() => handleEdit(place)}
											className="p-2 bg-amber-600 hover:bg-amber-500 rounded-lg"
										>
											<FaEdit />
										</button>
										<button
											onClick={() => handleDelete(place.id)}
											className="p-2 bg-red-600 hover:bg-red-500 rounded-lg"
										>
											<FaTrash />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Form thêm/sửa địa điểm */}
				{showForm && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
						<div className="bg-[#0c1e35] border-4 border-amber-600 rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto">
							<h2 className="text-xl font-bold text-amber-300 mb-4">
								{editingPlace ? "Sửa địa điểm" : "Thêm địa điểm mới"}
							</h2>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-amber-200 mb-1">
										ID
									</label>
									<input
										type="text"
										value={formData.id}
										onChange={(e) =>
											setFormData({ ...formData, id: e.target.value })
										}
										className="w-full px-3 py-2 bg-[#1a2035] border border-amber-600/30 rounded-lg text-white"
										placeholder="Nhập ID địa điểm"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-amber-200 mb-1">
										Tên địa điểm
									</label>
									<input
										type="text"
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										className="w-full px-3 py-2 bg-[#1a2035] border border-amber-600/30 rounded-lg text-white"
										placeholder="Nhập tên địa điểm"
										required
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-amber-200 mb-1">
											Vị trí X (0-1)
											<span className="text-xs text-gray-400 ml-1">
												(Tọa độ ngang trên bản đồ)
											</span>
										</label>
										<input
											type="number"
											step="0.01"
											min="0"
											max="1"
											value={formData.position?.x || 0}
											onChange={(e) =>
												setFormData({
													...formData,
													position: {
														x: parseFloat(e.target.value),
														y: formData.position?.y || 0,
													},
												})
											}
											className="w-full px-3 py-2 bg-[#1a2035] border border-amber-600/30 rounded-lg text-white"
											required
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-amber-200 mb-1">
											Vị trí Y (0-1)
											<span className="text-xs text-gray-400 ml-1">
												(Tọa độ dọc trên bản đồ)
											</span>
										</label>
										<input
											type="number"
											step="0.01"
											min="0"
											max="1"
											value={formData.position?.y || 0}
											onChange={(e) =>
												setFormData({
													...formData,
													position: {
														x: formData.position?.x || 0,
														y: parseFloat(e.target.value),
													},
												})
											}
											className="w-full px-3 py-2 bg-[#1a2035] border border-amber-600/30 rounded-lg text-white"
											required
										/>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-amber-200 mb-1">
										Năm xây dựng
									</label>
									<input
										type="number"
										value={formData.builtYear}
										onChange={(e) =>
											setFormData({
												...formData,
												builtYear: parseInt(e.target.value),
											})
										}
										className="w-full px-3 py-2 bg-[#1a2035] border border-amber-600/30 rounded-lg text-white"
										placeholder="Nhập năm xây dựng"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-amber-200 mb-1">
										Kiến trúc sư
									</label>
									<input
										type="text"
										value={formData.architect}
										onChange={(e) =>
											setFormData({ ...formData, architect: e.target.value })
										}
										className="w-full px-3 py-2 bg-[#1a2035] border border-amber-600/30 rounded-lg text-white"
										placeholder="Nhập tên kiến trúc sư"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-amber-200 mb-1">
										Hình ảnh
									</label>
									<div className="flex gap-2">
										<input
											type="text"
											value={formData.image}
											onChange={(e) =>
												setFormData({ ...formData, image: e.target.value })
											}
											className="flex-1 px-3 py-2 bg-[#1a2035] border border-amber-600/30 rounded-lg text-white"
											placeholder="Nhập đường dẫn hình ảnh"
											required
										/>
										<label className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg cursor-pointer">
											<input
												type="file"
												accept="image/*"
												className="hidden"
												onChange={(e) => {
													const file = e.target.files?.[0];
													if (file) {
														// Trong thực tế, đây sẽ là API upload file
														// và trả về URL của file đã upload
														const fakeUrl = URL.createObjectURL(file);
														setFormData({ ...formData, image: fakeUrl });
													}
												}}
											/>
											Chọn ảnh
										</label>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-amber-200 mb-1">
										Lịch sử
									</label>
									<textarea
										value={formData.history}
										onChange={(e) =>
											setFormData({ ...formData, history: e.target.value })
										}
										className="w-full px-3 py-2 bg-[#1a2035] border border-amber-600/30 rounded-lg text-white h-32"
										placeholder="Nhập lịch sử địa điểm"
										required
									/>
								</div>
								<div className="flex justify-end gap-4 pt-4">
									<button
										type="button"
										onClick={() => setShowForm(false)}
										className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
									>
										Hủy
									</button>
									<button
										type="submit"
										className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg"
									>
										{editingPlace ? "Cập nhật" : "Thêm mới"}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
