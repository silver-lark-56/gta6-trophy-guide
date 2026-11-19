// The roadmap to the platinum, the counts table, the 100% checklist, the
// missables page and the sources page — all built from the official
// descriptions and the cited guides, with honest flags where guides disagree.
export const ROADMAP_STAGES = [
  {
    n: 1,
    title: 'Story — Chapters 1–2',
    time: '≈25 h',
    text: 'Play Chapters 1–2 in order. The chapter and mission trophies pop automatically as you finish them — Gone Fishing first, then Paradise Lost, T**s Ass Drug Money and Trust. Do the Chapter 1 balcony meditation the morning after Down to Earth (see Missables) and keep a manual save at the start of each chapter: there is no mission replay.',
    ids: [2, 3, 4, 8],
  },
  {
    n: 2,
    title: 'Story — Chapters 3–4',
    time: '≈35 h',
    text: 'Chapters 3–4. Vice City, Baby! and Top Of The World, Ma for the chapters, plus Break the Bank (The Cartel Heist), Family Matters (Child\u2019s Play), DWNFALL (Headliners) and Hi-Jacked (VCIA Takedown). Character questlines open as you go — Andy in Chapter 3, Randy and Tyrone after their Chapter 3 missions.',
    ids: [5, 6, 9, 10, 11, 12],
  },
  {
    n: 3,
    title: 'Story — Chapter 5 + finale',
    time: '≈15 h',
    text: 'Chapter 5 and the finale: Snow Storm (Operation Savage Glory), then the gold You Gotta Know When to Get Off for the final mission. After the story, free-roam continues and everything left can be finished without a second playthrough.',
    ids: [7, 13],
  },
  {
    n: 4,
    title: 'Character finales & stranger strands',
    time: '≈15 h',
    text: 'Finish the character finales and stranger strands: Andy, Kenton, Billy, Randy, Tyrone and Bret, plus 8 Strangers & Freaks strands. All stay available after the story — Kenton returns between Chapters 2–3 after a short absence.',
    ids: [22, 23, 24, 25, 26, 27, 29],
  },
  {
    n: 5,
    title: 'Activities & challenges',
    time: '≈35 h',
    text: 'Activities and challenges: 250 stunts, 42 shooting-range golds, drone races at 14 locations, 20 different races won, Cal\u2019s fishing challenge, one arcade game finished, 50 challenges, and all 9 activity types tried once. Most of these feed the 100% checklist too.',
    ids: [15, 16, 17, 18, 19, 20, 21, 32],
  },
  {
    n: 6,
    title: 'Collectibles & 100%',
    time: '≈50 h',
    text: 'Collectibles and the 100% checklist: 18 meditations, 3 card sets, 100 WAiNK scans, 100 vehicles discovered, the full map unfogged — and the gold A Long Road for 100% completion. The checklist is lenient (about 60% true completion); only five requirement types need everything.',
    ids: [14, 28, 30, 31, 35, 42],
  },
  {
    n: 7,
    title: 'Crime — robberies & heat',
    time: '≈15 h',
    text: 'Crime: lose a 4-star wanted level with your partner, rob 3 shops back-to-back, 5 enemies in one Combat Focus, the VCIA plane, a Rhino tank, a jewelry store undetected, 5 bank vaults, an armored truck, one illegal operation per gang, and $250,000 in marked bills laundered.',
    ids: [33, 34, 36, 37, 38, 39, 40, 41, 43, 52],
  },
  {
    n: 8,
    title: 'Misc one-offs & the platinum',
    time: '≈10 h',
    text: 'The one-offs: strength maxed with both characters, 500 profile actions, garages, Scooter Bros registrations, spending — and the four trophies whose methods the guides have not confirmed yet. When the other 54 are earned, Vice Got a Price! pops.',
    ids: [1, 44, 45, 46, 47, 48, 49, 50, 51, 53, 54, 55],
  },
];

