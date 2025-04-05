import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Game8 from "./game.component";
import Game8Setting from "./game-setting.component";
import ButtonSound from "../../feature/button-sound/button-sound.component";

export default function Description8() {
	const [view, setView] = useState<"description" | "game" | "setting">(
		"description"
	);
	const navigate = useNavigate();
	const { t } = useTranslation();

	if (view === "game") return <Game8 />;
	if (view === "setting") return <Game8Setting />;

	return (
		<div className="h-full bg-[url('/game/image/description/game.png')] bg-cover bg-no-repeat bg-center">
			<div className="h-full flex items-center justify-center px-4 py-8 bg-black/50">
				<div className="relative w-full h-[1000px] max-w-6xl mx-auto flex flex-col">
					{/* Main content with scroll */}
					<div className="relative flex-1">
						{/* Scroll background */}
						<div className="absolute inset-0 w-full h-full scale-110">
							<img
								src="/game/image/description/scroll.png"
								className="w-full h-full object-contain"
								alt="scroll background"
							/>
						</div>

						{/* Content */}
						<div className="relative bg-transparent px-48 py-16 text-slate-800 max-w-4xl mx-auto">
							<h1 className="text-6xl font-pirate text-amber-950 text-center mb-16 mt-16 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
								{t("description8.title")}
							</h1>

							<div className="space-y-12 max-w-xl mx-auto">
								<div className="text-center">
									<h2 className="text-3xl font-pirate text-amber-950 mb-6 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
										{t("description8.description")}
									</h2>
									<p className="text-xl text-amber-950 font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
										{t("description8.description_content")}
									</p>
								</div>

								<div className="text-center">
									<h2 className="text-3xl font-pirate text-amber-950 mb-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
										{t("description8.instructions")}
									</h2>
									<ul className="text-xl text-amber-950 space-y-5 inline-block text-left max-w-lg mx-auto font-semibold">
										<li className="flex items-center gap-4">
											<span className="w-10 h-10 bg-amber-900/80 rounded-full flex items-center justify-center text-amber-100 font-bold border-2 border-amber-500/60 shrink-0 shadow-lg">
												1
											</span>
											<span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
												{t("description8.instruction1")}
											</span>
										</li>
										<li className="flex items-center gap-4">
											<span className="w-10 h-10 bg-amber-900/80 rounded-full flex items-center justify-center text-amber-100 font-bold border-2 border-amber-500/60 shrink-0 shadow-lg">
												2
											</span>
											<span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
												{t("description8.instruction2")}
											</span>
										</li>
										<li className="flex items-center gap-4">
											<span className="w-10 h-10 bg-amber-900/80 rounded-full flex items-center justify-center text-amber-100 font-bold border-2 border-amber-500/60 shrink-0 shadow-lg">
												3
											</span>
											<span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
												{t("description8.instruction3")}
											</span>
										</li>
										<li className="flex items-center gap-4">
											<span className="w-10 h-10 bg-amber-900/80 rounded-full flex items-center justify-center text-amber-100 font-bold border-2 border-amber-500/60 shrink-0 shadow-lg">
												4
											</span>
											<span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
												{t("description8.instruction4")}
											</span>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>

					{/* Buttons outside scroll */}
					<div className="flex justify-center gap-6 mt-8">
						<ButtonSound
							onClick={() => navigate("/games")}
							className="bg-amber-900/80 hover:bg-amber-800/80 text-amber-100 px-12 py-4 rounded-xl font-bold transition-colors border-2 border-amber-500/60 shadow-lg text-lg"
						>
							{t("description8.back")}
						</ButtonSound>

						<ButtonSound
							onClick={() => setView("setting")}
							className="bg-amber-900/80 hover:bg-amber-800/80 text-amber-100 px-12 py-4 rounded-xl font-bold transition-colors border-2 border-amber-500/60 shadow-lg text-lg"
						>
							{t("description8.settings")}
						</ButtonSound>

						<ButtonSound
							onClick={() => setView("game")}
							className="bg-amber-900/80 hover:bg-amber-800/80 text-amber-100 px-12 py-4 rounded-xl font-bold transition-colors border-2 border-amber-500/60 shadow-lg text-lg"
						>
							{t("description8.start")}
						</ButtonSound>
					</div>
				</div>
			</div>
		</div>
	);
}
