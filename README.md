# Leonida Complete — GTA VI Trophy Guide & Tracker

[![gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/silver-lark-56/gta6-trophy-guide/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/silver-lark-56/gta6-trophy-guide/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft
Auto VI — an entry in the [gta6-trophy-guide-01 competition](https://make.fun/c/gta6-trophy-guide-01)
on make.fun.

## What it is

- **Tracker** — a checklist of all 55 trophies with their official names,
  descriptions and grades. Progress saves in the browser (localStorage) and
  can be exported to a file and imported back.
- **Filters** — by kind (story, missable, collectibles, activities, robbery,
  misc, platinum & 100%, online), by grade, by search text, earned-only and
  hidden-only. Every kind pill shows its count.
- **Spoiler setting** — hides the names and descriptions of story trophies
  until they are earned.
- **Guides in our own words** — every trophy has a guide written for this
  entry, each citing its sources by name and link beside the guide. A source
  is cited, never copied. Four trophies whose methods no published guide has
  confirmed yet are marked honestly as unconfirmed instead of guessed.
- **Roadmap to the platinum** — 8 stages built from the official descriptions
  (story chapters and missions, collectibles and counts, in order), a counts
  table comparing what each trophy needs vs what 100% needs, and the full
  35-item 100% checklist behind the gold “A Long Road”.
- **Missables** — the one possibly missable trophy (Positive Mental
  Attitude, Chapter 1 balcony meditation) flagged with its full detail, plus
  a watch list and a checked list of story windows with no trophy impact.
- **Sources & honesty** — what each cited guide covers, and what is not yet
  known on launch day.

## Offline

Static files under `app/`, no build step. Served by any static HTTP server
with `app/` at its root, `app/index.html` opens in desktop Chrome and works
with the network off: every file it loads is a file under `app/`, and it
makes no network request at run time. Source links open only when the reader
follows them.

## Run it

```sh
node serve.ts   # serves app/ on http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and
writes `dossier.json` with the vendored make.fun library.

## License

MIT — see `LICENSE`. An unofficial fan guide: no Rockstar Games logo,
artwork or game screenshots are used.
