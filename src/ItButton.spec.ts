import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import ItButton from './ItButton.vue'

type Wrapper = ReturnType<typeof mount>

const VARIANTS = ['primary', 'secondary', 'ghost', 'danger', 'link'] as const
const SIZES = ['sm', 'md', 'lg'] as const

type ButtonProps = {
  variant?: (typeof VARIANTS)[number]
  size?: (typeof SIZES)[number]
  block?: boolean
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  disabled?: boolean
}

function mountButton(props: ButtonProps = {}, slot = 'Save changes') {
  return mount(ItButton, {
    props,
    slots: { default: slot },
  })
}

function isDisabled(wrapper: Wrapper): boolean {
  return wrapper.get('button').attributes('disabled') !== undefined
}

describe('ItButton', () => {
  test('renders a native button with the defaults: type button, primary, md', () => {
    const wrapper = mountButton()

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.get('button').attributes('type')).toBe('button')
    expect(wrapper.classes()).toContain('it-btn')
    expect(wrapper.classes()).toContain('it-btn-primary')
    expect(wrapper.classes()).toContain('it-btn-md')
  })

  test.each(VARIANTS)('applies the variant class for %s and no other variant', (variant) => {
    const wrapper = mountButton({ variant })

    expect(wrapper.classes()).toContain(`it-btn-${variant}`)
    for (const other of VARIANTS) {
      if (other !== variant) {
        expect(wrapper.classes(), `variant ${variant} vs ${other}`).not.toContain(`it-btn-${other}`)
      }
    }
  })

  test.each(SIZES)('applies the size class for %s and no other size', (size) => {
    const wrapper = mountButton({ size })

    expect(wrapper.classes()).toContain(`it-btn-${size}`)
    for (const other of SIZES) {
      if (other !== size) {
        expect(wrapper.classes(), `size ${size} vs ${other}`).not.toContain(`it-btn-${other}`)
      }
    }
  })

  test('does not apply the block class by default and only when block is true', () => {
    const byDefault = mountButton()
    const off = mountButton({ block: false })
    const on = mountButton({ block: true })

    expect(byDefault.classes()).not.toContain('it-btn-block')
    expect(off.classes()).not.toContain('it-btn-block')
    expect(on.classes()).toContain('it-btn-block')
  })

  test('passes the type prop through', () => {
    const wrapper = mountButton({ type: 'submit' })

    expect(wrapper.get('button').attributes('type')).toBe('submit')
  })

  test('is enabled and not busy by default', () => {
    const wrapper = mountButton()

    expect(isDisabled(wrapper)).toBe(false)
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
  })

  test('loading marks the button busy and disabled', () => {
    const wrapper = mountButton({ loading: true })

    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(isDisabled(wrapper)).toBe(true)
  })

  test('disabled disables the button', () => {
    const wrapper = mountButton({ disabled: true })

    expect(isDisabled(wrapper)).toBe(true)
  })

  test('renders the default slot inside the button', () => {
    const wrapper = mountButton({}, 'Confirm order')

    expect(wrapper.get('button').text()).toBe('Confirm order')
  })

  test('emits click with the mouse event when clicked', async () => {
    const wrapper = mountButton()

    await wrapper.get('button').trigger('click')

    const calls = wrapper.emitted('click') ?? []
    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual([expect.any(MouseEvent)])
  })
})
