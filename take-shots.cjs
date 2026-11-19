// Screenshot helper for Leonida Complete (NOT part of the served app): renders
// the guide with headless Chromium over localhost and captures the four views
// shots.json describes. Demo progress is seeded into localStorage before the
// page loads, exactly as a returning reader's saved ticks would appear; the
// spoiler and kind states are set by clicking the app's own controls.
// Usage: node serve.ts (in another shell) && node take-shots.cjs
const { chromium } = require('/home/hatch/workspace/tools/pwshot/node_modules/playwright-core');
const fs = require('node:fs');
const path = require('node:path');

const REPO = __dirname;
const SHOTS = JSON.parse(fs.readFileSync(path.join(REPO, 'shots.json'), 'utf8'));
const BASE = 'http://localhost:8080';
const STORAGE_KEY = 'leonida-complete-progress-v1';

async function takeShot(browser, shot) {
  const page = await browser.newPage({ viewport: shot.viewport });
  page.on('pageerror', (err) => console.log('PAGEERROR', shot.file, String(err).slice(0, 300)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('CONSOLE', shot.file, msg.text().slice(0, 300));
  });
  await page.addInitScript(
    ({ key, earned, spoiler, counts }) => {
      localStorage.setItem(key, JSON.stringify({ version: 2, earned, spoiler: spoiler === true, counts: counts || {} }));
    },
    { key: STORAGE_KEY, earned: shot.earned || [], spoiler: shot.spoiler === true, counts: shot.counts || {} },
  );
  await page.goto(BASE + shot.path, { waitUntil: 'load' });
  if (shot.path.includes('#roadmap')) {
    await page.waitForSelector('#roadmap-stages .stage-card', { timeout: 15000 });
    await page.waitForSelector('#counts-grid .count-cell', { timeout: 15000 });
  } else if (shot.path.includes('#missables')) {
    await page.waitForSelector('#missable-hero h3', { timeout: 15000 });
  } else if (shot.path.includes('#sources')) {
    await page.waitForSelector('#sources-rows tr', { timeout: 15000 });
  } else {
    await page.waitForSelector('#trophy-list .trophy-row', { timeout: 15000 });
  }
  if (shot.kind) {
    const pill = page.locator('.pill', { hasText: shot.kind === 'missable' ? 'Missable' : shot.kind === 'story' ? 'Story' : shot.kind });
    await pill.first().click();
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(500);
  const outPath = path.join(REPO, 'screenshots', shot.file);
  await page.screenshot({ path: outPath, type: 'jpeg', quality: 82 });
  await page.close();
  console.log(shot.file, fs.statSync(outPath).size, 'bytes');
}

(async () => {
  const browser = await chromium.launch();
  for (const shot of SHOTS) await takeShot(browser, shot);
  await browser.close();
})().catch((err) => {
  console.error(String(err).slice(0, 800));
  process.exit(1);
});
