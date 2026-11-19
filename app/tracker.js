// The trophy checklist: filters by kind, grade and search text, and the
// spoiler setting that hides the names and descriptions of story trophies
// until they are earned.
export const STORY_KINDS = new Set(['story', 'side-story', 'strangers']);

export const KIND_FILTERS = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'story', label: 'Story', match: (t) => STORY_KINDS.has(t.kind) },
  { id: 'missable', label: 'Missable', match: (t) => t.missable === true },
  { id: 'collectibles', label: 'Collectibles', match: (t) => t.kind === 'collectibles' },
  { id: 'activities', label: 'Activities', match: (t) => t.kind === 'activities' },
  { id: 'robbery', label: 'Robbery', match: (t) => t.kind === 'robbery' },
  { id: 'misc', label: 'Misc', match: (t) => t.kind === 'misc' },
  { id: 'platinum', label: 'Platinum & 100%', match: (t) => t.kind === 'platinum' },
  { id: 'online', label: 'Online', match: () => false },
];

export function isSpoilerMasked(trophy, state) {
  return state.spoiler && STORY_KINDS.has(trophy.kind) && !state.earned.has(trophy.id);
}

// "3/18 spots" for ordinary counts, "$50,000 / $250,000" for money targets.
// Shared by the row indicator and the guide panel so both read the same.
export function formatProgress(trophy, value) {
  const target = trophy.progress.target;
  if (trophy.progress.money) {
    const fmt = (n) => `$${n.toLocaleString('en-US')}`;
    return `${fmt(value)} / ${fmt(target)}`;
  }
  return `${value}/${target} ${trophy.progress.unit}`;
}

export function currentCount(trophy, state) {
  if (!trophy.progress) return 0;
  const raw = state.counts ? state.counts[trophy.id] : 0;
  const value = Number.isInteger(raw) ? raw : 0;
  return Math.max(0, Math.min(trophy.progress.target, value));
}

