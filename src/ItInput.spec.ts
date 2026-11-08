import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import ItInput from './ItInput.vue'

type InputProps = {
  id?: string
  name?: string
  placeholder?: string
  autocomplete?: string
  describedby?: string
  invalid?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary'
  modelValue?: string | number
}

function mountInput(props: InputProps = {}) {
  return mount(ItInput, { props })
}

describe('ItInput', () => {
  test('renders a native text input with the default classes', () => {
    const wrapper = mountInput()

    expect(wrapper.element.tagName).toBe('INPUT')
    expect(wrapper.attributes('type')).toBe('text')
    expect(wrapper.classes()).toContain('it-input')
    expect(wrapper.classes()).toContain('it-input-md')
    expect(wrapper.classes()).not.toContain('it-input-sm')
    expect(wrapper.classes()).not.toContain('it-input-lg')
  })

  test.each(['sm', 'md', 'lg'])('applies the size class for %s', (size) => {
    const wrapper = mountInput({ size: size as InputProps['size'] })

    expect(wrapper.classes()).toContain(`it-input-${size}`)
  })

  test('the primary variant adds it-input-primary and it is absent by default', () => {
    const byDefault = mountInput()
    const primary = mountInput({ variant: 'primary' })

    expect(byDefault.classes()).not.toContain('it-input-primary')
    expect(primary.classes()).toContain('it-input-primary')
  })

  test('passes id, name, placeholder and autocomplete through', () => {
    const wrapper = mountInput({
      id: 'email-input',
      name: 'email',
      placeholder: 'you@example.com',
      autocomplete: 'email',
    })

    expect(wrapper.attributes('id')).toBe('email-input')
    expect(wrapper.attributes('name')).toBe('email')
    expect(wrapper.attributes('placeholder')).toBe('you@example.com')
    expect(wrapper.attributes('autocomplete')).toBe('email')
  })

  test('describedby maps to aria-describedby', () => {
    const withDescribedBy = mountInput({ describedby: 'email-hint' })
    const without = mountInput()

    expect(withDescribedBy.attributes('aria-describedby')).toBe('email-hint')
    expect(without.attributes('aria-describedby')).toBeUndefined()
  })

  test('invalid adds it-input-invalid and aria-invalid, absent otherwise', () => {
    const valid = mountInput()
    const invalid = mountInput({ invalid: true })

    expect(valid.classes()).not.toContain('it-input-invalid')
    expect(valid.attributes('aria-invalid')).toBeUndefined()
    expect(invalid.classes()).toContain('it-input-invalid')
    expect(invalid.attributes('aria-invalid')).toBe('true')
  })

  test('disabled passes through', () => {
    const enabled = mountInput()
    const disabled = mountInput({ disabled: true })

    expect(enabled.attributes('disabled')).toBeUndefined()
    expect(disabled.attributes('disabled')).toBeDefined()
  })

  test('renders an incoming modelValue as the input value', () => {
    const text = mountInput({ modelValue: 'prefilled' })
    const number = mountInput({ modelValue: 42 })

    expect((text.element as HTMLInputElement).value).toBe('prefilled')
    expect((number.element as HTMLInputElement).value).toBe('42')
  })

  test('emits update:modelValue while typing', async () => {
    const wrapper = mountInput()

    await wrapper.setValue('typed value')

    expect(wrapper.emitted('update:modelValue')).toEqual([['typed value']])
  })

  test('emits update:modelValue on each keystroke', async () => {
    const wrapper = mountInput()

    await wrapper.setValue('a')
    await wrapper.setValue('ab')

    expect(wrapper.emitted('update:modelValue')).toEqual([['a'], ['ab']])
  })
})
