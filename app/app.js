// Leonida Complete — bootstrap: loads the trophy data, holds the tracker's
// state, renders the progress card, switches tabs, and wires the controls.
import {
  loadSavedProgress,
  saveProgressToLocalStorage,
  exportProgressAsJson,
  importProgressFromFile,
  resetAllProgress,
} from './storage.js';
import {
  renderKindPills,
  renderTrophyChecklist,
  renderListStatus,
  isSpoilerMasked,
} from './tracker.js';
import { renderGuidePanel } from './guide.js';
import { stageProgress, computeNextUpTrophy } from './stages.js';

const state = {
  trophies: [],
  earned: new Set(),
  counts: {},
  selectedId: 28,
  kind: 'all',
  grade: 'all',
  query: '',
  spoiler: false,
  earnedOnly: false,
  hiddenOnly: false,
};

const $ = (id) => document.getElementById(id);

async function loadTrophyData() {
  const response = await fetch('data/trophies.json');
  const doc = await response.json();
  return doc.trophies;
}

function gradeCounts() {
  const counts = { platinum: [0, 0], gold: [0, 0], silver: [0, 0], bronze: [0, 0] };
  for (const trophy of state.trophies) {
    counts[trophy.grade][1] += 1;
    if (state.earned.has(trophy.id)) counts[trophy.grade][0] += 1;
  }
  return counts;
}

function renderProgressCard() {
  const total = state.trophies.length;
  const earnedCount = state.earned.size;
  const percent = total === 0 ? 0 : Math.round((earnedCount / total) * 100);
  $('progress-earned').textContent = String(earnedCount);
  $('progress-fill').style.width = `${percent}%`;
  $('progress-summary').textContent = `· ${total - earnedCount} to go · platinum ${percent}% there`;
  const grades = gradeCounts();
  $('progress-grades').textContent = `platinum ${grades.platinum[0]}/${grades.platinum[1]} · gold ${grades.gold[0]}/${grades.gold[1]} · silver ${grades.silver[0]}/${grades.silver[1]} · bronze ${grades.bronze[0]}/${grades.bronze[1]}`;
  const stageBits = stageProgress(state.trophies, state.earned).map(
    (stage) => `S${stage.n} ${stage.done}/${stage.total}`,
  );
  $('progress-roadmap').textContent = stageBits.join(' ');
  // Next up never names a trophy the spoiler setting hides.
  const next = computeNextUpTrophy(state.trophies, state.earned, (t) => isSpoilerMasked(t, state));
  const nextUp = $('progress-nextup');
  nextUp.replaceChildren();
  if (!next.trophy) {
    const label = document.createElement('strong');
    label.textContent = 'Next up: a hidden story trophy';
    nextUp.append(label, ' — spoilers are on; earn it to reveal its name.');
    return;
  }
  const label = document.createElement('strong');
  label.textContent = `Next up: ${next.trophy.name}`;
  const reason = next.reason.length > 32
    ? `${next.reason.slice(0, next.reason.lastIndexOf(' ', 32))}…`
    : next.reason;
  nextUp.append(label, ` — ${reason}`);
}

function renderTracker() {
  const shown = renderTrophyChecklist(
    $('trophy-list'),
    state.trophies,
    state,
    toggleEarned,
    selectTrophy,
  );
  renderListStatus($('list-status'), shown.length, state.trophies.length, state);
  renderKindPills($('filter-kind'), state.trophies, state, (kind) => {
    state.kind = kind;
    renderTracker();
  });
  const selected = state.trophies.find((t) => t.id === state.selectedId);
  renderGuidePanel($('guide-panel'), selected, state, {
    onSetCount: setCount,
    onToggleEarned: toggleEarned,
  });
}

function renderAll() {
  renderProgressCard();
  renderTracker();
  // The roadmap page only exists once its module has loaded (see below); until
  // then there is nothing to re-render.
  if (roadmapViewsReady) {
    roadmapModule.renderRoadmapStages($('roadmap-stages'), state.trophies, state);
  }
}

// The roadmap, missables and sources pages live in roadmap.js, which is
// imported only when the reader first opens one of those tabs — it is the
// app's biggest module and the tracker does not need it. The static views
// render once; the stages re-render on every state change after that.
let roadmapModule = null;
let roadmapViewsReady = false;

async function ensureRoadmapViews() {
  if (!roadmapModule) roadmapModule = await import('./roadmap.js');
  if (!roadmapViewsReady) {
    roadmapModule.renderCountsGrid($('counts-grid'));
    roadmapModule.renderChecklistGroups($('checklist-groups'));
    roadmapModule.renderMissablesPage($('missable-hero'), $('missables-watch'), $('missables-checked'));
    roadmapModule.renderSourcesPage($('sources-rows'), $('sources-unknown'));
    roadmapViewsReady = true;
  }
  roadmapModule.renderRoadmapStages($('roadmap-stages'), state.trophies, state);
}

