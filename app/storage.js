// Saved progress: the checklist lives in localStorage, and can be exported to
// a file and imported back. Nothing leaves the browser except a file the
// reader chooses to download.
export const STORAGE_KEY = 'leonida-complete-progress-v1';

export function loadSavedProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { earned: [], spoiler: false };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.earned)) return { earned: [], spoiler: false };
    return {
      earned: parsed.earned.filter((id) => Number.isInteger(id)),
      spoiler: parsed.spoiler === true,
    };
  } catch {
    return { earned: [], spoiler: false };
  }
}

export function saveProgressToLocalStorage(earnedIds, spoiler) {
  const payload = { version: 1, earned: [...earnedIds].sort((a, b) => a - b), spoiler };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function exportProgressAsJson(earnedIds, spoiler) {
  const payload = {
    app: 'Leonida Complete — GTA VI Trophy Guide & Tracker',
    version: 1,
    exportedAt: new Date().toISOString(),
    earned: [...earnedIds].sort((a, b) => a - b),
    spoiler,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'leonida-complete-progress.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

export async function importProgressFromFile(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const earned = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(earned)) throw new Error('That file has no earned list.');
  const ids = earned.filter((id) => Number.isInteger(id));
  if (ids.length === 0 && earned.length > 0) throw new Error('That file has no valid trophy ids.');
  return { earned: ids, spoiler: parsed.spoiler === true };
}

export function resetAllProgress() {
  localStorage.removeItem(STORAGE_KEY);
}