export function filterTrophiesByState(trophies, state) {
  const kindFilter = KIND_FILTERS.find((k) => k.id === state.kind) ?? KIND_FILTERS[0];
  const query = state.query.trim().toLowerCase();
  return trophies.filter((t) => {
    if (!kindFilter.match(t)) return false;
    if (state.grade !== 'all' && t.grade !== state.grade) return false;
    if (state.earnedOnly && !state.earned.has(t.id)) return false;
    if (state.hiddenOnly && !t.hidden) return false;
    if (query) {
      const haystack = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function renderKindPills(container, trophies, state, onKindChange) {
  container.replaceChildren();
  for (const filter of KIND_FILTERS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pill' + (state.kind === filter.id ? ' active' : '');
    const count = filter.id === 'online' ? 0 : trophies.filter(filter.match).length;
    button.textContent = `${filter.label} ${count}`;
    button.setAttribute('aria-pressed', state.kind === filter.id ? 'true' : 'false');
    button.addEventListener('click', () => onKindChange(filter.id));
    container.append(button);
  }
}

function gradeChip(grade) {
  const chip = document.createElement('span');
  chip.className = `chip chip-${grade}`;
  chip.textContent = grade;
  return chip;
}

function renderTrophyRow(trophy, state, onToggleEarned, onSelectTrophy) {
  const row = document.createElement('li');
  const earned = state.earned.has(trophy.id);
  const masked = isSpoilerMasked(trophy, state);
  row.className = 'trophy-row' + (earned ? ' earned' : '') + (state.selectedId === trophy.id ? ' selected' : '');
  row.dataset.trophyId = String(trophy.id);

  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned;
  box.setAttribute('aria-label', `Earned: ${masked ? 'hidden trophy' : trophy.name}`);
  box.addEventListener('click', (event) => {
    // Ticking the box must not also select the row: selecting rebuilds the
    // list, which detaches this checkbox before its change event fires.
    event.stopPropagation();
  });
  box.addEventListener('change', (event) => {
    event.stopPropagation();
    onToggleEarned(trophy.id, box.checked);
  });
  row.append(box);

  const main = document.createElement('div');
  main.className = 'trophy-main';
  const name = document.createElement('div');
  name.className = 'trophy-name';
  name.textContent = masked ? 'Hidden trophy — earn it to reveal its name' : trophy.name;
  const desc = document.createElement('div');
  desc.className = 'trophy-desc';
  desc.textContent = masked
    ? 'Hidden on PlayStation until earned. (Spoiler setting is on.)'
    : trophy.description;
  main.append(name, desc);

  const chips = document.createElement('div');
  chips.className = 'trophy-chips';
  chips.append(gradeChip(trophy.grade));
  if (trophy.hidden) {
    const hidden = document.createElement('span');
    hidden.className = 'chip chip-hidden';
    hidden.textContent = 'Hidden on PSN';
    chips.append(hidden);
  }
  if (trophy.missable) {
    const missable = document.createElement('span');
    missable.className = 'chip chip-missable';
    missable.textContent = 'Missable';
    chips.append(missable);
  }
  if (trophy.unconfirmed) {
    const unconfirmed = document.createElement('span');
    unconfirmed.className = 'chip chip-unconfirmed';
    unconfirmed.textContent = 'Method unconfirmed';
    chips.append(unconfirmed);
  }
  if (trophy.countLabel && !masked) {
    const count = document.createElement('span');
    count.className = 'chip chip-count';
    count.textContent = trophy.countLabel;
    chips.append(count);
  }
  const stage = document.createElement('span');
  stage.className = 'chip chip-stage';
  stage.textContent = `Roadmap S${trophy.stage}`;
  chips.append(stage);
  main.append(chips);
  row.append(main);

  // Right-hand meta: the story chapter (a bare number — it names nothing,
  // so it stays visible even for masked rows) and, for countable trophies,
  // the reader's own running count once they have started it.
  const meta = document.createElement('div');
  meta.className = 'trophy-meta';
  if (trophy.chapter) {
    const chapter = document.createElement('span');
    chapter.className = 'trophy-chapter';
    chapter.textContent = `Chapter ${trophy.chapter}`;
    meta.append(chapter);
  }
  if (trophy.progress) {
    const done = currentCount(trophy, state);
    if (done > 0) {
      const progress = document.createElement('span');
      progress.className = 'trophy-progress';
      progress.textContent = formatProgress(trophy, done);
      meta.append(progress);
    }
  }
  if (meta.childElementCount > 0) row.append(meta);

  row.addEventListener('click', () => onSelectTrophy(trophy.id));
  return row;
}

export function renderTrophyChecklist(listEl, trophies, state, onToggleEarned, onSelectTrophy) {
  const shown = filterTrophiesByState(trophies, state);
  listEl.replaceChildren();
  if (shown.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'trophy-row';
    const text = document.createElement('div');
    text.className = 'trophy-main';
    text.textContent = state.kind === 'online'
      ? 'No online trophies — all 55 are single-player (PowerPyx, GTABase, OutputLag, KeenGamer and GTA Zone agree).'
      : 'No trophies match these filters. Clear the search or pick another kind.';
    empty.append(text);
    listEl.append(empty);
    return shown;
  }
  for (const trophy of shown) {
    listEl.append(renderTrophyRow(trophy, state, onToggleEarned, onSelectTrophy));
  }
  return shown;
}

export function renderListStatus(statusEl, shownCount, totalCount, state) {
  const kindLabel = KIND_FILTERS.find((k) => k.id === state.kind)?.label.toLowerCase() ?? 'all kinds';
  const spoilerNote = state.spoiler
    ? 'Spoilers on: story trophies masked until earned.'
    : 'Spoilers off: all names shown.';
  const kindPart = state.kind === 'all' ? '' : ` (${kindLabel})`;
  statusEl.textContent = `Showing ${shownCount} of ${totalCount} trophies${kindPart}. ${spoilerNote}`;
}
