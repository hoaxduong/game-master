import type { WerewolfState } from "./store";

const API_BASE = "/api/werewolf/sessions";

export const saveSessionToApi = async (state: WerewolfState) => {
  // If no session ID or not active, skip
  if (!state.settings?.id) return;

  try {
    const response = await fetch(`${API_BASE}/${state.settings.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
    if (!response.ok) {
      console.error("Failed to save session", await response.text());
    }
  } catch (error) {
    console.error("Error saving session", error);
  }
};

export const loadSessionFromApi = async (
  id: string,
): Promise<WerewolfState | null> => {
  console.log("[session-api] loadSessionFromApi called with id:", id);
  console.log("[session-api] Fetching from:", `${API_BASE}/${id}`);

  try {
    const response = await fetch(`${API_BASE}/${id}`);
    console.log(
      "[session-api] Response status:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      console.error("[session-api] Response not OK:", await response.text());
      return null;
    }

    const data = await response.json();
    console.log("[session-api] Received data:", data);
    return data;
  } catch (error) {
    console.error("Error loading session", error);
    return null;
  }
};

export interface SessionSummary {
  id: string;
  updatedAt: string;
  summary: {
    cycle: number;
    phase: string;
    status: string;
    aliveCount: number;
    totalCount: number;
  };
}

export const listSessionsFromApi = async (page = 1, limit = 10) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await fetch(`${API_BASE}?${params}`);
    if (!response.ok) return null;
    return (await response.json()) as {
      data: SessionSummary[];
      pagination: any;
    };
  } catch (error) {
    console.error("Error listing sessions", error);
    return null;
  }
};
