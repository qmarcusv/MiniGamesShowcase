import { useRef } from "react";
import defaultClickSound from "/sound/click.mp3";

interface ButtonSoundProps {
  soundUrl?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function ButtonSound({
  soundUrl = defaultClickSound, // ✅ fallback to default
  onClick,
  children,
  className = "",
}: ButtonSoundProps) {
  const soundRef = useRef(new Audio(soundUrl));

  const handleClick = () => {
    try {
      soundRef.current.currentTime = 0;
      soundRef.current.play();
    } catch (err) {
      console.warn("Sound failed to play:", err);
    }

    if (onClick) onClick();
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
