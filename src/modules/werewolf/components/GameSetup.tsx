import React, { useState } from "react";
import { SessionHistorySheet } from "./SessionHistorySheet";
import { useStore } from "@nanostores/react";
import {
  $players,
  $selectedRoleIds,
  addPlayer,
  removePlayer,
  toggleRole,
  addRole,
  removeRole,
  startGame,
  $gameSettings,
  generatePlayers,
  updatePlayerName,
  updatePlayerRole,
  $selectedStoryId,
  setStoryVibe,
} from "../logic/store";
import { suggestRoles } from "../logic/suggestRoles";
import { WEREWOLF_ROLES, type WerewolfRole } from "../types/roles";
import { STORY_VIBES } from "../types/stories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Trash2,
  Plus,
  Play,
  UserPlus,
  Wand2,
  Pencil,
  Check,
  X,
  Minus,
  BookOpen, // Added for story icon fallback
  ChevronLeft,
} from "lucide-react";
import { werewolf } from "../i18n";

interface GameSetupProps {
  lang?: "en" | "vi";
}

export const GameSetup: React.FC<GameSetupProps> = ({ lang = "en" }) => {
  const players = useStore($players);
  const selectedRoleIds = useStore($selectedRoleIds);
  const selectedStoryId = useStore($selectedStoryId);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [generateCount, setGenerateCount] = useState<number>(4);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const t = werewolf[lang];

  // Helper to get translated role
  const getTranslatedRole = (role: WerewolfRole) => ({
    ...role,
    name: t[`role.${role.id}.name` as keyof typeof t] || role.name,
    description:
      t[`role.${role.id}.desc` as keyof typeof t] || role.description,
  });

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName("");
    }
  };

  const handleGeneratePlayers = () => {
    if (generateCount > 0) {
      generatePlayers(generateCount);
    }
  };

  const startEditing = (id: string, currentName: string) => {
    setEditingPlayerId(id);
    setEditingName(currentName);
  };

  const saveEditing = (id: string) => {
    if (editingName.trim()) {
      updatePlayerName(id, editingName.trim());
      setEditingPlayerId(null);
      setEditingName("");
    }
  };

  const cancelEditing = () => {
    setEditingPlayerId(null);
    setEditingName("");
  };

  const handleStartGame = async () => {
    if (players.length < 4) {
      alert(t["setup.players.error.min"] || "At least 4 players needed!");
      return;
    }
    try {
      await startGame();
      const gameId = $gameSettings.get().id;
      window.location.href = `/${lang}/werewolf/play/${gameId}`;
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleSuggestRoles = () => {
    if (players.length < 4) {
      alert(
        t["setup.players.error.min"] || "Suggestions work best with 4+ players",
      );
      return;
    }
    const suggested = suggestRoles(players.length);
    $selectedRoleIds.set(suggested);
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 mx-auto min-h-screen pb-32">
      <div className="px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-16 sm:pt-4">
        <div className="w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-linear-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
              {t["setup.title"]}
            </h1>
            <SessionHistorySheet />
          </div>
          <p className="text-muted-foreground mt-1 text-base sm:text-lg">
            {t["setup.subtitle"]}
          </p>
        </div>
      </div>

      {/* Story Vibe Picker */}
      <section>
        <div className="px-4 sm:px-6 mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {t["setup.storyVibe"] || "Choose Your Story"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {t["setup.storyVibe.subtitle"] ||
              "Set the atmosphere for your village."}
          </p>
        </div>
        <div className="overflow-x-auto pb-4">
          <div className="flex w-max space-x-4 px-4 sm:px-6">
            {STORY_VIBES.map((story) => {
              const isSelected = selectedStoryId === story.id;
              return (
                <button
                  key={story.id}
                  onClick={() => setStoryVibe(story.id)}
                  className={`
                    const transition-all duration-200 ease-in-out
                    relative flex flex-col items-start justify-between gap-3 rounded-2xl border-2 p-5 text-left
                    w-72 min-h-[180px] hover:scale-[1.02] active:scale-[0.98]
                    ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 ring-2 ring-primary/20"
                        : "border-muted bg-card hover:border-primary/50 hover:shadow-md"
                    }
                  `}
                >
                  <div className="text-3xl mb-1">{story.icon}</div>
                  <div>
                    <div className="font-bold text-base flex items-center gap-2">
                      {t[`story.${story.id}.name` as keyof typeof t] ||
                        story.name}
                      {isSelected && (
                        <Badge
                          variant="secondary"
                          className="h-5 px-1.5 text-[10px] bg-primary/10 text-primary"
                        >
                          <Check className="h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-normal leading-relaxed">
                      {t[`story.${story.id}.desc` as keyof typeof t] ||
                        story.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Players Section */}
        <Card className="flex flex-col border-2 shadow-xl shadow-primary/5 overflow-hidden rounded-3xl">
          <CardHeader className="border-b bg-linear-to-b from-primary/10 via-primary/5 to-transparent pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <UserPlus className="h-5 w-5 text-primary" />
                {t["setup.players"]} ({players.length})
              </CardTitle>
            </div>
            <form onSubmit={handleAddPlayer} className="flex gap-2 mt-4">
              <Input
                placeholder={t["setup.players.placeholder"]}
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                className="bg-card border-2 h-12 rounded-xl focus-visible:ring-primary"
              />
              <Button
                type="submit"
                size="icon"
                className="shrink-0 h-12 w-12 rounded-xl shadow-lg"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={20}
                value={generateCount}
                onChange={(e) => setGenerateCount(Number(e.target.value))}
                className="w-20 bg-card border-2 h-11 rounded-xl focus-visible:ring-primary"
              />
              <Button
                variant="secondary"
                onClick={handleGeneratePlayers}
                className="flex-1 h-11 rounded-xl font-bold"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Quick Generate
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] sm:h-[400px]">
              <div className="p-4 flex flex-col gap-2">
                {players.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground italic">
                    Add some players to begin.
                  </div>
                ) : (
                  players.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/30 border-2 border-transparent hover:border-primary/20 transition-all group"
                    >
                      {editingPlayerId === p.id ? (
                        <div className="flex items-center gap-2 flex-1 mr-2">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="h-10 bg-card"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEditing(p.id);
                              if (e.key === "Escape") cancelEditing();
                            }}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => saveEditing(p.id)}
                            className="h-10 w-10 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-full"
                          >
                            <Check className="h-5 w-5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={cancelEditing}
                            className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="font-bold text-lg px-2">
                            {p.name}
                          </span>
                          <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEditing(p.id, p.name)}
                              className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removePlayer(p.id)}
                              className="h-10 w-10 text-destructive hover:bg-destructive/10 rounded-full"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Roles Selection */}
        <Card className="flex flex-col border-2 shadow-xl shadow-primary/5 overflow-hidden rounded-3xl">
          <CardHeader className="border-b bg-linear-to-b from-primary/10 via-primary/5 to-transparent pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{t["setup.rolePool"]}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Select roles for the game.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSuggestRoles}
                className="gap-2 border-primary/20 hover:border-primary/50 rounded-xl"
              >
                <Wand2 className="h-4 w-4 text-primary" />
                {t["setup.suggestRoles"]}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] sm:h-[400px]">
              <div className="p-4 grid grid-cols-1 gap-2.5">
                {WEREWOLF_ROLES.map(getTranslatedRole).map((role) => {
                  const count = selectedRoleIds.filter(
                    (id) => id === role.id,
                  ).length;
                  return (
                    <div
                      key={role.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all ${
                        count > 0
                          ? "border-primary bg-primary/10 shadow-lg shadow-primary/5"
                          : "border-transparent bg-muted/20 opacity-70"
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <h4 className="font-bold text-lg">{role.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1 italic">
                          {role.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {count > 0 && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg border-primary/30 hover:bg-primary/20"
                            onClick={() => removeRole(role.id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                        <div className="flex flex-col items-center min-w-8">
                          {count > 0 ? (
                            <Badge className="shadow-md rounded-full px-3 py-1 font-bold">
                              {count}
                            </Badge>
                          ) : (
                            <span className="text-xs font-bold text-muted-foreground uppercase">
                              Add
                            </span>
                          )}
                        </div>
                        <Button
                          variant={count > 0 ? "default" : "outline"}
                          size="icon"
                          className={`h-8 w-8 rounded-lg ${count === 0 ? "border-primary/30" : ""}`}
                          onClick={() => addRole(role.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="px-4 sm:px-6 flex justify-center pt-8 pb-12">
        <Button
          size="lg"
          onClick={handleStartGame}
          disabled={players.length < 4}
          className="w-full sm:w-auto rounded-2xl px-12 h-16 font-bold text-xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          <Play className="mr-3 h-7 w-7 fill-current" />
          {t["setup.startGame"]}
        </Button>
      </div>
    </div>
  );
};
