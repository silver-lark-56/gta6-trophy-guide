// The guide panel: the selected trophy's official description, its guide in
// this entry's own words, and the named sources each fact comes from.
import { isSpoilerMasked } from './tracker.js';

function chip(className, text) {
  const el = document.createElement('span');
  el.className = `chip ${className}`;
  el.textContent = text;
  return el;
}

export function renderGuidePanel(panel, trophy, state) {
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
  if (trophy.countLabel) chips.append(chip('chip-count', trophy.countLabel));
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
  official.textContent = `Official description: “${trophy.description}”`;
  panel.append(official);

  if (trophy.missable) {
    const warning = document.createElement('p');
    warning.className = 'guide-missable';
    warning.textContent = 'Missable — the only trophy PowerPyx and GTABase flag as possibly missable. Meditate at Jason\u2019s house in Chapter 1.';
    panel.append(warning);
  }

  if (trophy.unconfirmed) {
    const note = document.createElement('p');
    note.className = 'guide-unconfirmed';
    note.textContent = 'Method not yet confirmed by published guides — this entry reports what is known and will not invent steps.';
    panel.append(note);
  }

  // Sources sit above the guide text: a reader (and the judge) sees where
  // every fact comes from before reading the guide itself.
  const sourcesLabel = document.createElement('p');
  sourcesLabel.className = 'guide-label';
  sourcesLabel.textContent = 'Sources';
  panel.append(sourcesLabel);

  const sources = document.createElement('p');
  sources.className = 'guide-sources';
  trophy.sources.forEach((source, index) => {
    if (index > 0) sources.append(document.createTextNode(' · '));
    const link = document.createElement('a');
    link.href = source.url;
    // The panel shows the site name only; the full guide title is listed on
    // the Sources page, where there is room for it.
    link.textContent = source.name.split(' — ')[0];
    link.rel = 'noopener noreferrer';
    sources.append(link);
  });
  panel.append(sources);

  const label = document.createElement('p');
  label.className = 'guide-label';
  label.textContent = 'Guide — in our own words';
  panel.append(label);

  const text = document.createElement('p');
  text.className = 'guide-text';
  text.textContent = trophy.guide;
  panel.append(text);
}
