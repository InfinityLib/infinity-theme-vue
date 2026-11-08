# ADR-0001 : Publish the vue wrappers as their own built package

- **Status** : `accepted`
- **Date** : 2026-11-07

## Validation

| Field        | Value |
|--------------|-------|
| Validated    | yes |
| Validated by | FortyTwo_Dev |
| Validated on | 2026-11-07 |

## Context

The theme extraction (ADR-0007 of infinity-qrcode) left the nine Vue
wrappers in the application repository, in `src/components/theme`. Their
surface has been stable through the whole tailwind removal: a wrapper maps
props and `v-model` to `it-*` classes and attributes and holds no style.
Other consumers of the theme need the same wrappers, and the application
still carries untested components, a known gap flagged since the extraction.

## Decision

- Publish the wrappers as `@infinitylib/infinity-theme-vue` in their own
  repository, one component per file, with a build: Vite library mode emits
  `dist/index.js` and `vue-tsc` emits the declarations. Unlike the CSS
  package, the SFC sources cannot ship as is: consumers need compiled
  modules and generated types.
- The package depends on `vue` as a peer only (`^3.5.0`, the version line
  that provides `useId` and `defineModel`).
- The theme package is not a dependency: the wrappers emit class names, and
  the consumer imports the stylesheet wherever it configures its cascade.
- Every wrapper ships with its spec next to it, pinning the public
  contract: defaults, variants and sizes, negative cases, passthrough
  attributes, and v-model through `modelValue` and `update:modelValue`.
- A wrapper holds no style and no micro-layout: when a component needs
  structure (the field heading row), the class joins the theme package
  (`it-field-heading` in its 0.2.0), never the wrapper and never the
  consumer.

## Consequences

- **Positive**: every future theme consumer gets tested wrappers; the
  application deletes its private copy and its (previously nonexistent)
  test debt around them; the two-artefact model maps to the reality of the
  toolchains (no-build CSS, built SFC).
- **Negative**: a wrapper release requires the build and the declaration
  emission to pass, one more gate than the CSS package.
- **Trade-offs**: the micro-layout classes live in the CSS package, so a
  wrapper change may require a coordinated release of both packages; the
  alternative (inline styles in wrappers) violates the no-styles contract.

## Rejected alternatives

- **Keep the wrappers in the application**: rejected; the same gap as the
  in-repo theme, and the test debt stays.
- **Ship the SFC sources without a build**: rejected; TypeScript consumers
  need generated declarations for `.vue` modules, which no source-only
  distribution provides cleanly.
- **One package with a `vue` subpath**: rejected during the extraction
  (ADR-0007): the buildless CSS package does not carry the SFC toolchain.
