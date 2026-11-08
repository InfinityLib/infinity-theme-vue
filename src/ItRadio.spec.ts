import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import ItRadio from './ItRadio.vue'

type RadioProps = {
  id?: string
  name?: string
  value: string
  label?: string
  disabled?: boolean
  modelValue?: string
}

function mountRadio(props: Omit<RadioProps, 'value'> & Partial<RadioProps>) {
  return mount(ItRadio, { props: { name: 'group', value: 'group-a', ...props } })
}

describe('ItRadio', () => {
  test('renders a label it-check wrapper around a native it-radio input', () => {
    const wrapper = mountRadio({ value: 'a' })

    const label = wrapper.get('label')
    expect(label.classes()).toContain('it-check')

    const input = label.get('input[type="radio"]')
    expect(input.classes()).toContain('it-radio')
  })

  test('passes the shared name prop through', () => {
    const first = mountRadio({ name: 'plan', value: 'free' })
    const second = mountRadio({ name: 'plan', value: 'pro' })

    expect(first.get('input').attributes('name')).toBe('plan')
    expect(second.get('input').attributes('name')).toBe('plan')
  })

  test('checks the radio whose value matches the model', () => {
    const selected = mountRadio({ name: 'plan', value: 'pro', modelValue: 'pro' })
    const other = mountRadio({ name: 'plan', value: 'free', modelValue: 'pro' })

    expect(selected.get('input').element.checked).toBe(true)
    expect(other.get('input').element.checked).toBe(false)
  })

  test('emits update:modelValue with the option value when selected', async () => {
    const wrapper = mountRadio({ name: 'plan', value: 'pro', modelValue: 'free' })

    await wrapper.get('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')).toEqual([['pro']])
  })

  test('passes a provided id through to the input', () => {
    const wrapper = mountRadio({ id: 'plan-pro', value: 'pro' })

    expect(wrapper.get('input').attributes('id')).toBe('plan-pro')
  })

  test('generates a stable id used by both the label for attribute and the input', () => {
    const wrapper = mountRadio({ value: 'pro' })

    const inputId = wrapper.get('input').attributes('id')
    expect(inputId).toBeTruthy()

    const forAttribute = wrapper.get('label').attributes('for')
    expect(forAttribute).toBe(inputId)
  })

  test('renders the label prop as a span when provided and no span otherwise', () => {
    const withLabel = mountRadio({ value: 'pro', label: 'Pro plan' })
    const withoutLabel = mountRadio({ value: 'pro' })

    const span = withLabel.get('label').find('span')
    expect(span.exists()).toBe(true)
    expect(span.text()).toBe('Pro plan')

    expect(withoutLabel.get('label').find('span').exists()).toBe(false)
  })

  test('disabled passes through to the input', () => {
    const enabled = mountRadio({ value: 'pro' })
    const disabled = mountRadio({ value: 'pro', disabled: true })

    expect(enabled.get('input').attributes('disabled')).toBeUndefined()
    expect(disabled.get('input').attributes('disabled')).toBeDefined()
  })
})
