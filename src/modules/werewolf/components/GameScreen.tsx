import React from "react";
import { useStore } from "@nanostores/react";
import { $gameSettings, loadSession } from "../logic/store";
import { GameSetup } from "./GameSetup";
import { GameDashboard } from "./GameDashboard";

interface GameScreenProps {
  lang?: "en" | "vi";
  sessionId?: string;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  lang = "en",
  sessionId,
}) => {
  const game = useStore($gameSettings);

  React.useEffect(() => {
    if (sessionId && sessionId !== game.id) {
      loadSession(sessionId);
    }
  }, [sessionId, game.id]);

  if (game.status === "setup") {
    return <GameSetup lang={lang} />;
  }

  return <GameDashboard lang={lang} />;
};
