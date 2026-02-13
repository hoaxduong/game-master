import React, { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { $gameSettings, loadSession } from "../logic/store";
import { GameSetup } from "./GameSetup";
import { GameDashboard } from "./GameDashboard";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

interface GameScreenProps {
  lang?: "en" | "vi";
  sessionId?: string;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  lang = "en",
  sessionId,
}) => {
  const game = useStore($gameSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // 1. Check auth / auto sign-in
        const session = await authClient.getSession();
        if (!session.data) {
          await authClient.signIn.anonymous();
        }

        // 2. Load game session if ID provided
        if (sessionId && sessionId !== game.id) {
          await loadSession(sessionId);
        }
      } catch (error) {
        console.error("Initialization failed", error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (game.status === "setup") {
    return <GameSetup lang={lang} />;
  }

  return <GameDashboard lang={lang} />;
};
