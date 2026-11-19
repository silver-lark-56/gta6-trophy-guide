// Leonida Complete — the entry program (Node 22, standard library only).
//
// It hands the guide in: it copies this repository's app/ and screenshots/
// beside it into the output directory and writes /output/dossier.json with
// the vendored make.fun library — the summary the judge reads (screenshots,
// first-load files and bytes, and the source). It runs twice in the grader
// and both runs must write the same bytes, so it does nothing time- or
// order-dependent: plain copies, then one deterministic dossier build.
//
// vendor/makefun-frontend.ts stays exactly as the kit shipped it: the
// scorer rebuilds the dossier with its own copy and compares byte for byte.
//
// Local run: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copyEntryFolder(name) {
  const from = join(repoRoot, name);
  const to = join(outputDir, name);
  mkdirSync(to, { recursive: true });
  if (existsSync(from)) cpSync(from, to, { recursive: true });
}

mkdirSync(outputDir, { recursive: true });
copyEntryFolder('app');
copyEntryFolder('screenshots');

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the rest refuse an entry the scorer would refuse — more than 4
// screenshots or one over 256 KiB, more than 993 files and directories in
// app/ or 48 MiB of app files.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
