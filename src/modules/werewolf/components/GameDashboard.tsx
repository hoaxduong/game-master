import React, { useState } from "react";
import { useStore } from "@nanostores/react";
import { $gameSettings, $players, resetGame } from "../logic/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { WEREWOLF_ROLES } from "../types/roles";
import {
  Moon,
  Sun,
  Skull,
  Heart,
  RotateCcw,
  BookOpen,
  Users,
  Info,
} from "lucide-react";
import { werewolf } from "../i18n";

interface GameDashboardProps {
  lang?: "en" | "vi";
}

export const GameDashboard: React.FC<GameDashboardProps> = ({
  lang = "en",
}) => {
  const game = useStore($gameSettings);
  const players = useStore($players);
  const t = werewolf[lang];

  const [isResetOpen, setIsResetOpen] = useState(false);
  const sessionId = game.id || "---";

  const togglePhase = () => {
    const nextPhase = game.phase === "day" ? "night" : "day";
    $gameSettings.setKey("phase", nextPhase);
    if (nextPhase === "night") {
      $gameSettings.setKey("cycle", game.cycle + 1);
    }
  };

  const getRole = (roleId?: string) => {
    const role = WEREWOLF_ROLES.find((r) => r.id === roleId);
    if (!role) return undefined;

    return {
      ...role,
      name: t[`role.${role.id}.name` as keyof typeof t] || role.name,
    };
  };

  const aliveCount = players.filter((p) => p.isAlive).length;

  return (
    <div className="flex flex-col gap-6 sm:gap-8 p-4 sm:p-6 max-w-6xl mx-auto min-h-screen pb-32">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-12 sm:pt-0">
        <div className="flex items-center gap-4">
          <div
            className={`p-4 rounded-3xl shadow-lg transition-all duration-500 ${
              game.phase === "day"
                ? "bg-amber-100 text-amber-600 shadow-amber-200/50 scale-105 sm:scale-110"
                : "bg-indigo-900 text-indigo-300 shadow-indigo-900/50 scale-105 sm:scale-110"
            }`}
          >
            {game.phase === "day" ? (
              <Sun className="h-7 w-7 sm:h-8" />
            ) : (
              <Moon className="h-7 w-7 sm:h-8" />
            )}
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
              {t[`dashboard.phase.${game.phase}` as keyof typeof t]}{" "}
              {game.cycle}
            </h1>
            <p className="text-muted-foreground font-medium text-xs sm:text-sm">
              Session: {sessionId}
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <AlertDialog open={isResetOpen} onOpenChange={setIsResetOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 sm:flex-none h-12 sm:h-14 rounded-2xl border-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all font-bold text-sm sm:text-base"
              >
                <RotateCcw className="mr-2 h-4 w-4 sm:h-5" />
                {t["dashboard.newGame"]}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl border-2 max-w-[90vw] sm:max-w-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl sm:text-2xl font-bold">
                  {t["dashboard.resetConfirm.title"]}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-base sm:text-lg">
                  {t["dashboard.resetConfirm.desc"]}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2 sm:gap-0">
                <AlertDialogCancel
                  onClick={() => setIsResetOpen(false)}
                  className="h-12 rounded-xl text-base font-bold"
                >
                  {t["dashboard.resetConfirm.cancel"]}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    resetGame();
                    window.location.href = `/${lang}/werewolf`;
                  }}
                  className="h-12 rounded-xl text-base font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {t["dashboard.resetConfirm.confirm"]}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 sm:flex-none h-12 sm:h-14 rounded-2xl border-2 font-bold shadow-lg text-sm sm:text-base"
            onClick={() =>
              window.open(
                `${window.location.protocol}//${window.location.host}${window.location.pathname.startsWith("/vi") ? "/vi" : "/en"}/werewolf/roles`,
                "_blank",
              )
            }
          >
            <BookOpen className="mr-2 h-4 w-4 sm:h-5" />
            Roles
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Village List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 sm:h-6 text-primary" />
              {t["dashboard.villageStatus"].replace("{count}", "").trim()} (
              {aliveCount} Alive)
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {players.map((player) => (
              <Card
                key={player.id}
                className={`overflow-hidden border-2 transition-all active:scale-[0.98] rounded-2xl ${
                  !player.isAlive
                    ? "bg-muted/40 opacity-60 grayscale border-transparent"
                    : "shadow-lg shadow-primary/5 hover:border-primary/40 bg-card"
                }`}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner ${
                        !player.isAlive
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {player.name[0].toUpperCase()}
                    </div>
                    <div className="truncate pr-2">
                      <p
                        className={`font-bold text-lg truncate ${!player.isAlive ? "line-through opacity-50" : ""}`}
                      >
                        {player.name}
                      </p>
                      <p
                        className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                          !player.isAlive
                            ? "text-muted-foreground"
                            : "text-primary/60"
                        }`}
                      >
                        {getRole(player.roleId)?.name || "Unknown Role"}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant={player.isAlive ? "outline" : "destructive"}
                    onClick={() => {
                      const newPlayers = players.map((p) =>
                        p.id === player.id ? { ...p, isAlive: !p.isAlive } : p,
                      );
                      $players.set(newPlayers);
                    }}
                    className={`h-12 w-12 shrink-0 rounded-2xl border-2 shadow-md transition-all ${
                      player.isAlive
                        ? "hover:border-destructive hover:text-destructive hover:bg-destructive/10"
                        : ""
                    }`}
                  >
                    {player.isAlive ? (
                      <Heart className="h-6 w-6 fill-current text-green-500" />
                    ) : (
                      <Skull className="h-5 w-5" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* GM Assist Sidebar */}
        <div className="space-y-6">
          <Card className="border-2 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-linear-to-b from-primary/10 via-primary/5 to-transparent border-b pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Info className="h-5 w-5 text-primary" />
                GM Narrator Assist
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-auto max-h-[400px]">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-primary mb-3 flex items-center gap-2 uppercase tracking-widest text-[10px] sm:text-xs">
                      <Moon className="h-3 w-3" />
                      Night Actions
                    </h4>
                    <ul className="space-y-3">
                      {players
                        .filter(
                          (p) =>
                            p.isAlive &&
                            WEREWOLF_ROLES.find((r) => r.id === p.roleId)
                              ?.nightAction,
                        )
                        .map((p) => {
                          const role = WEREWOLF_ROLES.find(
                            (r) => r.id === p.roleId,
                          );
                          return (
                            <li
                              key={p.id}
                              className="flex gap-3 text-sm p-3 rounded-xl bg-muted/30 border border-border/50"
                            >
                              <Badge
                                variant="secondary"
                                className="h-fit rounded-lg font-bold bg-primary/10 text-primary border-none whitespace-nowrap"
                              >
                                {t[`role.${role?.id}.name` as keyof typeof t] ||
                                  role?.name}
                              </Badge>
                              <span className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
                                {t[`role.${role?.id}.desc` as keyof typeof t] ||
                                  role?.description}
                              </span>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                  <div className="pt-4 border-t-2 border-dashed">
                    <h4 className="font-bold text-amber-600 mb-3 flex items-center gap-2 uppercase tracking-widest text-[10px] sm:text-xs">
                      <Sun className="h-3 w-3" />
                      Day Phase
                    </h4>
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 text-amber-800 dark:text-amber-200 text-xs sm:text-sm leading-relaxed">
                      Discuss findings, defend roles, and vote to eliminate a
                      suspect.
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-8 mb-12">
        <div className="max-w-4xl mx-auto flex gap-4">
          <Button
            size="lg"
            onClick={togglePhase}
            className={`flex-1 h-16 rounded-2xl font-black text-lg shadow-2xl transition-all active:scale-[0.98] ${
              game.phase === "day"
                ? "bg-slate-900 text-slate-100 shadow-slate-900/40 hover:bg-slate-800"
                : "bg-amber-500 text-amber-950 shadow-amber-500/40 hover:bg-amber-400"
            }`}
          >
            {game.phase === "day" ? (
              <>
                <Moon className="mr-3 h-6 w-6" /> Go to Night
              </>
            ) : (
              <>
                <Sun className="mr-3 h-6 w-6" /> Go to Day
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
