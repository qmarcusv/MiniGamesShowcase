import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import ButtonSound from "../../feature/button-sound/button-sound.component";

interface PuzzleImage {
	id: string;
	name: string;
	description: string;
	imagePath: string;
}

export default function Game10Setting() {
	const [images, setImages] = useState<PuzzleImage[]>([]);
	const [showModal, setShowModal] = useState(true);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const file = formData.get("image") as File;
		const name = formData.get("name") as string;
		const description = formData.get("description") as string;

		if (!file || !name) return;

		try {
			// Tạm thời lưu local để test
			const newImage: PuzzleImage = {
				id: Date.now().toString(),
				name: name,
				description: description || "",
				imagePath: URL.createObjectURL(file),
			};
			setImages([...images, newImage]);
			form.reset();
		} catch (error) {
			console.error("Lỗi khi lưu ảnh:", error);
		}
	};

	const handleDelete = (id: string) => {
		if (!window.confirm("Xóa ảnh này?")) return;
		setImages(images.filter((img) => img.id !== id));
	};

	const handleSave = () => {
		// TODO: Implement API call to save all images
		alert("Đã lưu thành công!");
	};

	return (
		<div className="min-h-screen bg-gray-900 p-4">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-6 bg-gray-800 rounded-lg p-4">
					<div className="flex items-center gap-2">
						<ButtonSound
							onClick={() => window.history.back()}
							className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 font-medium flex items-center gap-2"
						>
							← Quay lại
						</ButtonSound>
					</div>
					<h1 className="text-2xl font-bold text-white">
						Cài đặt Game Xếp Hình
					</h1>
					<ButtonSound
						onClick={handleSave}
						className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
					>
						Lưu thay đổi
					</ButtonSound>
				</div>

				<div className="bg-gray-800 rounded-lg p-6 mb-6">
					<h2 className="text-2xl font-bold text-white mb-4">Thêm ảnh mới</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<input
								type="text"
								name="name"
								placeholder="Tên ảnh"
								className="w-full p-2 rounded bg-gray-700 text-white"
								required
							/>
						</div>
						<div>
							<textarea
								name="description"
								placeholder="Mô tả ảnh"
								className="w-full p-2 rounded bg-gray-700 text-white"
								rows={2}
							/>
						</div>
						<div>
							<input
								type="file"
								name="image"
								accept="image/*"
								className="w-full p-2 rounded bg-gray-700 text-white"
								required
							/>
						</div>
						<button
							type="submit"
							className="w-full bg-green-500 text-white p-3 rounded-lg text-lg font-bold hover:bg-green-600"
						>
							Thêm ảnh
						</button>
					</form>
				</div>

				<div className="bg-gray-800 rounded-lg p-6">
					<h2 className="text-2xl font-bold text-white mb-4">
						Danh sách ảnh ({images.length})
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
						{images.map((image) => (
							<div
								key={image.id}
								className="bg-gray-700 rounded-lg overflow-hidden"
							>
								<img
									src={image.imagePath}
									alt={image.name}
									className="w-full h-40 object-cover"
								/>
								<div className="p-3">
									<div className="flex justify-between items-start mb-2">
										<span className="text-white font-medium">{image.name}</span>
										<button
											onClick={() => handleDelete(image.id)}
											className="text-red-500 hover:text-red-600 ml-2"
										>
											<FaTrash />
										</button>
									</div>
									{image.description && (
										<p className="text-gray-400 text-sm">{image.description}</p>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
