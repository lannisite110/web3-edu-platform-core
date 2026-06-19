# Bazel workspace scaffold (v0.5 — incremental adoption)

This directory holds the future Bazel build graph for the monorepo integration
layer. v0.5 ships the scaffold only; Go/Python/Vite builds still use Make.

## Planned targets (v0.5.x)

- `//control-plane-go/...` — scheduler, container-manager, gateway
- `//ci:compliance` — compliance-check wrapper
- `//frontend-web:build` — Vite production bundle

## Status

- [ ] `MODULE.bazel` with `rules_go`, `rules_python`
- [ ] `BUILD.bazel` for control-plane binaries
- [ ] CI optional `bazel test //...`

Until then, use `make ci-gate` as the canonical gate.
