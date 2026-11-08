import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import ItTextarea from './ItTextarea.vue'

type TextareaProps = {
  id?: string
  placeholder?: string
  describedby?: string
  invalid?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary'
  rows?: number
  modelValue?: string
}

function mountTextarea(props: TextareaProps = {}) {
  return mount(ItTextarea, { props })
}

describe('ItTextarea', () => {
  test('renders a native textarea with the default classes and four rows', () => {
    const wrapper = mountTextarea()

    expect(wrapper.element.tagName).toBe('TEXTAREA')
    expect(wrapper.classes()).toContain('it-textarea')
    expect(wrapper.classes()).toContain('it-textarea-md')
    expect(wrapper.classes()).not.toContain('it-textarea-sm')
    expect(wrapper.classes()).not.toContain('it-textarea-lg')
    expect(wrapper.attributes('rows')).toBe('4')
  })

  test.each(['sm', 'md', 'lg'])('applies the size class for %s', (size) => {
    const wrapper = mountTextarea({ size: size as TextareaProps['size'] })

    expect(wrapper.classes()).toContain(`it-textarea-${size}`)
  })

  test('the primary variant adds it-textarea-primary and it is absent by default', () => {
    const byDefault = mountTextarea()
    const primary = mountTextarea({ variant: 'primary' })

    expect(byDefault.classes()).not.toContain('it-textarea-primary')
    expect(primary.classes()).toContain('it-textarea-primary')
  })

  test('passes id and placeholder through', () => {
    const wrapper = mountTextarea({ id: 'bio-textarea', placeholder: 'Tell us about you' })

    expect(wrapper.attributes('id')).toBe('bio-textarea')
    expect(wrapper.attributes('placeholder')).toBe('Tell us about you')
  })

  test('describedby maps to aria-describedby', () => {
    const withDescribedBy = mountTextarea({ describedby: 'bio-hint' })
    const without = mountTextarea()

    expect(withDescribedBy.attributes('aria-describedby')).toBe('bio-hint')
    expect(without.attributes('aria-describedby')).toBeUndefined()
  })

  test('invalid adds it-textarea-invalid and aria-invalid, absent otherwise', () => {
    const valid = mountTextarea()
    const invalid = mountTextarea({ invalid: true })

    expect(valid.classes()).not.toContain('it-textarea-invalid')
    expect(valid.attributes('aria-invalid')).toBeUndefined()
    expect(invalid.classes()).toContain('it-textarea-invalid')
    expect(invalid.attributes('aria-invalid')).toBe('true')
  })

  test('disabled passes through', () => {
    const enabled = mountTextarea()
    const disabled = mountTextarea({ disabled: true })

    expect(enabled.attributes('disabled')).toBeUndefined()
    expect(disabled.attributes('disabled')).toBeDefined()
  })

  test('renders an incoming modelValue as the textarea value', () => {
    const wrapper = mountTextarea({ modelValue: 'existing note' })

    expect((wrapper.element as HTMLTextAreaElement).value).toBe('existing note')
  })

  test('emits update:modelValue while typing', async () => {
    const wrapper = mountTextarea()

    await wrapper.setValue('typed note')

    expect(wrapper.emitted('update:modelValue')).toEqual([['typed note']])
  })
})
