import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import { withVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default withVueTs(
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**', '.ai/**', '.agents/**'],
  },
  js.configs.recommended,
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  pluginVueA11y.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    // An optional prop kept without a default is the contract: with the
    // exception of the boolean flags, absent means "do not render", and
    // the defaults live in the template bindings.
    files: ['src/**/*.vue'],
    rules: {
      'vue/require-default-prop': 'off',
    },
  },
  {
    // ItField binds label[for] to an htmlFor prop pointing at a control
    // rendered by the consumer through the default slot: the rule cannot
    // see the relation.
    files: ['src/ItField.vue'],
    rules: {
      'vuejs-accessibility/label-has-for': 'off',
    },
  },
  {
    files: ['src/**/*.spec.ts', '*.config.ts', 'eslint.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  prettier,
)
