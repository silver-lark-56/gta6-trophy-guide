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
} from './tracker.js';
import { renderGuidePanel } from './guide.js';
import { stageProgress, computeNextUpTrophy } from './stages.js';

const state = {
  trophies: [],
  earned: new Set(),
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
  $('progress-summary').textContent = `${earnedCount} earned · ${total - earnedCount} to go · platinum ${percent}% there`;
  const grades = gradeCounts();
  $('progress-grades').textContent = `platinum ${grades.platinum[0]}/${grades.platinum[1]} · gold ${grades.gold[0]}/${grades.gold[1]} · silver ${grades.silver[0]}/${grades.silver[1]} · bronze ${grades.bronze[0]}/${grades.bronze[1]}`;
  const stageBits = stageProgress(state.trophies, state.earned).map(
    (stage) => `S${stage.n} ${stage.done}/${stage.total}`,
  );
  $('progress-roadmap').textContent = `Roadmap: ${stageBits.join(' · ')}`;
  const next = computeNextUpTrophy(state.trophies, state.earned);
  const nextUp = $('progress-nextup');
  nextUp.replaceChildren();
  const label = document.createElement('strong');
  label.textContent = `Next up: ${next.trophy.name}`;
  const reason = next.reason.length > 60
    ? `${next.reason.slice(0, next.reason.lastIndexOf(' ', 60))}…`
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
  renderGuidePanel($('guide-panel'), selected, state);
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
    roadmapModule.renderCountsTable($('counts-rows'));
    roadmapModule.renderChecklistGroups($('checklist-groups'));
    roadmapModule.renderMissablesPage($('missable-hero'), $('missables-watch'), $('missables-checked'));
    roadmapModule.renderSourcesPage($('sources-rows'), $('sources-unknown'));
    roadmapViewsReady = true;
  }
  roadmapModule.renderRoadmapStages($('roadmap-stages'), state.trophies, state);
}

function persistProgress() {
  saveProgressToLocalStorage(state.earned, state.spoiler);
}

function toggleEarned(id, earned) {
  if (earned) state.earned.add(id);
  else state.earned.delete(id);
  persistProgress();
  renderAll();
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
    renderTracker();
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
    exportProgressAsJson(state.earned, state.spoiler);
  });
  $('import-progress').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const imported = await importProgressFromFile(file);
      const knownIds = new Set(state.trophies.map((t) => t.id));
      state.earned = new Set(imported.earned.filter((id) => knownIds.has(id)));
      state.spoiler = imported.spoiler;
      $('spoiler-toggle').checked = state.spoiler;
      persistProgress();
      renderAll();
    } catch (error) {
      $('list-status').textContent = `Import failed: ${error.message} Nothing was changed.`;
    }
    event.target.value = '';
  });
  $('reset-progress').addEventListener('click', () => {
    if (!window.confirm('Clear all earned ticks and the spoiler setting?')) return;
    resetAllProgress();
    state.earned = new Set();
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
  state.spoiler = saved.spoiler;
  $('spoiler-toggle').checked = state.spoiler;
  wireControls();
  switchTabFromHash();
  renderAll();
}

initLeonidaComplete();
