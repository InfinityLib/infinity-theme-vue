import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import ItOption from './ItOption.vue'

type OptionProps = {
  value: string
  text: string
}

function mountOption(props: OptionProps) {
  return mount(ItOption, { props })
}

describe('ItOption', () => {
  test('renders a native option with the given value and text', () => {
    const wrapper = mountOption({ value: 'alpha', text: 'Alpha choice' })

    expect(wrapper.element.tagName).toBe('OPTION')
    expect(wrapper.attributes('value')).toBe('alpha')
    expect(wrapper.text()).toBe('Alpha choice')
    expect((wrapper.element as HTMLOptionElement).value).toBe('alpha')
  })

  test('keeps a numeric-style value as the given value attribute', () => {
    const wrapper = mountOption({ value: '42', text: 'Version 42' })

    expect(wrapper.attributes('value')).toBe('42')
    expect(wrapper.text()).toBe('Version 42')
    expect((wrapper.element as HTMLOptionElement).value).toBe('42')
  })
})
