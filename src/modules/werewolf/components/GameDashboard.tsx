import React, { useMemo } from "react";
import { useStore } from "@nanostores/react";
import {
  $gameSettings,
  $players,
  resetGame,
  advancePhase,
  setPhaseStepIndex,
  updatePlayerRole,
  $selectedRoleIds,
  $selectedTargets,
  toggleTarget,
  $witchPotions,
  $hunterPendingShot,
  $lovers,
  resolveHunterShot,
  $selectedStoryId,
} from "../logic/store";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  getNightSteps,
  getDaySteps,
  type PhaseStep,
} from "../logic/phaseSteps";
import { calculateNightResults } from "../logic/nightResult";
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
import { WEREWOLF_ROLES, type WerewolfRole } from "../types/roles";
import { STORY_VIBES } from "../types/stories";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Check, Crosshair } from "lucide-react";
import {
  Moon,
  Sun,
  Skull,
  Heart,
  RotateCcw,
  BookOpen,
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sparkles,
  MessageCircle,
  Vote,
  Megaphone,
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
  const selectedStoryId = useStore($selectedStoryId);
  const currentStory =
    STORY_VIBES.find((s) => s.id === selectedStoryId) || STORY_VIBES[0];
  const t = werewolf[lang];

  const [isResetOpen, setIsResetOpen] = React.useState(false);
  const selectedTargets = useStore($selectedTargets);
  const [keepPlayers, setKeepPlayers] = React.useState(true);
  const sessionId = game.id || "---";

  // Build phase steps
  const selectedRoleIds = useStore($selectedRoleIds);
  const witchPotions = useStore($witchPotions);
  const hunterPendingShot = useStore($hunterPendingShot);
  const lovers = useStore($lovers);

  const steps = useMemo<PhaseStep[]>(() => {
    if (game.phase === "night") {
      return getNightSteps(
        players,
        game.cycle,
        selectedRoleIds,
        lang,
        witchPotions,
      );
    }
    return getDaySteps(lang, hunterPendingShot);
  }, [
    game.phase,
    game.cycle,
    players,
    selectedRoleIds,
    lang,
    witchPotions,
    hunterPendingShot,
  ]);

  const nightResults = useMemo(() => {
    return calculateNightResults(players, selectedTargets, witchPotions);
  }, [players, selectedTargets, witchPotions]);

  const currentStepIndex = Math.min(game.phaseStepIndex, steps.length - 1);
  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    // Validation for mapping phase
    if (
      currentStep?.type === "mapping" &&
      currentStep.targetCount !== undefined
    ) {
      const currentRoleCount = players.filter(
        (p) => p.roleId === currentStep.roleId,
      ).length;
      if (currentRoleCount !== currentStep.targetCount) {
        // Maybe show a toast here? For now, we'll just check if it's correct
        return;
      }
    }

    // If we're leaving the mapping ritual, auto-assign "villager" to everyone else
    const nextStep = steps[currentStepIndex + 1];
    if (
      currentStep?.type === "mapping" &&
      (!nextStep || nextStep.type !== "mapping")
    ) {
      players.forEach((p) => {
        if (!p.roleId) {
          updatePlayerRole(p.id, "villager");
        }
      });
    }

    if (currentStep?.id === "day-hunter-shot") {
      const targets = selectedTargets[currentStep.id] || [];
      if (targets.length === 1) {
        resolveHunterShot(targets[0]);
      } else {
        // Hunter must choose someone? Or can they skip?
        // Usually, the step should stay until they choose.
        return;
      }
    }

    if (isLastStep) {
      advancePhase();
    } else {
      setPhaseStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setPhaseStepIndex(currentStepIndex - 1);
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

  const getRoleName = (roleId: string) => {
    return (t[`role.${roleId}.name` as keyof typeof t] as string) || roleId;
  };

  const getStepTitle = (step: PhaseStep) => {
    const raw = t[step.titleKey as keyof typeof t] as string;
    if (!raw) return step.titleKey;
    if (step.roleId) {
      let title = raw.replace("{role}", getRoleName(step.roleId));
      if (step.type === "mapping" && step.targetCount !== undefined) {
        const count = players.filter((p) => p.roleId === step.roleId).length;
        title += ` (${count}/${step.targetCount})`;
      }
      return title;
    }
    return raw;
  };

  const getStepDescription = (step: PhaseStep) => {
    // Story-specific narrator overrides
    if (step.id === "night-sleep" && currentStory.nightText) {
      const storyText = t[currentStory.nightText as keyof typeof t];
      if (storyText) return storyText;
    }
    if (step.id === "night-wake" && currentStory.dayText) {
      const storyText = t[currentStory.dayText as keyof typeof t];
      if (storyText) return storyText;
    }

    // For role actions, use the role-specific nightAction translation
    if (step.type === "role_action" && step.roleId) {
      const actionKey = `role.${step.roleId}.nightAction` as keyof typeof t;
      // If it's a specific sub-action (like witch save/kill), use the step descriptionKey which already has the suffix
      if (step.descriptionKey.startsWith("role.")) {
        return (
          (t[step.descriptionKey as keyof typeof t] as string) ||
          step.descriptionKey
        );
      }
      return (t[actionKey] as string) || step.descriptionKey;
    }
    return (
      (t[step.descriptionKey as keyof typeof t] as string) ||
      step.descriptionKey
    );
  };

  const getStepIcon = (step: PhaseStep) => {
    switch (step.type) {
      case "role_action":
        return <Eye className="h-8 w-8" />;
      case "announcement":
        return <Megaphone className="h-8 w-8" />;
      case "discussion":
        return <MessageCircle className="h-8 w-8" />;
      case "vote":
        return <Vote className="h-8 w-8" />;
      case "mapping":
        return <Users className="h-8 w-8" />;
      default:
        return <Sparkles className="h-8 w-8" />;
    }
  };

  const stepPlayers =
    currentStep?.playerIds
      .map((id) => players.find((p) => p.id === id))
      .filter(Boolean) || [];

  const aliveCount = players.filter((p) => p.isAlive).length;

  const phaseLabel = t[
    `dashboard.phase.${game.phase}` as keyof typeof t
  ] as string;

  return (
    <div className="flex flex-col gap-6 sm:gap-8 p-4 sm:p-6 max-w-6xl mx-auto min-h-screen pb-32">
      {/* Header */}
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
              {phaseLabel} {game.cycle}
            </h1>
            <p className="text-muted-foreground font-medium text-xs sm:text-sm">
              {t["dashboard.session"]}: {sessionId} • {currentStory.villageName}
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
                <div className="flex items-center space-x-2 pt-4">
                  <Checkbox
                    id="keepPlayers"
                    checked={keepPlayers}
                    onCheckedChange={(checked: boolean | "indeterminate") =>
                      setKeepPlayers(checked === true)
                    }
                  />
                  <Label
                    htmlFor="keepPlayers"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t["dashboard.resetConfirm.keepPlayers"]}
                  </Label>
                </div>
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
                    const newGame = resetGame(keepPlayers);
                    window.location.href = `/${lang}/werewolf/play/${newGame.id}`;
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
        {/* Phase Step Runner — Main area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Step counter */}
          <div className="flex items-center justify-between px-2">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              {(t["phase.step"] as string)
                .replace("{current}", String(currentStepIndex + 1))
                .replace("{total}", String(steps.length))}
            </p>
            {/* Step dots */}
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPhaseStepIndex(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    i === currentStepIndex
                      ? "w-8 bg-primary"
                      : i < currentStepIndex
                        ? "w-2.5 bg-primary/40"
                        : "w-2.5 bg-muted-foreground/20"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Current Step Card */}
          {currentStep && (
            <Card
              className={`border-2 shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 ${
                game.phase === "night"
                  ? "bg-linear-to-br from-indigo-950 via-slate-900 to-indigo-950 border-indigo-800/50 text-indigo-50"
                  : "bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50 border-amber-200/50 text-amber-950"
              }`}
            >
              <CardContent className="p-6 sm:p-10">
                <div className="flex flex-col items-center text-center gap-6">
                  {/* Step icon */}
                  <div
                    className={`p-5 rounded-3xl ${
                      game.phase === "night"
                        ? "bg-indigo-800/50 text-indigo-300"
                        : "bg-amber-200/50 text-amber-700"
                    }`}
                  >
                    {getStepIcon(currentStep)}
                  </div>

                  {/* Role badge */}
                  {currentStep.roleId && (
                    <Badge
                      className={`text-sm px-4 py-1.5 rounded-full font-bold ${
                        game.phase === "night"
                          ? "bg-indigo-700 text-indigo-100 border-indigo-600"
                          : "bg-amber-200 text-amber-800 border-amber-300"
                      }`}
                    >
                      {getRoleName(currentStep.roleId)}
                    </Badge>
                  )}

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                    {getStepTitle(currentStep)}
                  </h2>

                  {/* Description */}
                  <p
                    className={`text-base sm:text-lg leading-relaxed max-w-md ${
                      game.phase === "night"
                        ? "text-indigo-300"
                        : "text-amber-700"
                    }`}
                  >
                    {getStepDescription(currentStep)}
                  </p>

                  {/* Summary for night-wake and day-announce */}
                  {(currentStep.id === "night-wake" ||
                    currentStep.id === "day-announce") &&
                    nightResults && (
                      <div className="w-full max-w-md space-y-4 pt-4 animate-in slide-in-from-bottom-4 duration-500">
                        <div
                          className={`p-6 rounded-3xl border-2 space-y-4 shadow-inner ${
                            game.phase === "night"
                              ? "bg-indigo-900/40 border-indigo-700/50"
                              : "bg-amber-100/50 border-amber-300/50"
                          }`}
                        >
                          <h3
                            className={`text-sm font-bold uppercase tracking-widest opacity-60 flex items-center gap-2 justify-center ${
                              game.phase === "night"
                                ? "text-indigo-200"
                                : "text-amber-800"
                            }`}
                          >
                            {game.phase === "night" ? (
                              <Moon className="h-4 w-4" />
                            ) : (
                              <Sun className="h-4 w-4" />
                            )}
                            {t["phase.night.summary"]}
                          </h3>

                          {nightResults.eliminatedIds.length > 0 ? (
                            <div className="space-y-3">
                              <p
                                className={`text-sm font-bold ${game.phase === "night" ? "text-rose-400" : "text-rose-600"}`}
                              >
                                {t["phase.night.summary.eliminated"]}
                              </p>
                              <div className="flex flex-wrap justify-center gap-2">
                                {nightResults.eliminatedIds.map((id) => {
                                  const p = players.find(
                                    (player) => player.id === id,
                                  );
                                  return (
                                    <Badge
                                      key={id}
                                      variant="destructive"
                                      className="px-3 py-1.5 rounded-xl font-bold bg-rose-500/20 text-rose-500 border-rose-500/30"
                                    >
                                      <Skull className="mr-1.5 h-3.5 w-3.5" />
                                      {p?.name}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="py-2">
                              <p
                                className={`text-lg font-bold flex items-center justify-center gap-2 ${game.phase === "night" ? "text-emerald-400" : "text-emerald-600"}`}
                              >
                                <Heart className="h-5 w-5 fill-current" />
                                {t["phase.night.summary.survived"]}
                              </p>
                            </div>
                          )}

                          {nightResults.savedIds.length > 0 && (
                            <div
                              className={`pt-2 border-t ${
                                game.phase === "night"
                                  ? "border-indigo-700/30"
                                  : "border-amber-300/30"
                              }`}
                            >
                              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">
                                {t["phase.night.summary.protected"]}
                              </p>
                              <div className="flex flex-wrap justify-center gap-1.5 opacity-60">
                                {nightResults.savedIds.map((id) => {
                                  const p = players.find(
                                    (player) => player.id === id,
                                  );
                                  return (
                                    <span
                                      key={id}
                                      className={`text-xs font-medium px-2 py-0.5 rounded-lg border ${
                                        game.phase === "night"
                                          ? "bg-indigo-500/10 border-indigo-500/20"
                                          : "bg-amber-500/10 border-amber-500/20"
                                      }`}
                                    >
                                      {p?.name}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="text-xs italic opacity-50 text-center">
                          * {t["phase.night.summary.narrator"]}
                        </p>
                      </div>
                    )}

                  {/* Role Action UI: Active players & target selection */}
                  {currentStep.type === "role_action" &&
                    currentStep.roleId &&
                    (() => {
                      const rolePlayers = stepPlayers.filter((p) => p?.isAlive);
                      // Targetable = alive players not in this role group
                      const targetable = players.filter(
                        (p) => p.isAlive && p.roleId !== currentStep.roleId,
                      );
                      const stepTargets = selectedTargets[currentStep.id] || [];

                      const handleToggleTarget = (playerId: string) => {
                        if (currentStep.maxTargets !== undefined) {
                          const isRemoving = stepTargets.includes(playerId);
                          if (
                            !isRemoving &&
                            stepTargets.length >= currentStep.maxTargets
                          ) {
                            // If it's a single target action, replace the existing selection
                            if (currentStep.maxTargets === 1) {
                              // Clear others and set this one
                              $selectedTargets.setKey(currentStep.id, [
                                playerId,
                              ]);
                              return;
                            }
                            // Otherwise ignore if limit reached
                            return;
                          }
                        }
                        toggleTarget(currentStep.id, playerId);
                      };

                      return (
                        <div className="w-full space-y-6 pt-6">
                          {/* Active role players */}
                          {rolePlayers.length > 0 && (
                            <div className="space-y-3">
                              <p className="text-[11px] font-bold opacity-60 uppercase tracking-widest text-center">
                                {t["phase.roleAction.activePlayers"]}
                              </p>
                              <div className="flex flex-wrap justify-center gap-2">
                                {rolePlayers.map(
                                  (p) =>
                                    p && (
                                      <Badge
                                        key={p.id}
                                        className="px-4 py-2 rounded-xl text-sm font-bold bg-primary/20 text-primary border border-primary/30"
                                      >
                                        {p.name}
                                      </Badge>
                                    ),
                                )}
                              </div>
                            </div>
                          )}

                          {/* Targetable players */}
                          {targetable.length > 0 && (
                            <div className="space-y-3">
                              <p className="text-[11px] font-bold opacity-60 uppercase tracking-widest text-center flex items-center justify-center gap-1.5">
                                <Crosshair className="h-3.5 w-3.5" />
                                {t["phase.roleAction.targets"]}
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                {targetable.map((p) => {
                                  const isSelected = stepTargets.includes(p.id);
                                  const playerRole = getRole(p.roleId);
                                  return (
                                    <Button
                                      key={p.id}
                                      variant={
                                        isSelected ? "default" : "outline"
                                      }
                                      onClick={() => handleToggleTarget(p.id)}
                                      className={`h-14 rounded-xl justify-start px-3 font-bold border-2 transition-all gap-2 ${
                                        isSelected
                                          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30 scale-[1.02]"
                                          : game.phase === "night"
                                            ? "border-indigo-800/40 bg-indigo-900/20 text-indigo-100 hover:border-primary/50"
                                            : "border-amber-300/40 bg-amber-100/30 text-amber-900 hover:border-primary/50"
                                      }`}
                                    >
                                      <div
                                        className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                                          isSelected
                                            ? "bg-primary-foreground/20"
                                            : game.phase === "night"
                                              ? "bg-indigo-800/30"
                                              : "bg-amber-200/50"
                                        }`}
                                      >
                                        {isSelected ? (
                                          <Check className="h-4 w-4" />
                                        ) : (
                                          p.name[0].toUpperCase()
                                        )}
                                      </div>
                                      <div className="text-left truncate">
                                        <span className="block text-sm truncate">
                                          {p.name}
                                        </span>
                                        {playerRole && (
                                          <span
                                            className={`text-[9px] uppercase tracking-wider block ${
                                              isSelected
                                                ? "opacity-70"
                                                : "opacity-50"
                                            }`}
                                          >
                                            {playerRole.name}
                                          </span>
                                        )}
                                      </div>
                                    </Button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          {/* Results for specific roles (e.g. Seer) */}
                          {currentStep.roleId === "seer" &&
                            stepTargets.length > 0 && (
                              <div className="p-4 rounded-2xl bg-primary/10 border-2 border-primary/30 text-center animate-in fade-in zoom-in duration-300">
                                <p className="text-sm font-bold uppercase tracking-wider opacity-60 mb-1">
                                  {t["phase.roleAction.selected"] || "Result"}
                                </p>
                                {stepTargets.map((id) => {
                                  const p = players.find(
                                    (player) => player.id === id,
                                  );
                                  const resultRoleId =
                                    nightResults?.checkedResults[id];
                                  const roleName = resultRoleId
                                    ? getRoleName(resultRoleId)
                                    : "Unknown";
                                  return (
                                    <div
                                      key={id}
                                      className="text-lg font-black"
                                    >
                                      {p?.name}:{" "}
                                      <span className="text-primary">
                                        {roleName}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                        </div>
                      );
                    })()}

                  {/* Mapping Phase UI: Per-role assignment */}
                  {currentStep.type === "mapping" && currentStep.roleId && (
                    <div className="w-full space-y-4 pt-4">
                      <p className="text-sm font-bold opacity-70 uppercase tracking-widest text-center">
                        {t["phase.night.mapping.prompt"] ||
                          "Select players for this role"}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {players.map((p) => {
                          const isThisRole = p.roleId === currentStep.roleId;
                          const hasOtherRole = p.roleId && !isThisRole;
                          const currentRoleCount = players.filter(
                            (player) => player.roleId === currentStep.roleId,
                          ).length;
                          const isSelectionDisabled =
                            !isThisRole &&
                            currentStep.targetCount !== undefined &&
                            currentRoleCount >= currentStep.targetCount;

                          return (
                            <Button
                              key={p.id}
                              variant={isThisRole ? "default" : "outline"}
                              disabled={isSelectionDisabled}
                              onClick={() =>
                                updatePlayerRole(
                                  p.id,
                                  isThisRole ? undefined : currentStep.roleId,
                                )
                              }
                              className={`h-16 rounded-2xl justify-between px-6 font-bold border-2 transition-all ${
                                isThisRole
                                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]"
                                  : hasOtherRole
                                    ? "opacity-40 border-indigo-900/30 bg-indigo-950/50 text-indigo-300"
                                    : isSelectionDisabled
                                      ? "opacity-20 border-indigo-900/10 cursor-not-allowed"
                                      : "border-indigo-800/50 hover:border-primary/50 bg-indigo-900/20 text-indigo-100"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs ${
                                    isThisRole
                                      ? "bg-primary-foreground/20"
                                      : "bg-indigo-800/30"
                                  }`}
                                >
                                  {p.name[0].toUpperCase()}
                                </div>
                                <div className="text-left">
                                  <span
                                    className={`block ${!isThisRole && game.phase === "night" ? "text-indigo-300" : ""}`}
                                  >
                                    {p.name}
                                  </span>
                                  {hasOtherRole && (
                                    <span className="text-[9px] uppercase opacity-60 block">
                                      {getRoleName(p.roleId!)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {isThisRole && <Check className="h-5 w-5" />}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <Button
              size="lg"
              variant="outline"
              onClick={handlePrev}
              disabled={isFirstStep}
              className="flex-1 h-14 rounded-2xl font-bold text-base border-2 transition-all"
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              {t["phase.prev"]}
            </Button>
            <Button
              size="lg"
              onClick={handleNext}
              disabled={
                currentStep?.type === "mapping" &&
                currentStep.targetCount !== undefined &&
                players.filter((p) => p.roleId === currentStep.roleId)
                  .length !== currentStep.targetCount
              }
              className={`flex-2 h-14 rounded-2xl font-black text-base shadow-xl transition-all active:scale-[0.98] ${
                isLastStep
                  ? game.phase === "night"
                    ? "bg-amber-500 text-amber-950 shadow-amber-500/40 hover:bg-amber-400"
                    : "bg-slate-900 text-slate-100 shadow-slate-900/40 hover:bg-slate-800"
                  : game.phase === "night"
                    ? "bg-indigo-600 text-indigo-50 shadow-indigo-600/40 hover:bg-indigo-500"
                    : "bg-amber-500 text-amber-950 shadow-amber-500/40 hover:bg-amber-400"
              }`}
            >
              {isLastStep ? (
                <>
                  {game.phase === "night" ? (
                    <Sun className="mr-2 h-5 w-5" />
                  ) : (
                    <Moon className="mr-2 h-5 w-5" />
                  )}
                  {(t["phase.finishPhase"] as string).replace(
                    "{phase}",
                    phaseLabel,
                  )}
                </>
              ) : (
                <>
                  {t["phase.next"]}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Player List Sidebar */}
        <div className="space-y-6">
          <Card className="border-2 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-linear-to-b from-primary/10 via-primary/5 to-transparent border-b pb-4">
              <CardTitle className="flex items-center justify-between text-xl">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {t["dashboard.villageStatus"]}
                </span>
                <Badge
                  variant="secondary"
                  className="rounded-full px-3 font-bold"
                >
                  {aliveCount} {t["dashboard.alive"]}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-auto">
                <div className="p-3 space-y-1.5">
                  {players.map((player) => {
                    const role = getRole(player.roleId);
                    const isInCurrentStep = currentStep?.playerIds.includes(
                      player.id,
                    );
                    return (
                      <div
                        key={player.id}
                        className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                          !player.isAlive
                            ? "bg-muted/30 opacity-50 grayscale border-transparent"
                            : isInCurrentStep
                              ? "border-primary bg-primary/10 shadow-md"
                              : "border-transparent hover:border-primary/20 bg-muted/20"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-base shadow-inner shrink-0 ${
                              !player.isAlive
                                ? "bg-muted text-muted-foreground"
                                : isInCurrentStep
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-primary/10 text-primary"
                            }`}
                          >
                            {player.name[0].toUpperCase()}
                          </div>
                          <div className="truncate">
                            <p
                              className={`font-bold text-base truncate ${
                                !player.isAlive
                                  ? "line-through opacity-50"
                                  : "text-slate-900 dark:text-slate-50"
                              }`}
                            >
                              {player.name}
                            </p>
                            <p
                              className={`text-[10px] font-bold uppercase tracking-wider ${
                                !player.isAlive
                                  ? "text-muted-foreground"
                                  : "text-primary/60"
                              }`}
                            >
                              {role?.name || "Unknown"}
                              {lovers.includes(player.id) && (
                                <span className="inline-flex items-center ml-2 text-rose-500 gap-0.5">
                                  <Heart className="h-2 w-2 fill-current" />
                                  <span className="text-[8px]">
                                    {t["role.cupid.lovers"]}
                                  </span>
                                </span>
                              )}
                              {player.roleId === "witch" && (
                                <span className="inline-flex items-center ml-2 gap-1">
                                  <Badge
                                    variant="outline"
                                    className={`h-3 px-1 text-[7px] ${witchPotions.life ? "border-green-500 text-green-600" : "opacity-30 border-slate-300"}`}
                                  >
                                    {t["role.witch.potion.life"]}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={`h-3 px-1 text-[7px] ${witchPotions.death ? "border-red-500 text-red-600" : "opacity-30 border-slate-300"}`}
                                  >
                                    {t["role.witch.potion.death"]}
                                  </Badge>
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant={player.isAlive ? "outline" : "destructive"}
                          onClick={() => {
                            const newPlayers = players.map((p) =>
                              p.id === player.id
                                ? { ...p, isAlive: !p.isAlive }
                                : p,
                            );
                            $players.set(newPlayers);
                          }}
                          className={`h-10 w-10 shrink-0 rounded-xl border-2 shadow-md transition-all ${
                            player.isAlive
                              ? "hover:border-destructive hover:text-destructive hover:bg-destructive/10"
                              : ""
                          }`}
                        >
                          {player.isAlive ? (
                            <Heart className="h-5 w-5 fill-current text-green-500" />
                          ) : (
                            <Skull className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
