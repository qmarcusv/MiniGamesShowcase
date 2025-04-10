import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
	FaMapMarkedAlt,
	FaCompass,
	FaSkull,
	FaShip,
	FaScroll,
	FaHome,
	FaArrowLeft,
	FaCog,
	FaSyncAlt,
	FaSearchPlus,
	FaSearchMinus,
	FaMap,
	FaInfoCircle,
	FaStar,
	FaTimes,
} from "react-icons/fa";
import { vietnamLocations, VietnamLocation } from "./vietnam-locations";
import foundSound from "/sound/correct.mp3";
import tickSound from "/sound/tick.mp3";
import hurrySound from "/sound/hurry.mp3";
import endSound from "/sound/end.mp3";
import { playSoundRepeatedly } from "../../feature/environment-sound/environment-sound.component";
import Conclusion4 from "./game-conclusion.component";
import { useNavigate, useLocation } from "react-router-dom";
import "./game.component.scss";

export default function Game4() {
	const navigate = useNavigate();
	const location = useLocation();
	const [selectedLocation, setSelectedLocation] =
		useState<VietnamLocation | null>(null);
	const [foundSpots, setFoundSpots] = useState<string[]>([]);
	const [timeLeft, setTimeLeft] = useState(240); // 4 phút
	const [startTime, setStartTime] = useState<number | null>(null);
	const [clickCount, setClickCount] = useState(0);
	const [showConclusion, setShowConclusion] = useState(false);
	const [showLocationDropdown, setShowLocationDropdown] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [zoomLevel] = useState(1);
	const [showHint, setShowHint] = useState(false);
	const [hintUsed, setHintUsed] = useState<string[]>([]);
	const [isPaused, setIsPaused] = useState(false);
	const [showExplanation, setShowExplanation] = useState(true);

	const mapContainerRef = useRef<HTMLDivElement>(null);
	const settingsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Lấy thông tin vị trí từ URL query parameter
		const params = new URLSearchParams(location.search);
		const locationId = params.get("location");

		if (locationId) {
			// Nếu timer đã chạy, không cho phép đổi địa điểm
			if (startTime) return;

			const selectedLocation = vietnamLocations.find(
				(loc) => loc.id === locationId
			);
			if (selectedLocation) {
				setSelectedLocation(selectedLocation);
			} else {
				// Nếu không tìm thấy vị trí, sử dụng vị trí đầu tiên mặc định
				setSelectedLocation(vietnamLocations[0]);
			}
		} else {
			// Nếu không có vị trí trong URL, sử dụng vị trí đầu tiên mặc định
			setSelectedLocation(vietnamLocations[0]);
		}

		// Reset game state
		setFoundSpots([]);
		setShowHint(false);
		setHintUsed([]);
		setIsPaused(false);
		setTimeLeft(240);
		setShowConclusion(false);
	}, [location.search, startTime]);

	useEffect(() => {
		if (!selectedLocation || showConclusion) return;

		const interval = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					setShowConclusion(true);
					playSoundRepeatedly(endSound, 1);
					return 0;
				}
				if (prev <= 10) playSoundRepeatedly(hurrySound, 1);
				else playSoundRepeatedly(tickSound, 1);
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [selectedLocation, showConclusion]);

	// Xử lý click để tìm điểm khác biệt
	const handleClick = (e: React.MouseEvent, mapType: "past" | "current") => {
		if (!selectedLocation || isPaused) return;

		if (!startTime) setStartTime(Date.now());
		setClickCount((prev) => prev + 1);

		const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width;
		const y = (e.clientY - rect.top) / rect.height;

		const tolerance = 0.05 / zoomLevel; // Điều chỉnh độ chính xác theo mức zoom
		const found = selectedLocation.differences.find(
			(spot) =>
				!foundSpots.includes(spot.id) &&
				Math.abs(spot.position.x - x) < tolerance &&
				Math.abs(spot.position.y - y) < tolerance
		);

		if (found) {
			new Audio(foundSound).play();
			setFoundSpots((prev) => [...prev, found.id]);

			// Hiển thị thông báo tìm thấy
			const notification = document.createElement("div");
			notification.className = "notification-popup";
			notification.textContent = `Phát hiện: ${found.title}`;
			document.body.appendChild(notification);

			setTimeout(() => {
				document.body.removeChild(notification);
			}, 2000);
		}
	};

	const handleShowHint = () => {
		const unrevealedSpots = selectedLocation?.differences.filter(
			(spot) => !foundSpots.includes(spot.id) && !hintUsed.includes(spot.id)
		);

		if (unrevealedSpots && unrevealedSpots.length > 0) {
			const nextHint = unrevealedSpots[0];
			setHintUsed((prev) => [...prev, nextHint.id]);
			setShowHint(true);

			setTimeLeft((prev) => {
				if (prev <= 60) return 3;
				return prev - 60;
			});

			const notification = document.createElement("div");
			notification.style.position = "fixed";
			notification.style.top = "50%";
			notification.style.left = "50%";
			notification.style.transform = "translate(-50%, -50%)";
			notification.style.zIndex = "1000";
			notification.style.minWidth = "300px";
			notification.style.maxWidth = "80%";
			notification.style.background = "rgba(43, 29, 14, 0.95)";
			notification.style.border = "2px solid #92400e";
			notification.style.borderRadius = "8px";
			notification.style.padding = "16px";
			notification.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.3)";
			notification.style.animation = "fadeInOut 5s ease-in-out";

			notification.innerHTML = `
				<div style="color: #fbbf24; font-weight: bold; font-size: 1.125rem; margin-bottom: 8px;">
					Gợi ý cho bạn:
				</div>
				<div style="color: #fde68a; font-size: 1rem;">
					${nextHint.title}
				</div>
				<div style="color: rgba(253, 230, 138, 0.8); font-size: 0.875rem; margin-top: 8px;">
					Hãy tìm: ${nextHint.description}
				</div>
			`;

			// Thêm keyframes animation
			const style = document.createElement("style");
			style.textContent = `
				@keyframes fadeInOut {
					0% { opacity: 0; transform: translate(-50%, -40%); }
					10% { opacity: 1; transform: translate(-50%, -50%); }
					80% { opacity: 1; transform: translate(-50%, -50%); }
					100% { opacity: 0; transform: translate(-50%, -60%); }
				}
			`;
			document.head.appendChild(style);

			document.body.appendChild(notification);

			setTimeout(() => {
				document.body.removeChild(notification);
				document.head.removeChild(style);
				setShowHint(false);
			}, 5000);
		}
	};

	const handleChangeLocation = (location: VietnamLocation) => {
		if (startTime) return; // Không cho phép đổi địa điểm khi đã bắt đầu
		// Thay đổi URL thay vì trực tiếp thiết lập state
		navigate(`/game4/game?location=${location.id}`, { replace: true });
		setShowLocationDropdown(false);
	};

	const allFound =
		selectedLocation &&
		foundSpots.length === selectedLocation.differences.length;

	// Thêm useEffect để xử lý click outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				settingsRef.current &&
				!settingsRef.current.contains(event.target as Node)
			) {
				setShowSettings(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	if (showConclusion || timeLeft <= 0) {
		const timePlayed = startTime
			? Math.floor((Date.now() - startTime) / 1000)
			: 240;

		return (
			<Conclusion4
				timeUsed={timePlayed}
				matchedCards={foundSpots.length}
				totalCards={selectedLocation?.differences.length || 0}
				win={allFound || false}
			/>
		);
	}

	return (
		<div className="relative h-full bg-[#1a120a] overflow-hidden">
			{/* Header */}
			<div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#2b1d0e] to-transparent px-6 py-4 z-20">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					{/* Left section with timer and score */}
					<div className="flex items-center gap-6">
						{/* Timer */}
						<div className="relative">
							<div className="w-[84px] h-[84px] rounded-full border-[3px] border-amber-900/30 flex items-center justify-center bg-gradient-to-b from-[#2b1d0e] to-[#1a120a] shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(0,0,0,0.3)]">
								<div className="absolute inset-[6px]">
									<svg className="w-full h-full -rotate-90">
										<circle
											className="text-amber-900/20"
											strokeWidth="3"
											stroke="currentColor"
											fill="transparent"
											r="35"
											cx="36"
											cy="36"
										/>
										<circle
											className="text-amber-500"
											strokeWidth="3"
											strokeDasharray={220}
											strokeDashoffset={220 - (timeLeft / 240) * 220}
											strokeLinecap="round"
											stroke="currentColor"
											fill="transparent"
											r="35"
											cx="36"
											cy="36"
										/>
									</svg>
								</div>
								<div className="relative text-center">
									<div className="text-[32px] font-bold text-amber-300 leading-none mb-1">
										{timeLeft}
									</div>
									<div className="text-[10px] text-amber-400/60 uppercase tracking-wider">
										giây
									</div>
								</div>
							</div>
						</div>

						{/* Score */}
						<div className="bg-gradient-to-b from-[#2b1d0e] to-[#1a120a] px-5 py-3 rounded-xl border border-amber-900/30 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
							<div className="text-[10px] text-amber-400/60 uppercase tracking-wider mb-1">
								Điểm đã tìm thấy
							</div>
							<div className="text-2xl font-bold text-amber-300 flex items-center">
								<FaStar className="mr-2 text-amber-400" />
								{foundSpots.length}/{selectedLocation?.differences.length || 0}
							</div>
						</div>
					</div>

					{/* Center title */}
					<div className="absolute left-1/2 -translate-x-1/2 text-center">
						<h1 className="text-[28px] font-pirate tracking-wide bg-gradient-to-b from-amber-200 to-amber-400 bg-clip-text text-transparent">
							Bản đồ xưa và nay
						</h1>
						{selectedLocation && (
							<div className="text-amber-400/80 text-sm mt-1 font-medium">
								{selectedLocation.name}
							</div>
						)}
					</div>

					{/* Settings button */}
					<div className="relative">
						<button
							onClick={() => setShowSettings(!showSettings)}
							className="w-11 h-11 rounded-full bg-gradient-to-b from-amber-900/40 to-amber-900/20 hover:from-amber-800/40 hover:to-amber-800/20 text-amber-400 flex items-center justify-center transition-all border border-amber-900/30 shadow-lg"
						>
							<FaCog
								className={`transition-transform duration-300 ${
									showSettings ? "rotate-180" : ""
								}`}
							/>
						</button>

						{/* Settings Menu */}
						{showSettings && (
							<div className="absolute top-full right-0 mt-2 bg-gradient-to-b from-[#2b1d0e] to-[#1a120a] rounded-xl border border-amber-900/30 p-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.3)] z-30 min-w-[160px]">
								<button
									onClick={() => {
										navigate("/");
										setShowSettings(false);
									}}
									className="w-full px-4 py-2.5 bg-amber-900/40 hover:bg-amber-800/40 text-amber-200 rounded-lg transition-all flex items-center gap-2 text-sm font-medium mb-2"
								>
									<FaHome /> Trang chủ
								</button>
								<button
									onClick={() => {
										navigate(-1);
										setShowSettings(false);
									}}
									className="w-full px-4 py-2.5 bg-amber-900/40 hover:bg-amber-800/40 text-amber-200 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
								>
									<FaArrowLeft /> Quay lại
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Game layout */}
			<div className="absolute top-[120px] left-0 right-0 flex flex-col gap-4 px-6">
				{/* Maps container */}
				<div className="grid grid-cols-12 gap-6">
					{/* Past map */}
					<div
						className={`${
							showExplanation ? "col-span-6" : "col-span-6"
						} relative`}
					>
						<div className="absolute -top-3 left-1/2 -translate-x-1/2 text-amber-200 bg-gradient-to-b from-[#2b1d0e] to-[#1a120a] px-4 py-2 rounded-lg border border-amber-900/30 text-sm font-medium z-[1] flex items-center gap-2 whitespace-nowrap shadow-lg">
							<FaMap className="text-amber-400" />
							Bản đồ cổ
						</div>
						<div className="bg-gradient-to-b from-[#2b1d0e] to-[#1a120a] rounded-xl overflow-hidden border-2 border-amber-900/30 shadow-[0_8px_16px_rgba(0,0,0,0.3)]">
							<div
								className="aspect-[16/9] w-full relative flex items-center justify-center"
								onClick={(e) => handleClick(e, "past")}
							>
								{selectedLocation && (
									<img
										src={selectedLocation.pastMap}
										alt="Past map"
										className="w-full h-full object-cover old-map-filter relative"
										style={{
											transform: `scale(${zoomLevel})`,
											transformOrigin: "center",
											transition: "transform 0.3s ease",
										}}
									/>
								)}
								{selectedLocation?.differences.map((spot, index) => (
									<div
										key={index}
										className={`absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 ${
											foundSpots.includes(spot.id) ? "opacity-100" : "opacity-0"
										}`}
										style={{
											left: `${spot.position.x * 100}%`,
											top: `${spot.position.y * 100}%`,
										}}
									>
										<div className="absolute inset-0 animate-ping">
											<div className="absolute inset-0 rounded-full bg-amber-400 opacity-30"></div>
										</div>
										<div className="absolute inset-0">
											<div className="absolute inset-0 rounded-full border-2 border-amber-400 bg-amber-400/20"></div>
										</div>
										{foundSpots.includes(spot.id) && (
											<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-900/90 px-2 py-1 rounded text-xs text-amber-200 whitespace-nowrap shadow-lg">
												{spot.title}
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Current map */}
					<div
						className={`${
							showExplanation ? "col-span-6" : "col-span-6"
						} relative`}
					>
						<div className="absolute -top-3 left-1/2 -translate-x-1/2 text-amber-200 bg-gradient-to-b from-[#2b1d0e] to-[#1a120a] px-4 py-2 rounded-lg border border-amber-900/30 text-sm font-medium z-[1] flex items-center gap-2 whitespace-nowrap shadow-lg">
							<FaMap className="text-amber-400" />
							Bản đồ hiện tại
						</div>
						<div className="bg-gradient-to-b from-[#2b1d0e] to-[#1a120a] rounded-xl overflow-hidden border-2 border-amber-900/30 shadow-[0_8px_16px_rgba(0,0,0,0.3)]">
							<div
								className="aspect-[16/9] w-full relative flex items-center justify-center"
								onClick={(e) => handleClick(e, "current")}
							>
								{selectedLocation && (
									<img
										src={selectedLocation.currentMap}
										alt="Current map"
										className="w-full h-full object-cover new-map-filter"
										style={{
											transform: `scale(${zoomLevel})`,
											transformOrigin: "center",
											transition: "transform 0.3s ease",
										}}
									/>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Explanation panel */}
				{showExplanation && (
					<div className="bg-gradient-to-b from-[#2b1d0e] to-[#1a120a] rounded-xl border border-amber-900/30 p-4 shadow-[0_8px_16px_rgba(0,0,0,0.3)] h-[200px] overflow-hidden">
						<div className="flex items-start gap-6 h-full">
							<div className="flex-1">
								<h2 className="text-lg mb-4 flex items-center gap-2 bg-gradient-to-b from-amber-300 to-amber-400 bg-clip-text text-transparent font-semibold sticky top-0 bg-[#1a120a] py-2">
									<FaInfoCircle className="text-amber-400" /> Giải thích thay
									đổi
								</h2>
								<div className="text-amber-200/90 text-sm">
									Hãy tìm và nhấp vào các điểm khác biệt giữa hai bản đồ
								</div>
								<div className="text-amber-400/70 mt-2 text-sm">
									Thông tin về những thay đổi sẽ hiện ở đây sau khi bạn tìm thấy
									chúng
								</div>
							</div>

							{foundSpots.length > 0 && (
								<div className="flex-[2] h-full overflow-y-auto pr-2 custom-scrollbar">
									<h3 className="text-amber-400 mb-3 sticky top-0 bg-gradient-to-b from-[#2b1d0e] to-[#1a120a] py-2 font-medium">
										Đã tìm thấy {foundSpots.length} điểm:
									</h3>
									<div className="grid grid-cols-2 gap-3">
										{selectedLocation?.differences
											.filter((spot) => foundSpots.includes(spot.id))
											.map((spot) => (
												<div
													key={spot.id}
													className="bg-amber-900/30 rounded-lg p-3 border border-amber-900/20 hover:border-amber-900/40 transition-colors"
												>
													<div className="text-amber-200 font-medium text-sm">
														{spot.title}
													</div>
													<div className="text-amber-300/70 text-xs mt-1.5">
														{spot.description}
													</div>
												</div>
											))}
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Bottom controls */}
			<div className="fixed bottom-6 right-6 flex items-center gap-3 z-20">
				{selectedLocation &&
				foundSpots.length === selectedLocation.differences.length ? (
					<button
						onClick={() => setShowConclusion(true)}
						className="px-6 py-3 bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-900 rounded-lg transition-all flex items-center gap-2 font-medium text-sm shadow-lg"
					>
						<FaStar className="text-amber-900" />
						Xem tổng kết
					</button>
				) : (
					<>
						<button
							onClick={handleShowHint}
							disabled={
								!selectedLocation ||
								foundSpots.length === selectedLocation.differences.length ||
								showHint
							}
							className={`px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium text-sm transition-all shadow-lg ${
								foundSpots.length ===
									(selectedLocation?.differences.length || 0) || showHint
									? "bg-gradient-to-b from-amber-900/30 to-amber-900/20 text-amber-200/40 cursor-not-allowed"
									: "bg-gradient-to-b from-amber-900/60 to-amber-900/40 hover:from-amber-800/60 hover:to-amber-800/40 text-amber-200 cursor-pointer"
							}`}
							title="Xem gợi ý (mất 60 giây)"
						>
							<FaCompass /> <span>Gợi ý</span>
						</button>

						<button
							onClick={() => setShowExplanation(!showExplanation)}
							className="px-5 py-2.5 bg-gradient-to-b from-amber-900/60 to-amber-900/40 hover:from-amber-800/60 hover:to-amber-800/40 text-amber-200 rounded-lg flex items-center gap-2 transition-all shadow-lg font-medium text-sm"
						>
							<FaInfoCircle />
							<span>
								{showExplanation ? "Ẩn giải thích" : "Hiện giải thích"}
							</span>
						</button>
					</>
				)}
			</div>

			{/* Hint overlay */}
			{showHint && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30">
					<div className="bg-gradient-to-b from-[#2b1d0e] to-[#1a120a] rounded-xl border-2 border-amber-900/30 p-6 max-w-md mx-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
						<h3 className="text-xl font-bold mb-4 flex items-center gap-2 bg-gradient-to-b from-amber-200 to-amber-400 bg-clip-text text-transparent">
							<FaCompass className="text-amber-400" /> Gợi ý cho bạn
						</h3>
						<div className="text-amber-200 mb-3 font-medium">
							{hintUsed[hintUsed.length - 1] &&
								selectedLocation?.differences.find(
									(d) => d.id === hintUsed[hintUsed.length - 1]
								)?.title}
						</div>
						<div className="text-amber-300/80 text-sm">
							{hintUsed[hintUsed.length - 1] &&
								selectedLocation?.differences.find(
									(d) => d.id === hintUsed[hintUsed.length - 1]
								)?.description}
						</div>
						<button
							onClick={() => setShowHint(false)}
							className="mt-5 w-full py-2.5 bg-gradient-to-b from-amber-900/60 to-amber-900/40 hover:from-amber-800/60 hover:to-amber-800/40 text-amber-200 rounded-lg transition-all font-medium"
						>
							Đã hiểu
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
