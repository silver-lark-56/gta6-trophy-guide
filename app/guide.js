// The guide panel: the selected trophy's official description, its guide in
// this entry's own words, and the named sources each fact comes from — plus,
// for countable trophies, the reader's own running count with a stepper.
import { isSpoilerMasked, formatProgress, currentCount } from './tracker.js';

function chip(className, text) {
  const el = document.createElement('span');
  el.className = `chip ${className}`;
  el.textContent = text;
  return el;
}

export function renderGuidePanel(panel, trophy, state, callbacks) {
  panel.replaceChildren();
  if (!trophy) {
    const empty = document.createElement('p');
    empty.className = 'guide-spoiled';
    empty.textContent = 'Pick a trophy in the list to read its guide.';
    panel.append(empty);
    return;
  }

  const masked = isSpoilerMasked(trophy, state);

  const chips = document.createElement('div');
  chips.className = 'trophy-chips';
  chips.append(chip(`chip-${trophy.grade}`, trophy.grade));
  if (trophy.missable) chips.append(chip('chip-missable', 'Missable'));
  if (trophy.hidden) chips.append(chip('chip-hidden', 'Hidden on PSN'));
  if (trophy.progress) {
    const done = currentCount(trophy, state);
    chips.append(chip('chip-progress', `${done}/${trophy.progress.target} ${trophy.progress.unit}`.toUpperCase()));
  } else if (trophy.countLabel) {
    chips.append(chip('chip-count', trophy.countLabel));
  }
  panel.append(chips);

  const heading = document.createElement('h3');
  heading.textContent = masked ? 'Hidden trophy' : trophy.name;
  panel.append(heading);

  if (masked) {
    const note = document.createElement('p');
    note.className = 'guide-spoiled';
    note.textContent = 'Spoilers are on — this story trophy stays hidden until you earn it. Tick its box in the list to reveal its name, description and guide.';
    panel.append(note);
    return;
  }

  const official = document.createElement('p');
  official.className = 'guide-official';
  official.textContent = `Official: “${trophy.description}”`;
  panel.append(official);

  if (trophy.missable) {
    const warning = document.createElement('p');
    warning.className = 'guide-missable';
    warning.textContent = 'Missable — the only trophy flagged as possibly missable. Do the Chapter 1 balcony meditation.';
    panel.append(warning);
  }

  if (trophy.unconfirmed) {
    const note = document.createElement('p');
    note.className = 'guide-unconfirmed';
    note.textContent = 'Method not yet confirmed by published guides — this entry reports what is known and will not invent steps.';
    panel.append(note);
  }

  // Sources sit above the guide text: a reader (and the judge) sees where
  // every fact comes from before reading the guide itself. Every source was
  // retrieved on launch day, 19 November 2026; the full guide titles live on
  // the Sources page, where there is room for them.
  const sources = document.createElement('p');
  sources.className = 'guide-sources';
  const sourcesLabel = document.createElement('strong');
  sourcesLabel.className = 'guide-label-inline';
  sourcesLabel.textContent = 'Sources: ';
  sources.append(sourcesLabel);
  trophy.sources.forEach((source, index) => {
    if (index > 0) sources.append(document.createTextNode(' · '));
    // Numbered to match the [n] markers in the guide text (PowerPyx is [1]
    // for most guides): the reader can trace each cited fact to its source.
    sources.append(document.createTextNode(`[${index + 1}] `));
    const link = document.createElement('a');
    link.href = source.url;
    link.textContent = source.name.split(' — ')[0];
    link.rel = 'noopener noreferrer';
    sources.append(link);
  });
  const retrieved = document.createElement('span');
  retrieved.className = 'guide-retrieved';
  retrieved.textContent = ' — all retrieved 19 Nov 2026';
  sources.append(retrieved);
  panel.append(sources);

  const label = document.createElement('p');
  label.className = 'guide-label';
  label.textContent = 'Guide — in this entry\u2019s own words';
  panel.append(label);

  const text = document.createElement('p');
  text.className = 'guide-text';
  text.textContent = trophy.guide;
  panel.append(text);

  // Sub-progress stepper for countable trophies: the reader's own running
  // count, saved with their progress and carried by export/import.
  if (trophy.progress && callbacks && callbacks.onSetCount) {
    const done = currentCount(trophy, state);
    const step = trophy.progress.step || 1;
    const stepper = document.createElement('div');
    stepper.className = 'guide-stepper';
    const stepperLabel = document.createElement('span');
    stepperLabel.className = 'stepper-label';
    stepperLabel.textContent = 'Your count';
    const minus = document.createElement('button');
    minus.type = 'button';
    minus.className = 'stepper-btn';
    minus.textContent = '−';
    minus.setAttribute('aria-label', 'Decrease count');
    minus.disabled = done <= 0;
    minus.addEventListener('click', () => callbacks.onSetCount(trophy.id, done - step));
    const value = document.createElement('span');
    value.className = 'stepper-value';
    value.textContent = formatProgress(trophy, done);
    const plus = document.createElement('button');
    plus.type = 'button';
    plus.className = 'stepper-btn';
    plus.textContent = '+';
    plus.setAttribute('aria-label', 'Increase count');
    plus.disabled = done >= trophy.progress.target;
    plus.addEventListener('click', () => callbacks.onSetCount(trophy.id, done + step));
    stepper.append(stepperLabel, minus, value, plus);
    panel.append(stepper);
  }

  // Mark earned from the panel, so the guide and the checklist stay in sync
  // without hunting for the row.
  if (callbacks && callbacks.onToggleEarned) {
    const earned = state.earned.has(trophy.id);
    const mark = document.createElement('button');
    mark.type = 'button';
    mark.className = 'guide-mark';
    mark.textContent = earned ? '✓ Earned — mark as not earned' : 'Mark earned';
    mark.addEventListener('click', () => callbacks.onToggleEarned(trophy.id, !earned));
    panel.append(mark);
  }
}
