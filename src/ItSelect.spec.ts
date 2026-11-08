import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { h } from 'vue'

import ItSelect from './ItSelect.vue'

type SelectProps = {
  id?: string
  describedby?: string
  invalid?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary'
  modelValue?: string
}

function options() {
  return [
    h('option', { value: 'alpha' }, 'Alpha'),
    h('option', { value: 'beta' }, 'Beta'),
    h('option', { value: 'gamma' }, 'Gamma'),
  ]
}

function mountSelect(props: SelectProps = {}) {
  return mount(ItSelect, {
    props,
    slots: { default: () => options() },
  })
}

describe('ItSelect', () => {
  test('renders a native select with the default classes and its slot', () => {
    const wrapper = mountSelect()

    expect(wrapper.element.tagName).toBe('SELECT')
    expect(wrapper.classes()).toContain('it-select')
    expect(wrapper.classes()).toContain('it-select-md')
    expect(wrapper.classes()).not.toContain('it-select-sm')
    expect(wrapper.classes()).not.toContain('it-select-lg')

    const rendered = wrapper.findAll('option')
    expect(rendered).toHaveLength(3)
    expect(rendered.map((option) => option.attributes('value'))).toEqual(['alpha', 'beta', 'gamma'])
  })

  test.each(['sm', 'md', 'lg'])('applies the size class for %s', (size) => {
    const wrapper = mountSelect({ size: size as SelectProps['size'] })

    expect(wrapper.classes()).toContain(`it-select-${size}`)
  })

  test('the primary variant adds it-select-primary and it is absent by default', () => {
    const byDefault = mountSelect()
    const primary = mountSelect({ variant: 'primary' })

    expect(byDefault.classes()).not.toContain('it-select-primary')
    expect(primary.classes()).toContain('it-select-primary')
  })

  test('passes id through', () => {
    const wrapper = mountSelect({ id: 'country-select' })

    expect(wrapper.attributes('id')).toBe('country-select')
  })

  test('describedby maps to aria-describedby', () => {
    const withDescribedBy = mountSelect({ describedby: 'country-hint' })
    const without = mountSelect()

    expect(withDescribedBy.attributes('aria-describedby')).toBe('country-hint')
    expect(without.attributes('aria-describedby')).toBeUndefined()
  })

  test('invalid adds it-select-invalid and aria-invalid, absent otherwise', () => {
    const valid = mountSelect()
    const invalid = mountSelect({ invalid: true })

    expect(valid.classes()).not.toContain('it-select-invalid')
    expect(valid.attributes('aria-invalid')).toBeUndefined()
    expect(invalid.classes()).toContain('it-select-invalid')
    expect(invalid.attributes('aria-invalid')).toBe('true')
  })

  test('disabled passes through', () => {
    const enabled = mountSelect()
    const disabled = mountSelect({ disabled: true })

    expect(enabled.attributes('disabled')).toBeUndefined()
    expect(disabled.attributes('disabled')).toBeDefined()
  })

  test('renders the incoming modelValue as the selected option', () => {
    const wrapper = mountSelect({ modelValue: 'beta' })

    expect((wrapper.element as HTMLSelectElement).value).toBe('beta')
  })

  test('emits update:modelValue with the chosen option value on change', async () => {
    const wrapper = mountSelect({ modelValue: 'alpha' })

    await wrapper.setValue('gamma')

    expect(wrapper.emitted('update:modelValue')).toEqual([['gamma']])
  })
})
