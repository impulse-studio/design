---
name: sync-digicomponents
description: Build and sync the Digitevent Vue component library into this repository, then regenerate its manifest, renderer registry, component types, and changelog. Use only when the user explicitly invokes this manual sync.
---

# Sync DigiComponents

Run this workflow only when the user invokes `$sync-digicomponents` or `/sync-digicomponents`.

The source checkout defaults to `../orchestration`. Do not pull, switch branches, commit, or push either repository as part of this sync.

1. Confirm the current directory is the `digitAiStudio` repository. If the default source checkout is missing, ask which orchestration checkout to use.
2. Inspect the source branch, latest commit, and `git status --short` for `lib/digicomponents` and `back/src`. If either source area has uncommitted changes, show the affected paths and stop unless the user asked to include them.
3. Run `pnpm sync:digicomponents`. If the user selected another source checkout, pass it with `pnpm run sync:digicomponents -- --orchestration <path>`. When the request is limited to Digi components, use `pnpm sync:digicomponents --components-only` so the configured backoffice shell files are left untouched. The command builds `digicomponents`, copies the built library, generates the React snapshots, and writes `manifest/manifest.json`, `manifest/CHANGELOG.md`, `renderer/src/registry.generated.ts`, and `src/generated/components.d.ts`. It preserves `manifest/ai-notes.yaml` so the user's component guidance survives future syncs.
4. Run `pnpm build:renderer`. If it fails, keep the generated files in the worktree and report the build output and changed files.
5. Review `git status --short` and `git diff --stat`. Report the source SHA, component count, generated files, and renderer build result. Leave all changes uncommitted and unpushed for the user to review.

Use `pnpm run sync:digicomponents -- --skip-build` only when the user explicitly asks to reuse the existing library build.
