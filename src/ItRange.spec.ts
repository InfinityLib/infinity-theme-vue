import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import ItRange from './ItRange.vue'

type RangeProps = {
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  describedby?: string
  modelValue?: number
}

function mountRange(props: RangeProps = {}) {
  return mount(ItRange, { props: { modelValue: 50, ...props } })
}

describe('ItRange', () => {
  test('renders a native range input with the it-range class', () => {
    const wrapper = mountRange()

    expect(wrapper.element.tagName).toBe('INPUT')
    expect(wrapper.attributes('type')).toBe('range')
    expect(wrapper.classes()).toContain('it-range')
  })

  test('defaults min to 0, max to 100 and step to 1', () => {
    const wrapper = mountRange()

    expect(wrapper.attributes('min')).toBe('0')
    expect(wrapper.attributes('max')).toBe('100')
    expect(wrapper.attributes('step')).toBe('1')
  })

  test('passes min, max and step through', () => {
    const wrapper = mountRange({ min: 5, max: 25, step: 5 })

    expect(wrapper.attributes('min')).toBe('5')
    expect(wrapper.attributes('max')).toBe('25')
    expect(wrapper.attributes('step')).toBe('5')
  })

  test('renders the incoming modelValue as the input value', () => {
    const wrapper = mountRange({ modelValue: 75 })

    expect((wrapper.element as HTMLInputElement).value).toBe('75')
  })

  test('emits update:modelValue as a number when set through the DOM', async () => {
    const wrapper = mountRange({ modelValue: 50 })

    await wrapper.setValue(75)

    const calls = wrapper.emitted('update:modelValue') ?? []
    expect(calls).toHaveLength(1)
    expect(calls[0]).toHaveLength(1)
    const emitted = (calls[0] as unknown[])[0]
    expect(emitted).toBe(75)
    expect(typeof emitted).toBe('number')
  })

  test('disabled passes through', () => {
    const enabled = mountRange()
    const disabled = mountRange({ disabled: true })

    expect(enabled.attributes('disabled')).toBeUndefined()
    expect(disabled.attributes('disabled')).toBeDefined()
  })

  test('describedby maps to aria-describedby', () => {
    const withDescribedBy = mountRange({ describedby: 'volume-hint' })
    const without = mountRange()

    expect(withDescribedBy.attributes('aria-describedby')).toBe('volume-hint')
    expect(without.attributes('aria-describedby')).toBeUndefined()
  })
})
