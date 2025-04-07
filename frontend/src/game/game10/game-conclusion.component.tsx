import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ButtonSound from "../../feature/button-sound/button-sound.component";
import GameConclusion from "../../feature/game-conclusion/game-conclusion.component";

const artifact = {
	name: "Đôi mắt đại bàng",
	requirements: {
		score: 80,
		accuracy: 70,
	},
};

interface Conclusion10Props {
	timeUsed: number;
	matchedCards: number;
	totalCards: number;
	win: boolean;
}

export default function Conclusion10({
	timeUsed,
	matchedCards,
	totalCards,
	win,
}: Conclusion10Props) {
	const navigate = useNavigate();
	const { t } = useTranslation();

	// Calculate game statistics
	const accuracy = totalCards > 0 ? (matchedCards / totalCards) * 100 : 0;
	const score = Math.round((accuracy * matchedCards) / 2);

	return (
		<div className="relative min-h-screen w-full flex items-center justify-center bg-[url('/game/image/description/conclusion-bg.jpg')] bg-cover bg-center">
			<GameConclusion
				score={score}
				accuracy={accuracy}
				artifact={artifact}
				onReplay={() => navigate("/game10/game")}
				onBack={() => navigate("/")}
			/>
		</div>
	);
}
