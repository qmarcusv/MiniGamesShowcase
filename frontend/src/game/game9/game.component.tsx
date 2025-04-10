import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import correctSound from "/sound/correct.mp3";
import wrongSound from "/sound/wrong.mp3";
import tickSound from "/sound/tick.mp3";
import hurrySound from "/sound/hurry.mp3";

// Kích thước bảng
const BOARD_SIZE = 8;

// Các loại tàu và kích thước
const SHIPS = {
	battleship: { size: 4, name: "Tàu chiến", image: "/game/game9/tau4.png" },
	cruiser: { size: 3, name: "Tàu tuần dương", image: "/game/game9/tau32.png" },
	submarine: { size: 3, name: "Tàu ngầm", image: "/game/game9/tau31.png" },
	destroyer: { size: 2, name: "Tàu khu trục", image: "/game/game9/tau2.png" },
};

// Trạng thái ô trên bảng
type CellState = {
	isShip: boolean;
	isHit: boolean;
	isMiss: boolean;
	shipType?: keyof typeof SHIPS;
};

// Hướng đặt tàu
type Direction = "horizontal" | "vertical";

// Khởi tạo bảng trống
const initializeBoard = (): CellState[][] => {
	return Array(BOARD_SIZE)
		.fill(null)
		.map(() =>
			Array(BOARD_SIZE)
				.fill(null)
				.map(() => ({
					isShip: false,
					isHit: false,
					isMiss: false,
				}))
		);
};

// Kiểm tra vị trí có thể đặt tàu
const canPlaceShip = (
	board: CellState[][],
	row: number,
	col: number,
	size: number,
	direction: Direction
): boolean => {
	if (direction === "horizontal") {
		if (col + size > BOARD_SIZE) return false;
		for (let i = 0; i < size; i++) {
			if (board[row][col + i].isShip) return false;
		}
	} else {
		if (row + size > BOARD_SIZE) return false;
		for (let i = 0; i < size; i++) {
			if (board[row + i][col].isShip) return false;
		}
	}
	return true;
};

// Đặt tàu vào bảng
const placeShip = (
	board: CellState[][],
	row: number,
	col: number,
	size: number,
	direction: Direction,
	shipType: keyof typeof SHIPS
): CellState[][] => {
	const newBoard = JSON.parse(JSON.stringify(board));
	if (direction === "horizontal") {
		for (let i = 0; i < size; i++) {
			newBoard[row][col + i] = {
				isShip: true,
				isHit: false,
				isMiss: false,
				shipType,
			};
		}
	} else {
		for (let i = 0; i < size; i++) {
			newBoard[row + i][col] = {
				isShip: true,
				isHit: false,
				isMiss: false,
				shipType,
			};
		}
	}
	return newBoard;
};

// Tự động đặt tàu cho máy
const autoPlaceShips = (board: CellState[][]): CellState[][] => {
	let newBoard = JSON.parse(JSON.stringify(board));

	Object.entries(SHIPS).forEach(([shipType, ship]) => {
		let placed = false;
		while (!placed) {
			const row = Math.floor(Math.random() * BOARD_SIZE);
			const col = Math.floor(Math.random() * BOARD_SIZE);
			const direction = Math.random() < 0.5 ? "horizontal" : "vertical";

			if (canPlaceShip(newBoard, row, col, ship.size, direction)) {
				newBoard = placeShip(
					newBoard,
					row,
					col,
					ship.size,
					direction,
					shipType as keyof typeof SHIPS
				);
				placed = true;
			}
		}
	});

	return newBoard;
};

// Xóa tàu khỏi bảng
const removeShip = (
	board: CellState[][],
	shipType: keyof typeof SHIPS
): CellState[][] => {
	const newBoard = JSON.parse(JSON.stringify(board));
	for (let row = 0; row < BOARD_SIZE; row++) {
		for (let col = 0; col < BOARD_SIZE; col++) {
			if (newBoard[row][col].shipType === shipType) {
				newBoard[row][col] = {
					isShip: false,
					isHit: false,
					isMiss: false,
					shipType: undefined,
				};
			}
		}
	}
	return newBoard;
};

