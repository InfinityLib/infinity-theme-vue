import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import ItCheckbox from './ItCheckbox.vue'

type CheckboxProps = {
  id?: string
  label?: string
  disabled?: boolean
  modelValue?: boolean
}

function mountCheckbox(props: CheckboxProps = {}) {
  return mount(ItCheckbox, { props })
}

describe('ItCheckbox', () => {
  test('renders a label it-check wrapper around a native it-checkbox input', () => {
    const wrapper = mountCheckbox()

    const label = wrapper.get('label')
    expect(label.classes()).toContain('it-check')

    const input = label.get('input[type="checkbox"]')
    expect(input.classes()).toContain('it-checkbox')
  })

  test('defaults the model to false', () => {
    const wrapper = mountCheckbox()

    expect(wrapper.get('input').element.checked).toBe(false)
  })

  test('renders the incoming modelValue as checked', () => {
    const wrapper = mountCheckbox({ modelValue: true })

    expect(wrapper.get('input').element.checked).toBe(true)
  })

  test('emits update:modelValue with true when checked', async () => {
    const wrapper = mountCheckbox({ modelValue: false })

    await wrapper.get('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  test('emits update:modelValue with false when unchecked', async () => {
    const wrapper = mountCheckbox({ modelValue: true })

    await wrapper.get('input').setValue(false)

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  test('passes a provided id through to the input', () => {
    const wrapper = mountCheckbox({ id: 'terms-box' })

    expect(wrapper.get('input').attributes('id')).toBe('terms-box')
  })

  test('generates a stable id used by both the label for attribute and the input', () => {
    const wrapper = mountCheckbox()

    const inputId = wrapper.get('input').attributes('id')
    expect(inputId).toBeTruthy()

    const forAttribute = wrapper.get('label').attributes('for')
    expect(forAttribute).toBe(inputId)
  })

  test('renders the label prop as a span when provided and no span otherwise', () => {
    const withLabel = mountCheckbox({ label: 'Accept the terms' })
    const withoutLabel = mountCheckbox()

    const span = withLabel.get('label').find('span')
    expect(span.exists()).toBe(true)
    expect(span.text()).toBe('Accept the terms')

    expect(withoutLabel.get('label').find('span').exists()).toBe(false)
  })

  test('disabled passes through to the input', () => {
    const enabled = mountCheckbox()
    const disabled = mountCheckbox({ disabled: true })

    expect(enabled.get('input').attributes('disabled')).toBeUndefined()
    expect(disabled.get('input').attributes('disabled')).toBeDefined()
  })
})
