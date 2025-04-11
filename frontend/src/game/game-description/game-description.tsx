import { Stepper } from "../../shared/component/stepper/stepper.component";

interface GameDescriptionProps {
  gameId: string;
  gameDescription: {
    title: string;
    description: string;
    gamePlay: string[];
  };
}

export default function GameDescription({ gameId, gameDescription }: GameDescriptionProps) {
  const { title, description, gamePlay } = gameDescription;

  return (
    <div className="game-description relative w-full h-full flex items-center justify-center bg-[url('/game/image/description/game.png')] bg-cover bg-center">
      <div className="relative z-10 w-full max-w-[85rem] mx-4">
        <div className="relative">
          <img
            src="/game/image/description/scroll.png"
            alt="Scroll background"
            className="w-full object-cover min-h-[65vh] sm:min-h-[75vh] md:min-h-[85vh] lg:min-h-[92vh] max-h-[92vh]"
          />
          <div className="body absolute inset-0 pl-4 flex flex-col items-center justify-center">
            <div className="h-[15%] sm:h-[18%] md:h-[20%] lg:h-[25%]" />

            <div className="w-[85%] sm:w-[80%] md:w-[75%] lg:w-[70%] max-h-[60%] sm:max-h-[58%] md:max-h-[55%] overflow-auto p-4 sm:p-5 md:p-6 rounded">
              {/* Title */}
              <h1 className="text-3xl sm:text-3xl md:text-4xl font-pirate mb-4 md:mb-6 text-amber-800 text-shadow-medium tracking-wider uppercase text-center">
                {title}
              </h1>

              {/* Description */}
              <div className="mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-pirate mb-2 md:mb-3 text-amber-900 text-shadow-light">Mô tả</h2>
                <p className="text-base md:text-lg text-amber-950 leading-relaxed font-medium">{description}</p>
              </div>

              {/* GamePlay */}
              <div className="mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-pirate mb-2 md:mb-3 text-amber-900 text-shadow-light">Cách chơi</h2>
                <ol className="text-base md:text-lg space-y-1 md:space-y-2 text-amber-950 leading-relaxed list-decimal list-inside font-medium">
                  {gamePlay.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="flex-grow max-h-[20vh]" />

            <Stepper gameId={gameId} />
          </div>
        </div>
      </div>
    </div>
  );
}