function persistProgress() {
  saveProgressToLocalStorage(state.earned, state.spoiler, state.counts);
}

function toggleEarned(id, earned) {
  if (earned) state.earned.add(id);
  else state.earned.delete(id);
  persistProgress();
  renderAll();
}

// Clamp a sub-progress count into [0, target]; zero means "not started" and
// is not stored, so the saved payload stays small.
function setCount(id, value) {
  const trophy = state.trophies.find((t) => t.id === id);
  if (!trophy || !trophy.progress) return;
  const clamped = Math.max(0, Math.min(trophy.progress.target, Math.round(value)));
  if (clamped === 0) delete state.counts[id];
  else state.counts[id] = clamped;
  persistProgress();
  renderTracker();
}

// Counts from storage or an import file are only trusted for trophies that
// actually have a progress target, and clamped into range.
function cleanCountsForTrophies(rawCounts) {
  const byId = new Map(state.trophies.map((t) => [t.id, t]));
  const counts = {};
  for (const [key, value] of Object.entries(rawCounts || {})) {
    const id = Number(key);
    const trophy = byId.get(id);
    if (!trophy || !trophy.progress || !Number.isInteger(value)) continue;
    const clamped = Math.max(0, Math.min(trophy.progress.target, value));
    if (clamped > 0) counts[id] = clamped;
  }
  return counts;
}

function selectTrophy(id) {
  state.selectedId = id;
  history.replaceState(null, '', `#tracker?t=${id}`);
  renderTracker();
}

function switchTabFromHash() {
  const [tabPart, queryPart] = (location.hash || '#tracker').slice(1).split('?');
  const known = ['tracker', 'roadmap', 'missables', 'sources'];
  const active = known.includes(tabPart) ? tabPart : 'tracker';
  for (const name of known) {
    $(`view-${name}`).classList.toggle('active', name === active);
    $(`tab-${name}`).classList.toggle('active', name === active);
  }
  // The missable banner lives on the tracker; the roadmap page carries its
  // own missable banner at the bottom, and the missables page is the banner.
  $('missable-banner').style.display = active === 'tracker' ? '' : 'none';
  if (active !== 'tracker') {
    ensureRoadmapViews().catch((error) => {
      console.error('Roadmap failed to load:', error);
    });
  }
  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    const trophyId = Number(params.get('t'));
    if (Number.isInteger(trophyId) && state.trophies.some((t) => t.id === trophyId)) {
      state.selectedId = trophyId;
      renderTracker();
    }
  }
}

function wireControls() {
  $('search-box').addEventListener('input', (event) => {
    state.query = event.target.value;
    renderTracker();
  });
  $('grade-filter').addEventListener('change', (event) => {
    state.grade = event.target.value;
    renderTracker();
  });
  $('spoiler-toggle').addEventListener('change', (event) => {
    state.spoiler = event.target.checked;
    persistProgress();
    // renderAll, not renderTracker: Next up must re-pick a spoiler-safe
    // trophy the moment the setting changes, not only on reload.
    renderAll();
  });
  $('earned-only-toggle').addEventListener('change', (event) => {
    state.earnedOnly = event.target.checked;
    renderTracker();
  });
  $('hidden-only-toggle').addEventListener('change', (event) => {
    state.hiddenOnly = event.target.checked;
    renderTracker();
  });
  $('export-progress').addEventListener('click', () => {
    exportProgressAsJson(state.earned, state.spoiler, state.counts);
  });
  $('import-progress').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const imported = await importProgressFromFile(file);
      const knownIds = new Set(state.trophies.map((t) => t.id));
      state.earned = new Set(imported.earned.filter((id) => knownIds.has(id)));
      state.spoiler = imported.spoiler;
      state.counts = cleanCountsForTrophies(imported.counts);
      $('spoiler-toggle').checked = state.spoiler;
      persistProgress();
      renderAll();
    } catch (error) {
      $('list-status').textContent = `Import failed: ${error.message} Nothing was changed.`;
    }
    event.target.value = '';
  });
  $('reset-progress').addEventListener('click', () => {
    if (!window.confirm('Clear all earned ticks, counts and the spoiler setting?')) return;
    resetAllProgress();
    state.earned = new Set();
    state.counts = {};
    state.spoiler = false;
    $('spoiler-toggle').checked = false;
    renderAll();
  });
  window.addEventListener('hashchange', switchTabFromHash);
}

async function initLeonidaComplete() {
  state.trophies = await loadTrophyData();
  const saved = loadSavedProgress();
  const knownIds = new Set(state.trophies.map((t) => t.id));
  state.earned = new Set(saved.earned.filter((id) => knownIds.has(id)));
  state.counts = cleanCountsForTrophies(saved.counts);
  state.spoiler = saved.spoiler;
  $('spoiler-toggle').checked = state.spoiler;
  wireControls();
  switchTabFromHash();
  renderAll();
}

initLeonidaComplete();
