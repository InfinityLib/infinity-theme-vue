# @infinitylib/infinity-theme-vue

Vue wrappers for the `it-*` classes of
[`@infinitylib/infinity-theme`](https://github.com/InfinityLib/infinity-theme):
props and `v-model` mapped to classes and attributes, and nothing else.
The wrappers contain no styles; the theme package provides them.

## Install

```sh
bun add @infinitylib/infinity-theme-vue @infinitylib/infinity-theme
```

The theme package is not a dependency of this one: the wrapper only emits
class names, and the application imports the stylesheet wherever it
configures its cascade (see the theme package README for the layer
contract and the brand layer).

## Usage

```ts
import { ItButton, ItField, ItInput } from '@infinitylib/infinity-theme-vue'
```

```vue
<ItField label="Email" html-for="email" hint="We never share it.">
  <ItInput id="email" v-model="email" type="email" />
</ItField>

<ItButton variant="primary" :disabled="!valid">Generate</ItButton>
```

## Components

| Component | Control | Notable props |
| --- | --- | --- |
| `ItButton` | button | `variant`, `size`, `block`, `loading`, `type` |
| `ItInput` | input | `type`, `size`, `variant`, `invalid`, `describedby` |
| `ItTextarea` | textarea | `rows`, `size`, `variant`, `invalid` |
| `ItSelect` | select | `size`, `variant`, `invalid`, options through the slot |
| `ItOption` | option | `value`, `text` |
| `ItCheckbox` | checkbox in a label | `id`, `label`, boolean `v-model` |
| `ItRadio` | radio in a label | `name`, `value`, `label`, string `v-model` |
| `ItRange` | range | `min`, `max`, `step`, number `v-model` |
| `ItField` | label, controls, hint and error slots | `label`, `htmlFor`, `error`, `hint` |

Invalid state adds the `it-*-invalid` class and `aria-invalid` on the
control; `ItField` gives the error paragraph a `role="alert"` and the
`<htmlFor>-error` id, ready to bind through `aria-describedby`.

## Releasing

Follows the theme package discipline: `npm pack --dry-run` before any
publish, every path the `exports` map points at must appear in the
tarball (`dist/index.js`, `dist/index.d.ts`), and a consumer's clean
install goes through CI before anything merges on it.

## License

MIT. See [LICENSE](./LICENSE).