export const COUNTS_TABLE = [
  ['Stunts', '250', '300', '397 (130 jumps, 202 under-bridges, 40 knife flights, 25 base jumps)'],
  ['Shooting Range gold medals', '42', '42', '42 (12 range locations)'],
  ['Top Fun drone races', 'win at 14 locations', '42 time trials', '42 (14 locations × 3)'],
  ['Unique races won', '20 different', '30', '40'],
  ['Challenges', '50', '70', '80 (8 categories × 10)'],
  ['Meditations', '18', '15', '18 across 10 locations'],
  ['Collectible card sets', '3', '15', '18 sets, 480 cards'],
  ['WAiNK locations', '100', '100', '100+ (31 landmarks, 35 curiosities, 23 sculptures)'],
  ['Vehicles discovered', '100', '200 of 277 base models', '557 vehicles'],
  ['Gang operations', '1 per gang (9 gangs)', '39', '39'],
  ['Bank vaults', '5', '8', '8'],
  ['Marked bills laundered', '$250,000', '$250,000', '—'],
  ['Kenton treasure sets', '— (finale)', '5', '7'],
  ['Bret Target Decks', '— (one animal)', '15', '15'],
  ['Underwater discoveries', '—', '33', '33'],
  ['Animals studied', '—', '100', '255'],
  ['Video games', '1 finished', '4 started', '4'],
];

export const CHECKLIST_GROUPS = [
  {
    title: 'Story & Tasks — 12',
    items: ['Story complete', '100 optional tasks', '39/39 gang operations', '22/22 bank jobs', '7/7 payday loans', '34/35 Smash \u2019N\u2019 Grabs', '50/91 stick ups', '$100,000 narcotics fenced', '$100,000 jewelry fenced', '$250,000 marked bills', '8/8 bank vaults', '$200,000 vehicles fenced'],
  },
  {
    title: 'Exploration & Activities — 20',
    items: ['5/7 Kenton treasure sets', '15/18 card sets', '100 WAiNK scans', '33/33 underwater discoveries', '30/34 magazines, books & comics', '15/18 meditations', '100/125 Cocaine Flamingos', '2/2 unique playlists', '70/79 discovered styles', '30/40 races won', '10/13 race challenge golds', '42/42 shooting-range golds', '4/4 video games played', '5/7 pool opponents', '2/3 mini golf locations', '90/100 basketball hoops', '42/42 drone time trials', '300/397 stunts', '70/80 challenges', '15/15 Bret Target Decks'],
  },
  {
    title: 'Discovery — 3',
    items: ['200/277 base-model vehicles scanned', '50/66 standard weapons found', '100/255 animals studied'],
  },
];

export const MISSABLES_WATCH = [
  'Yago\u2019s street-racing strand (\u201cRace Against Yago\u201d, Chapter 3, hourglass icon) — OutputLag warns it is time-sensitive and should be done as soon as it appears. PowerPyx says hourglass quests that fail are not trophy-relevant. Single-source warning; do it early to be safe.',
  'Stranger mission chains behind five hidden trophies — one outlet (TechWiser, via egamers) warns of story windows. It conflicts with PowerPyx and GTABase, who say character questlines stay available after the story. Unconfirmed; not stated as fact.',
  'The Irredeemable criminal profile is permanent — avoid pushing toward it. It blocks no trophy, but it cannot be undone. (PowerPyx; GTABase)',
  'Which animal triggers Fair Game, and which stranger strands beyond Kirk, Kyle, Yago and Pilot Pete count toward Strangers & Freaks, are still being confirmed by the guides — both are tracked on the Sources page.',
];

export const MISSABLES_CHECKED = [
  'Optional missions can disappear as the story advances (black icons, pink letters), but 200–300+ optional tasks exist against a requirement of 100, so missing a few does not matter. (PowerPyx 100% guide)',
  'Kenton is briefly unavailable after Chapter 1 but returns between Chapters 2–3; all character questlines stay available after the story. (PowerPyx; GTABase)',
  'Some fences become permanently unavailable, with no trophy impact. (PowerPyx)',
  'Hourglass (timed) quests can fail, but PowerPyx says they are not trophy-relevant.',
  'Gang operations respawn, so a missed item can be collected on a later visit — though the respawn takes a long time. (PowerPyx; GTABase)',
  'Nothing on the 100% checklist is missable. (PowerPyx 100% guide; GTABase)',
];

