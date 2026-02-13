import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  listSessionsFromApi,
  type SessionSummary,
} from "@/modules/werewolf/logic/session-api";
import { useState, useEffect } from "react";
import { Loader2, History, PlayCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useStore } from "@nanostores/react";
import {
  $gameSettings,
  loadSession as loadSessionToStore,
} from "@/modules/werewolf/logic/store";

export function SessionHistorySheet() {
  const [open, setOpen] = useState(false);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const currentGame = useStore($gameSettings);

  const fetchSessions = async (p = 1) => {
    setLoading(true);
    const result = await listSessionsFromApi(p, 10);
    if (result) {
      setSessions(result.data);
      setTotalPages(result.pagination.totalPages);
      setPage(result.pagination.page);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      fetchSessions(1);
    }
  }, [open]);

  const handleLoadSession = async (sessionId: string) => {
    const success = await loadSessionToStore(sessionId);
    if (success) {
      setOpen(false);
      const lang = window.location.pathname.startsWith("/vi") ? "vi" : "en";
      const newUrl = `/${lang}/werewolf/play/${sessionId}`;
      window.history.pushState({}, "", newUrl);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="History"
          className="rounded-full"
        >
          <History className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Game History</SheetTitle>
          <SheetDescription>
            Resume your previous game sessions.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex flex-col gap-4 h-[calc(100vh-120px)]">
          <ScrollArea className="flex-1 px-4">
            {loading && sessions.length === 0 ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : sessions.length > 0 ? (
              <div className="flex flex-col gap-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex flex-col gap-2 rounded-lg border p-3 text-sm transition-colors hover:bg-accent/50 ${
                      currentGame.id === session.id
                        ? "border-primary bg-accent"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {new Date(session.updatedAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(session.updatedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <div>
                        Phase:{" "}
                        <span className="text-foreground capitalize">
                          {session.summary.phase} {session.summary.cycle}
                        </span>
                      </div>
                      <div>
                        Status:{" "}
                        <span className="text-foreground capitalize">
                          {session.summary.status}
                        </span>
                      </div>
                      <div>
                        Players:{" "}
                        <span className="text-foreground">
                          {session.summary.aliveCount}/
                          {session.summary.totalCount} Alive
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full mt-2"
                      onClick={() => handleLoadSession(session.id)}
                      disabled={currentGame.id === session.id}
                    >
                      {currentGame.id === session.id ? (
                        "Current Session"
                      ) : (
                        <>
                          <PlayCircle className="mr-2 h-3 w-3" /> Resume
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground p-4">
                No history found.
              </div>
            )}
          </ScrollArea>

          {totalPages > 1 && (
            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchSessions(page - 1)}
                disabled={page <= 1 || loading}
              >
                Previous
              </Button>
              <span className="text-xs flex items-center">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchSessions(page + 1)}
                disabled={page >= totalPages || loading}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