// Kiểm tra xem một tàu đã bị bắn chìm chưa
const isShipSunk = (
	board: CellState[][],
	shipType: keyof typeof SHIPS
): boolean => {
	let totalCells = 0;
	let hitCells = 0;

	for (let row = 0; row < BOARD_SIZE; row++) {
		for (let col = 0; col < BOARD_SIZE; col++) {
			if (board[row][col].shipType === shipType) {
				totalCells++;
				if (board[row][col].isHit) {
					hitCells++;
				}
			}
		}
	}

	return totalCells > 0 && totalCells === hitCells;
};

// Kiểm tra xem tất cả tàu đã bị bắn chìm chưa
const areAllShipsSunk = (board: CellState[][]): boolean => {
	return Object.keys(SHIPS).every((shipType) =>
		isShipSunk(board, shipType as keyof typeof SHIPS)
	);
};

function Game9() {
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [gamePhase, setGamePhase] = useState<
		"placement" | "playing" | "gameover"
	>("placement");
	const [playerTurn, setPlayerTurn] = useState(true);
	const [playerBoard, setPlayerBoard] = useState<CellState[][]>(
		initializeBoard()
	);
	const [computerBoard, setComputerBoard] = useState<CellState[][]>(
		initializeBoard()
	);
	const [selectedShipType, setSelectedShipType] = useState<
		keyof typeof SHIPS | null
	>(null);
	const [placedShips, setPlacedShips] = useState<(keyof typeof SHIPS)[]>([]);
	const [shipDirection, setShipDirection] = useState<Direction>("horizontal");
	const [score, setScore] = useState(0);
	const [hits, setHits] = useState(0);
	const [misses, setMisses] = useState(0);
	const [isComputerTurnProcessing, setIsComputerTurnProcessing] =
		useState(false);
	const [draggedShip, setDraggedShip] = useState<keyof typeof SHIPS | null>(
		null
	);
	const [dragPosition, setDragPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const dragRef = useRef<{ startX: number; startY: number } | null>(null);
	const [timer, setTimer] = useState(300);
	const [isDragging, setIsDragging] = useState(false);
	const dragTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [shipDirections, setShipDirections] = useState<
		Record<keyof typeof SHIPS, Direction>
	>({
		battleship: "horizontal",
		cruiser: "horizontal",
		submarine: "horizontal",
		destroyer: "horizontal",
	});

	// Xử lý kéo tàu
	const handleDragStart = (
		e: React.MouseEvent,
		shipType: keyof typeof SHIPS
	) => {
		e.preventDefault();

		// Xóa tàu khỏi danh sách đã đặt trước
		setPlacedShips((prev) => prev.filter((ship) => ship !== shipType));

		// Tạo bảng mới và xóa tàu cũ
		const newBoard = playerBoard.map((row) =>
			row.map((cell) =>
				cell.shipType === shipType
					? { isShip: false, isHit: false, isMiss: false, shipType: undefined }
					: { ...cell }
			)
		);
		setPlayerBoard(newBoard);

		setDraggedShip(shipType);
		setDragPosition({ x: e.clientX, y: e.clientY });

		const handleMove = (e: MouseEvent) => {
			e.preventDefault();
			setDragPosition({ x: e.clientX, y: e.clientY });
		};

		const handleUp = (e: MouseEvent) => {
			window.removeEventListener("mousemove", handleMove);
			window.removeEventListener("mouseup", handleUp);

			const element = document.elementFromPoint(
				e.clientX,
				e.clientY
			) as HTMLElement;
			const cell = element?.closest(".board-cell") as HTMLElement;

			if (cell) {
				const [row, col] = (cell.getAttribute("data-pos") || "")
					.split(",")
					.map(Number);

				if (
					!isNaN(row) &&
					!isNaN(col) &&
					canPlaceShip(newBoard, row, col, SHIPS[shipType].size, shipDirection)
				) {
					const updatedBoard = placeShip(
						newBoard,
						row,
						col,
						SHIPS[shipType].size,
						shipDirection,
						shipType
					);
					setPlayerBoard(updatedBoard);
					setPlacedShips((prev) => [...prev, shipType]);
					setShipDirections((prev) => ({
						...prev,
						[shipType]: shipDirection,
					}));
					new Audio(correctSound).play();
				} else {
					new Audio(wrongSound).play();
				}
			}

			setDraggedShip(null);
			setDragPosition(null);
		};

		window.addEventListener("mousemove", handleMove);
		window.addEventListener("mouseup", handleUp);
	};

	// Xử lý hover khi đặt tàu
	const handleCellHover = (row: number, col: number) => {
		if (!draggedShip) return false;

		const shipSize = SHIPS[draggedShip].size;
		return canPlaceShip(playerBoard, row, col, shipSize, shipDirection);
	};

	// Xử lý đặt tàu
	const handlePlaceShip = (row: number, col: number) => {
		if (!selectedShipType || placedShips.includes(selectedShipType)) return;

		const shipSize = SHIPS[selectedShipType].size;
		if (canPlaceShip(playerBoard, row, col, shipSize, shipDirection)) {
			const newBoard = placeShip(
				playerBoard,
				row,
				col,
				shipSize,
				shipDirection,
				selectedShipType
			);
			setPlayerBoard(newBoard);
			setPlacedShips([...placedShips, selectedShipType]);
			setSelectedShipType(null);
			new Audio(correctSound).play();

			// Nếu đã đặt hết tàu thì bắt đầu game
			if (placedShips.length === Object.keys(SHIPS).length - 1) {
				startGame();
			}
		} else {
			new Audio(wrongSound).play();
		}
	};

	// Xoay tàu
	const handleRotateShip = () => {
		setShipDirection((prev) =>
			prev === "horizontal" ? "vertical" : "horizontal"
		);
		new Audio(tickSound).play();
	};

	// Khởi tạo game
	const startGame = () => {
		setGamePhase("playing");
		setTimer(300);
		setPlayerTurn(true);
		setScore(0);
		setHits(0);
		setMisses(0);

		// Đặt tàu cho máy
		const computerBoardWithShips = autoPlaceShips(initializeBoard());
		setComputerBoard(computerBoardWithShips);
	};

	// Reset game
	const resetGame = () => {
		setGamePhase("placement");
		setSelectedShipType(null);
		setShipDirection("horizontal");
		setPlacedShips([]);
		setPlayerBoard(initializeBoard());
		setComputerBoard(initializeBoard());
	};

	// Lượt của máy
	const computerTurn = () => {
		if (isComputerTurnProcessing) return;
		setIsComputerTurnProcessing(true);

		// Tạo danh sách các ô chưa bắn
		const availableCells: { row: number; col: number }[] = [];
		for (let row = 0; row < BOARD_SIZE; row++) {
			for (let col = 0; col < BOARD_SIZE; col++) {
				if (!playerBoard[row][col].isHit && !playerBoard[row][col].isMiss) {
					availableCells.push({ row, col });
				}
			}
		}

		// Nếu không còn ô nào để bắn, kết thúc game
		if (availableCells.length === 0) {
			setGamePhase("gameover");
			setIsComputerTurnProcessing(false);
			return;
		}

		// Chọn ngẫu nhiên một ô để bắn
		const randomIndex = Math.floor(Math.random() * availableCells.length);
		const { row, col } = availableCells[randomIndex];

		// Thực hiện bắn
		setPlayerBoard((prevBoard) => {
			const newBoard = prevBoard.map((r) => r.map((cell) => ({ ...cell })));

			if (newBoard[row][col].isShip) {
				// Bắn trúng
				new Audio(wrongSound).play();
				newBoard[row][col].isHit = true;
				newBoard[row][col].isMiss = false;

				// Kiểm tra thua
				if (areAllShipsSunk(newBoard)) {
					setTimeout(() => setGamePhase("gameover"), 2000);
					setIsComputerTurnProcessing(false);
				} else {
					// Bắn tiếp sau 1 giây nếu chưa thắng
					setTimeout(() => {
						setIsComputerTurnProcessing(false);
						computerTurn();
					}, 1000);
				}
			} else {
				// Bắn trượt
				new Audio(tickSound).play();
				newBoard[row][col].isMiss = true;
				newBoard[row][col].isHit = false;
				// Chuyển lượt cho người chơi
				setPlayerTurn(true);
				setIsComputerTurnProcessing(false);
			}

			return newBoard;
		});
	};

	// Xử lý khi người chơi bắn
	const handlePlayerShot = (row: number, col: number) => {
		if (
			!playerTurn ||
			gamePhase === "gameover" ||
			computerBoard[row][col].isHit ||
			computerBoard[row][col].isMiss
		) {
			return;
		}

		const newBoard = JSON.parse(JSON.stringify(computerBoard));
		if (newBoard[row][col].isShip) {
			// Bắn trúng
			new Audio(correctSound).play();
			newBoard[row][col].isHit = true;
			setHits((prev) => prev + 1);
			setScore((prev) => prev + 100);

			// Kiểm tra xem tàu có bị chìm không
			const hitShipType = newBoard[row][col].shipType;
			if (hitShipType && isShipSunk(newBoard, hitShipType)) {
				setScore((prev) => prev + 200);
			}

			// Kiểm tra chiến thắng
			if (areAllShipsSunk(newBoard)) {
				setScore((prev) => prev + 500);
				setComputerBoard(newBoard);
				setTimeout(() => setGamePhase("gameover"), 2000);
				return;
			}

			// Bắn trúng thì được bắn tiếp
			setComputerBoard(newBoard);
			return;
		} else {
			// Bắn trượt
			new Audio(wrongSound).play();
			newBoard[row][col].isMiss = true;
			setMisses((prev) => prev + 1);
			setComputerBoard(newBoard);
			setPlayerTurn(false);
			setTimeout(() => {
				if (!isComputerTurnProcessing) {
					computerTurn();
				}
			}, 1000);
		}
	};

	// Đếm ngược thời gian
	useEffect(() => {
		if (gamePhase === "playing") {
			const interval = setInterval(() => {
				setTimer((prev) => {
					if (prev <= 1) {
						setGamePhase("gameover");
						return 0;
					}
					if (prev <= 10) new Audio(hurrySound).play();
					else new Audio(tickSound).play();
					return prev - 1;
				});
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [gamePhase]);

	const renderCell = (
		cell: CellState,
		row: number,
		col: number,
		isPlayerBoard: boolean
	) => {
		const cellStyle = {
			width: "30px",
			height: "30px",
			border: "1px solid #ccc",
			backgroundColor:
				cell.isShip && cell.isHit
					? "#ff4d4d"
					: cell.isMiss
					? "#ccc"
					: cell.isShip && isPlayerBoard
					? "#666"
					: "#fff",
			cursor: !isPlayerBoard && playerTurn ? "pointer" : "default",
			position: "relative" as const,
		};

		return (
			<div
				key={`${row}-${col}`}
				style={cellStyle}
				onClick={() => handlePlayerShot(row, col)}
			>
				{cell.isShip && cell.isHit && (
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<div
							style={{
								width: "60%",
								height: "60%",
								backgroundColor: "#ff4d4d",
								borderRadius: "50%",
							}}
						/>
					</div>
				)}
				{cell.isMiss && (
					<div
						style={{
							position: "absolute",
							top: "50%",
							left: "50%",
							width: "60%",
							height: "60%",
							transform: "translate(-50%, -50%)",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<div
							style={{
								width: "8px",
								height: "8px",
								backgroundColor: "#666",
								borderRadius: "50%",
							}}
						/>
					</div>
				)}
			</div>
		);
	};

	return (
		<div
			className="h-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 relative overflow-hidden"
			style={{
				backgroundImage: "url('/game/game9/gameplay.png')",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<style>
				{`
				@keyframes shake {
					0%, 100% { transform: translateX(0); }
					25% { transform: translateX(-5px); }
					75% { transform: translateX(5px); }
				}
				.shake {
					animation: shake 0.2s ease-in-out 0s 2;
				}
				`}
			</style>

			<div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>

			{/* Menu Button và Dropdown */}
			<div className="fixed top-4 right-4 z-30">
				<div className="relative">
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="w-12 h-12 bg-[#292524]/60 hover:bg-[#1c1917]/80 text-slate-200 rounded-full text-xl transition shadow-md border-2 border-[#44403c]/30 hover:border-[#292524] flex items-center justify-center"
					>
						⚙️
					</button>
					{isMenuOpen && (
						<div className="absolute right-0 mt-2 w-48 bg-[#1c1917]/90 backdrop-blur-md border-2 border-[#292524] rounded-xl shadow-2xl overflow-hidden">
							<button
								onClick={() => {
									setIsMenuOpen(false);
									navigate("/");
								}}
								className="w-full px-4 py-2 text-left text-slate-200 hover:bg-[#292524]/60 transition flex items-center gap-2"
							>
								🏠 Trang chính
							</button>
							<button
								onClick={() => {
									setIsMenuOpen(false);
									navigate("/game/9");
								}}
								className="w-full px-4 py-2 text-left text-slate-200 hover:bg-[#292524]/60 transition flex items-center gap-2"
							>
								↩️ Quay lại
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Tàu đang được kéo */}
			{draggedShip && dragPosition && (
				<div
					className="fixed pointer-events-none z-50 transition-transform duration-75 select-none"
					style={{
						left: dragPosition.x,
						top: dragPosition.y,
						transform: `translate(-50%, -50%) scale(1.1)`,
						filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5))",
					}}
				>
					<img
						src={SHIPS[draggedShip].image}
						alt={SHIPS[draggedShip].name}
						className={`h-12 transition-transform duration-200 ${
							shipDirection === "vertical" ? "rotate-90" : ""
						}`}
						draggable="false"
					/>
				</div>
			)}

			<div className="relative z-10 bg-[#1c1917]/40 backdrop-blur-sm border-4 border-[#292524] rounded-2xl shadow-2xl p-10 w-[90vw] max-w-7xl text-center space-y-8 text-slate-200">
				{gamePhase === "placement" ? (
					<div className="space-y-8">
						<h2 className="text-3xl font-bold text-orange-400">
							Đặt tàu của bạn
						</h2>

						{/* Danh sách tàu */}
						<div className="flex justify-center gap-4 flex-wrap">
							{Object.entries(SHIPS).map(([shipType, ship]) => (
								<div
									key={shipType}
									onMouseDown={(e) =>
										handleDragStart(e, shipType as keyof typeof SHIPS)
									}
									className={`relative flex items-center justify-center p-2 rounded-lg transition ${
										isDragging && draggedShip === shipType
											? "opacity-0 cursor-grabbing"
											: placedShips.includes(shipType as keyof typeof SHIPS)
											? "opacity-50 hover:opacity-75 cursor-grab"
											: "hover:bg-[#1c1917]/80 cursor-grab"
									}`}
								>
									<img
										src={ship.image}
										alt={ship.name}
										className={`h-12 object-contain transition-transform ${
											!placedShips.includes(shipType as keyof typeof SHIPS) &&
											shipDirection === "vertical"
												? "rotate-90"
												: placedShips.includes(
														shipType as keyof typeof SHIPS
												  ) &&
												  shipDirections[shipType as keyof typeof SHIPS] ===
														"vertical"
												? "rotate-90"
												: ""
										}`}
										title={`${ship.name} (${ship.size} ô)`}
										draggable="false"
										onDragStart={(e) => e.preventDefault()}
									/>
								</div>
							))}
						</div>

						{/* Nút xoay tàu */}
						<button
							onClick={handleRotateShip}
							className="px-4 py-2 rounded-lg bg-[#292524]/60 hover:bg-[#1c1917]/80 border-2 border-[#44403c]/30 transition"
						>
							🔄 Xoay tàu ({shipDirection === "horizontal" ? "Ngang" : "Dọc"})
						</button>

						{/* Bảng đặt tàu */}
						<div className="grid grid-cols-8 gap-0 max-w-[384px] mx-auto relative">
							{playerBoard.map((row, rowIndex) =>
								row.map((cell, colIndex) => {
									const canPlace = handleCellHover(rowIndex, colIndex);
									return (
										<div
											key={`setup-${rowIndex}-${colIndex}`}
											data-pos={`${rowIndex},${colIndex}`}
											data-ship={cell.shipType}
											onMouseDown={(e) => {
												if (cell.isShip) {
													handleDragStart(
														e,
														cell.shipType as keyof typeof SHIPS
													);
												}
											}}
											className={`w-12 h-12 border board-cell transition-all duration-200 ${
												cell.isShip
													? "bg-green-500/50 border-green-400/30 cursor-grab active:cursor-grabbing hover:bg-green-600/20"
													: draggedShip && canPlace
													? "bg-slate-800/50 border-orange-400/30"
													: "bg-slate-500/20 border-slate-400/30"
											} relative`}
										/>
									);
								})
							)}
							{/* Hiển thị tàu */}
							{Object.entries(SHIPS).map(([shipType, ship]) => {
								let shipPos: { row: number; col: number } | null = null;
								let isVertical = false;

								outer: for (let row = 0; row < BOARD_SIZE; row++) {
									for (let col = 0; col < BOARD_SIZE; col++) {
										if (playerBoard[row][col].shipType === shipType) {
											shipPos = { row, col };
											if (
												row + 1 < BOARD_SIZE &&
												playerBoard[row + 1][col].shipType === shipType
											) {
												isVertical = true;
											}
											break outer;
										}
									}
								}

								if (!shipPos) return null;

								const size = ship.size;

								return (
									<div
										key={`ship-${shipType}`}
										className="absolute pointer-events-none"
										style={{
											left: `${shipPos.col * 48 - (isVertical ? 48 : 0)}px`,
											top: `${shipPos.row * 48 - (isVertical ? 24 : 0)}px`,
											width: isVertical ? "144px" : `${size * 48}px`,
											height: isVertical ? `${size * 48 + 48}px` : "48px",
											transition: "all 0.2s ease-in-out",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<img
											src={ship.image}
											alt={ship.name}
											className={`w-full h-full object-contain ${
												isVertical ? "rotate-90" : ""
											}`}
											style={{
												transformOrigin: "center",
												transform: "scale(1)",
												transition: "transform 0.2s ease-in-out",
											}}
										/>
									</div>
								);
							})}
						</div>

						{placedShips.length === Object.keys(SHIPS).length && (
							<button
								onClick={startGame}
								className="mt-4 px-6 py-3 bg-green-600/80 hover:bg-green-700/80 text-white rounded-lg transition-colors shadow-lg border-2 border-green-500/30 hover:border-green-600/50 flex items-center gap-2 mx-auto"
							>
								✅ Bắt đầu trận đấu
							</button>
						)}
					</div>
				) : gamePhase === "playing" ? (
					<div className="flex flex-col items-center gap-12">
						<div className="flex justify-between w-full">
							{/* Bảng người chơi */}
							<div className="flex flex-col items-center">
								<h3 className="text-xl font-bold mb-4">Bảng của bạn</h3>
								<div className="grid grid-cols-8 relative border border-slate-400/30">
									{playerBoard.map((row, rowIndex) =>
										row.map((cell, colIndex) => (
											<div
												key={`player-${rowIndex}-${colIndex}`}
												className={`w-12 h-12 border border-slate-400/30 transition-all duration-200 ${
													cell.isHit
														? "bg-red-500/50"
														: cell.isMiss
														? "bg-blue-500/50"
														: gamePhase === "playing"
														? "bg-slate-500/20"
														: cell.isShip
														? "bg-green-500/50"
														: "bg-slate-500/20"
												}`}
											/>
										))
									)}
									{/* Chỉ hiển thị tàu khi đã bị chìm */}
									{gamePhase === "playing" &&
										Object.entries(SHIPS).map(([shipType, ship]) => {
											if (
												!isShipSunk(playerBoard, shipType as keyof typeof SHIPS)
											)
												return null;

											let shipPos: { row: number; col: number } | null = null;
											let isVertical = false;

											outer: for (let row = 0; row < BOARD_SIZE; row++) {
												for (let col = 0; col < BOARD_SIZE; col++) {
													if (playerBoard[row][col].shipType === shipType) {
														shipPos = { row, col };
														if (
															row + 1 < BOARD_SIZE &&
															playerBoard[row + 1][col].shipType === shipType
														) {
															isVertical = true;
														}
														break outer;
													}
												}
											}

											if (!shipPos) return null;

											const size = ship.size;

											return (
												<div
													key={`ship-${shipType}`}
													className="absolute pointer-events-none"
													style={{
														left: `${
															shipPos.col * 48 - (isVertical ? 48 : 0)
														}px`,
														top: `${
															shipPos.row * 48 - (isVertical ? 24 : 0)
														}px`,
														width: isVertical ? "144px" : `${size * 48}px`,
														height: isVertical ? `${size * 48 + 48}px` : "48px",
														opacity: "0.5",
														transition: "all 0.2s ease-in-out",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
													}}
												>
													<img
														src={ship.image}
														alt={ship.name}
														className={`w-full h-full object-contain ${
															isVertical ? "rotate-90" : ""
														}`}
														style={{
															transformOrigin: "center",
															transform: "scale(1)",
															transition: "transform 0.2s ease-in-out",
														}}
													/>
												</div>
											);
										})}
								</div>
							</div>

							{/* Bảng máy */}
							<div className="flex flex-col items-center">
								<h3 className="text-xl font-bold mb-4">Bảng của máy</h3>
								<div className="grid grid-cols-8 relative border border-slate-400/30">
									{computerBoard.map((row, rowIndex) =>
										row.map((cell, colIndex) => (
											<button
												key={`computer-${rowIndex}-${colIndex}`}
												onClick={() => handlePlayerShot(rowIndex, colIndex)}
												disabled={!playerTurn || cell.isHit || cell.isMiss}
												className={`w-12 h-12 border border-slate-400/30 transition-all duration-200 ${
													cell.isHit
														? "bg-red-500/50"
														: cell.isMiss
														? "bg-blue-500/50"
														: playerTurn
														? "bg-slate-500/20 hover:bg-slate-400/30 cursor-pointer"
														: "bg-slate-500/20 cursor-not-allowed opacity-50"
												}`}
											/>
										))
									)}
									{/* Chỉ hiển thị tàu khi đã bị chìm hoàn toàn */}
									{Object.entries(SHIPS).map(([shipType, ship]) => {
										if (
											!isShipSunk(computerBoard, shipType as keyof typeof SHIPS)
										)
											return null;

										let shipPos: { row: number; col: number } | null = null;
										let isVertical = false;

										outer: for (let row = 0; row < BOARD_SIZE; row++) {
											for (let col = 0; col < BOARD_SIZE; col++) {
												if (computerBoard[row][col].shipType === shipType) {
													shipPos = { row, col };
													if (
														row + 1 < BOARD_SIZE &&
														computerBoard[row + 1][col].shipType === shipType
													) {
														isVertical = true;
													}
													break outer;
												}
											}
										}

										if (!shipPos) return null;

										const size = ship.size;

										return (
											<div
												key={`sunk-${shipType}`}
												className="absolute pointer-events-none"
												style={{
													left: `${shipPos.col * 48 - (isVertical ? 48 : 0)}px`,
													top: `${shipPos.row * 48 - (isVertical ? 24 : 0)}px`,
													width: isVertical ? "144px" : `${size * 48}px`,
													height: isVertical ? `${size * 48 + 48}px` : "48px",
													opacity: "0.5",
													transition: "all 0.2s ease-in-out",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												<img
													src={ship.image}
													alt={ship.name}
													className={`w-full h-full object-contain ${
														isVertical ? "rotate-90" : ""
													}`}
													style={{
														transformOrigin: "center",
														transform: "scale(1)",
														transition: "transform 0.2s ease-in-out",
													}}
												/>
											</div>
										);
									})}
								</div>
							</div>
						</div>

						{/* Thông tin game */}
						<div className="flex justify-between items-center w-full">
							<div className="text-xl">
								⏱️ Thời gian: {Math.floor(timer / 60)}:
								{(timer % 60).toString().padStart(2, "0")}
							</div>
							<div className="text-xl">Điểm: {score}</div>
							<div className="text-xl">
								{playerTurn ? "🎮 Lượt của bạn" : "🤖 Lượt của máy"}
							</div>
						</div>
					</div>
				) : (
					<div className="bg-[#1c1917]/80 backdrop-blur-md rounded-xl p-8 max-w-2xl mx-auto">
						<h2 className="text-3xl font-bold mb-8 text-orange-400">
							Trò chơi kết thúc!
						</h2>
						<div className="grid grid-cols-2 gap-6 mb-8">
							<div className="bg-[#292524]/60 rounded-lg p-4">
								<div className="text-4xl mb-2">🎯</div>
								<div className="text-sm text-slate-400">Điểm số</div>
								<div className="text-2xl font-bold">{score}</div>
							</div>
							<div className="bg-[#292524]/60 rounded-lg p-4">
								<div className="text-4xl mb-2">📊</div>
								<div className="text-sm text-slate-400">Độ chính xác</div>
								<div className="text-2xl font-bold">
									{((hits / (hits + misses)) * 100).toFixed(1)}%
								</div>
							</div>
							<div className="bg-[#292524]/60 rounded-lg p-4">
								<div className="text-4xl mb-2">✅</div>
								<div className="text-sm text-slate-400">Số lần trúng</div>
								<div className="text-2xl font-bold">{hits}</div>
							</div>
							<div className="bg-[#292524]/60 rounded-lg p-4">
								<div className="text-4xl mb-2">❌</div>
								<div className="text-sm text-slate-400">Số lần trượt</div>
								<div className="text-2xl font-bold">{misses}</div>
							</div>
						</div>

						<div className="flex justify-center gap-4">
							<button
								onClick={() => navigate("/game/9")}
								className="bg-[#292524]/60 hover:bg-[#1c1917]/80 text-slate-200 px-6 py-3 rounded-lg transition shadow-md border border-[#44403c]/30 hover:border-[#292524] flex items-center gap-2"
							>
								↩️ Quay lại
							</button>
							<button
								onClick={resetGame}
								className="bg-[#292524]/60 hover:bg-[#1c1917]/80 text-slate-200 px-6 py-3 rounded-lg transition shadow-md border border-[#44403c]/30 hover:border-[#292524] flex items-center gap-2"
							>
								🔄 Chơi lại
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default Game9;