export const SOURCES_COVERAGE = [
  ['PowerPyx — GTA 6 Trophy Guide & Roadmap', 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/', 'Method for 51 of 55 trophies; roadmap shape, ~200 h, difficulty 4/10, missable analysis.'],
  ['PowerPyx — GTA 6 100% Completion Checklist', 'https://www.powerpyx.com/gta-6-100-completion-checklist-guide/', 'The 35-item 100% checklist with every number; the counts table\u2019s backbone.'],
  ['GTABase — GTA 6 Trophies List', 'https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series', 'Second source for nearly every method; hidden/visible split; questline details.'],
  ['OutputLag — GTA 6 Trophy List', 'https://outputlag.com/guides/gta-6-trophy-list/', 'Third source for crime and activity methods; Yago time-sensitivity warning (single source).'],
  ['KeenGamer — GTA 6 Trophy Guide & Platinum Roadmap', 'https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/', 'Roadmap and 100% cross-check; chapter/mission mapping.'],
  ['GTA Zone — GTA 6 Trophy List', 'https://gta-zone.com/news/gta-6-trophies-achievements/', 'Hidden/visible split; meditation counts; missable consensus.'],
  ['planetgta6 — GTA 6 Trophies', 'https://www.planetgta6.com/en/gta-6-trophies/', 'Hidden/visible split (from Exophase, cross-checked vs PSNProfiles); day-1 missable caution.'],
  ['Sportskeeda — All Meditation Spots in GTA 6', 'https://hindi3.sportskeeda.com/gta/all-meditation-spots-gta-6-locations', 'Named meditation locations (partial — about 9 of the 10).'],
  ['HowToVideoGame — Meditation Spots', 'https://howtovideogame.com/gta-6-meditation-spots/', 'Named meditation locations; spot names.'],
  ['GTAVibes — GTA 6 100% Completion Checklist', 'https://www.gtavibes.com/guides/gta-6-100-completion-checklist', 'Card sets (18 sets, 480 cards); 100% cross-check.'],
  ['u7buy — GTA 6 Trophies Guide', 'https://www.u7buy.com/blog/gta-6-trophies/', 'Hidden/visible split; 500 profile actions for Actions Speak Louder.'],
  ['egamers.io — GTA 6 Trophy List', 'https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/', 'Hidden/visible split; final-mission chapter wording (Chapter 5).'],
];

export const SOURCES_UNKNOWN = [
  'In The Beginning… (id 44), Bad Luck, I Guess (id 49), The Truth Is Out There (id 50), Ten Pin (id 51) — no confirmed unlock method in any published guide yet. Their guides say so plainly instead of guessing.',
  'Capital Offense (id 45) — method reported by PowerPyx only; GTABase, KeenGamer and GTA Zone still list it as unconfirmed.',
  'Whether the Chapter 1 balcony meditation is strictly required for Positive Mental Attitude — unclear in every guide; do it anyway and keep a save.',
  'Which animal triggers Fair Game (id 29); which stranger strands beyond Kirk, Kyle, Yago and Pilot Pete count toward Strangers & Freaks (id 25).',
  'The final mission\u2019s chapter number (PowerPyx says Chapter 4 \u201cStarting From Zero\u201d, the same mission it names for Chapter 4 — likely a labelling slip; Beebom and CULTR say Chapter 5) and Tyrone\u2019s final quest name (PowerPyx \u201cSpin On This\u201d vs GTABase \u201cShut Down the Labs\u201d).',
  'The \u201c52 areas\u201d figure for The Goodtime State appears only in the starter kit\u2019s hint; no guide confirms it, so this guide does not state it.',
];

export function renderRoadmapStages(listEl, trophies, state) {
  listEl.replaceChildren();
  const byId = new Map(trophies.map((t) => [t.id, t]));
  for (const stage of ROADMAP_STAGES) {
    const earnedCount = stage.ids.filter((id) => state.earned.has(id)).length;
    const card = document.createElement('li');
    card.className = 'stage-card';
    const heading = document.createElement('h4');
    heading.textContent = `Stage ${stage.n} — ${stage.title}`;
    const meta = document.createElement('p');
    meta.className = 'stage-meta';
    meta.textContent = `${earnedCount} of ${stage.ids.length} earned in this stage · ${stage.time}`;
    const text = document.createElement('p');
    text.textContent = stage.text;
    const names = document.createElement('p');
    names.className = 'stage-trophies';
    const strong = document.createElement('strong');
    strong.textContent = 'Trophies: ';
    names.append(strong, stage.ids.map((id) => byId.get(id)?.name ?? '').join(', '));
    card.append(heading, meta, text, names);
    listEl.append(card);
  }
}

export function renderCountsTable(tbodyEl) {
  tbodyEl.replaceChildren();
  for (const [what, trophy, hundred, total] of COUNTS_TABLE) {
    const row = document.createElement('tr');
    for (const cell of [what, trophy, hundred, total]) {
      const td = document.createElement('td');
      td.textContent = cell;
      row.append(td);
    }
    tbodyEl.append(row);
  }
}

export function renderChecklistGroups(container) {
  container.replaceChildren();
  for (const group of CHECKLIST_GROUPS) {
    const card = document.createElement('div');
    card.className = 'checklist-group';
    const heading = document.createElement('h4');
    heading.textContent = group.title;
    const list = document.createElement('ul');
    for (const item of group.items) {
      const li = document.createElement('li');
      li.textContent = item;
      list.append(li);
    }
    card.append(heading, list);
    container.append(card);
  }
}

export function renderMissablesPage(heroEl, watchEl, checkedEl) {
  heroEl.replaceChildren();
  const heading = document.createElement('h3');
  heading.textContent = 'Possibly missable — 1 trophy';
  const flag = document.createElement('p');
  flag.textContent = 'Flagged by PowerPyx, GTABase, KeenGamer, OutputLag and GTA Zone alike. Everything else in the list is safe if you follow the roadmap.';
  const name = document.createElement('p');
  const strong = document.createElement('strong');
  strong.textContent = 'Positive Mental Attitude (bronze) — ';
  name.append(strong, 'Meditate at every spot across Leonida: 18 spots in 10 locations. In Chapter 1, the morning after the mission Down to Earth, talk to Lucia in the kitchen at Jason\u2019s house; she mentions meditating and walks to the balcony — follow her and choose Accept. That interaction is gone after Chapter 1 ends.');
  const caveat = document.createElement('p');
  caveat.textContent = 'Whether the balcony meditation is strictly required is still unclear: it adds +1 to the progress counter but is not marked as a Meditation Spot like the rest. PowerPyx\u2019s author earned the trophy having done it. Do it FIRST in Chapter 1, meditate at Jason\u2019s house, then clear the other spots as you unlock them — and keep a manual save from Chapter 1. It cannot cost A Long Road: the 100% checklist needs only 15 of the 18 meditations.';
  heroEl.append(heading, flag, name, caveat);

  watchEl.replaceChildren();
  for (const item of MISSABLES_WATCH) {
    const li = document.createElement('li');
    li.textContent = item;
    watchEl.append(li);
  }
  checkedEl.replaceChildren();
  for (const item of MISSABLES_CHECKED) {
    const li = document.createElement('li');
    li.textContent = item;
    checkedEl.append(li);
  }
}

export function renderSourcesPage(rowsEl, unknownEl) {
  rowsEl.replaceChildren();
  for (const [name, url, coverage] of SOURCES_COVERAGE) {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    const link = document.createElement('a');
    link.href = url;
    link.textContent = name;
    link.rel = 'noopener noreferrer';
    nameCell.append(link);
    const coverageCell = document.createElement('td');
    coverageCell.textContent = coverage;
    row.append(nameCell, coverageCell);
    rowsEl.append(row);
  }
  unknownEl.replaceChildren();
  for (const item of SOURCES_UNKNOWN) {
    const li = document.createElement('li');
    li.textContent = item;
    unknownEl.append(li);
  }
}
