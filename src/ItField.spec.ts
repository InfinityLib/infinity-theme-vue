import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { h } from 'vue'

import ItField from './ItField.vue'

type FieldProps = {
  label: string
  htmlFor?: string
  hint?: string
  error?: string
}

function normalize(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

function mountField(props: Pick<FieldProps, 'label'> & Partial<FieldProps> = { label: 'Email' }) {
  return mount(ItField, {
    props,
    slots: {
      default: () => h('input', { id: 'mounted-control', type: 'text' }),
    },
  })
}

function mountFieldWithHelp(props: Partial<FieldProps> = {}) {
  const wrapper = mount(ItField, {
    props: { label: 'Email', htmlFor: 'email-input', ...props },
    slots: {
      default: () => h('input', { id: 'email-input', type: 'text' }),
      help: () => h('span', { class: 'mounted-help' }, 'Optional help text'),
    },
  })
  return wrapper
}

function documentOrderFollows(first: Element, second: Element): boolean {
  return Boolean(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING)
}

describe('ItField', () => {
  test('renders a field wrapper with the it-field class', () => {
    const wrapper = mountField()

    expect(wrapper.classes()).toContain('it-field')
  })

  test('renders a label element with for and it-field-label when htmlFor is given', () => {
    const wrapper = mountField({ label: 'Email', htmlFor: 'email-input' })

    const labelNode = wrapper.get('label')
    expect(labelNode.classes()).toContain('it-field-label')
    expect(labelNode.attributes('for')).toBe('email-input')
    expect(labelNode.text()).toContain('Email')
  })

  test('renders a span with it-field-label and no label element without htmlFor', () => {
    const wrapper = mountField({ label: 'Email' })

    expect(wrapper.find('label').exists()).toBe(false)

    const labelNode = wrapper.get('span.it-field-label')
    expect(labelNode.classes()).toContain('it-field-label')
    expect(labelNode.text()).toContain('Email')
  })

  test('renders the control from the default slot', () => {
    const wrapper = mountField()

    const control = wrapper.find('input#mounted-control')
    expect(control.exists()).toBe(true)
    expect(control.attributes('type')).toBe('text')
  })

  test('renders the help slot inside the heading row, after the label', () => {
    const wrapper = mountFieldWithHelp()

    const heading = wrapper.get('.it-field-heading')
    expect(normalize(heading.text())).toContain('Optional help text')

    const labelEl = wrapper.get('.it-field-label').element
    const helpEl = wrapper.get('.mounted-help').element
    expect(heading.element.contains(helpEl)).toBe(true)
    expect(documentOrderFollows(labelEl, helpEl)).toBe(true)
  })

  test('renders the error as an alert paragraph with the htmlFor-based id', () => {
    const wrapper = mountField({ label: 'Email', htmlFor: 'email-input', error: 'Enter a valid email' })

    const alert = wrapper.get('[role="alert"]')
    expect(alert.element.tagName).toBe('P')
    expect(alert.classes()).toContain('it-field-error')
    expect(alert.attributes('id')).toBe('email-input-error')
    expect(alert.text()).toBe('Enter a valid email')
  })

  test('renders only the hint paragraph when no error is given', () => {
    const wrapper = mountField({ label: 'Email', htmlFor: 'email-input', hint: 'We never share it' })

    const hint = wrapper.get('p.it-field-hint')
    expect(hint.text()).toBe('We never share it')
    expect(hint.attributes('role')).toBeUndefined()
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })

  test('the error wins over the hint when both are given', () => {
    const wrapper = mountField({
      label: 'Email',
      htmlFor: 'email-input',
      hint: 'We never share it',
      error: 'Enter a valid email',
    })

    expect(wrapper.get('[role="alert"]').classes()).toContain('it-field-error')
    expect(wrapper.find('.it-field-hint').exists()).toBe(false)
    expect(wrapper.text()).toContain('Enter a valid email')
    expect(wrapper.text()).not.toContain('We never share it')
  })

  test('renders the error without an htmlFor-derived id when no htmlFor is given', () => {
    const wrapper = mountField({ label: 'Email', error: 'Enter a valid email' })

    const alert = wrapper.get('[role="alert"]')
    expect(alert.classes()).toContain('it-field-error')
    expect(alert.text()).toBe('Enter a valid email')
  })
})
