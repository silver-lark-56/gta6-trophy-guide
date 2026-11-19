// Stage-order logic for the progress card: per-stage counts and "Next up".
// Kept tiny and loaded first, so the progress card works without waiting for
// the full roadmap page (roadmap.js loads later, only when the reader opens
// the Roadmap, Missables or Sources tab). Stages come from each trophy's own
// `stage` field, so this can never disagree with the roadmap page.
export function stageProgress(trophies, earned) {
  const stages = [];
  for (let n = 1; n <= 8; n += 1) {
    const inStage = trophies.filter((t) => t.stage === n);
    stages.push({
      n,
      total: inStage.length,
      done: inStage.filter((t) => earned.has(t.id)).length,
    });
  }
  return stages;
}

// The next trophy to chase: the first unearned trophy in stage order, except
// the platinum (id 1), which only becomes next once the other 54 are earned.
// The reason is the guide's first sentence — the one thing to do right now.
export function computeNextUpTrophy(trophies, earned) {
  const ordered = [...trophies].sort((a, b) => a.stage - b.stage || a.id - b.id);
  const rest = ordered.filter((t) => t.id !== 1 && !earned.has(t.id));
  if (rest.length === 0) {
    const platinum = ordered.find((t) => t.id === 1);
    return { trophy: platinum, reason: 'Earn the other 54 trophies and this one pops.' };
  }
  const next = rest[0];
  const firstSentence = next.guide.split(/(?<=[.!?])\s/)[0];
  return { trophy: next, reason: firstSentence };
}
