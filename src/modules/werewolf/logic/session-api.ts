import type { WerewolfState } from "./store";

const API_BASE = "/api/sessions";

export const saveSessionToApi = async (state: WerewolfState) => {
  // If no session ID or not active, skip
  if (!state.settings?.id) return;

  try {
    const response = await fetch(API_BASE, {
      method: "POST",
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
  try {
    const response = await fetch(`${API_BASE}?id=${id}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading session", error);
    return null;
  }
};
