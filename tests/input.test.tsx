import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Input from '../components/Input/Input'

vi.mock('next/link', () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}))
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}))

describe('Input', () => {
  describe('rendering', () => {
    it('renders an input element', () => {
      render(<Input aria-label="Name" />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('applies the base input class', () => {
      render(<Input aria-label="Name" />)
      expect(screen.getByRole('textbox').className).toContain('input')
    })

    it('passes through standard input attributes', () => {
      render(<Input aria-label="Email" type="email" placeholder="Enter email" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('placeholder', 'Enter email')
    })
  })

  describe('error state', () => {
    it('applies error class when error is true', () => {
      render(<Input aria-label="Name" error />)
      expect(screen.getByRole('textbox').className).toContain('inputError')
    })

    it('does not apply error class when error is false', () => {
      render(<Input aria-label="Name" />)
      expect(screen.getByRole('textbox').className).not.toContain('inputError')
    })

    it('sets aria-invalid when error is true', () => {
      render(<Input aria-label="Name" error />)
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    })

    it('does not set aria-invalid when error is not provided', () => {
      render(<Input aria-label="Name" />)
      expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
    })
  })

  describe('aria-describedby', () => {
    it('sets aria-describedby when provided', () => {
      render(<Input aria-label="Name" aria-describedby="name-error" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'name-error')
    })

    it('does not set aria-describedby when not provided', () => {
      render(<Input aria-label="Name" />)
      expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby')
    })
  })

  describe('fullWidth', () => {
    it('applies fullWidth class when fullWidth is true', () => {
      render(<Input aria-label="Name" fullWidth />)
      expect(screen.getByRole('textbox').className).toContain('inputFullWidth')
    })

    it('does not apply fullWidth class when not specified', () => {
      render(<Input aria-label="Name" />)
      expect(screen.getByRole('textbox').className).not.toContain('inputFullWidth')
    })
  })

  describe('ref forwarding', () => {
    it('forwards ref to the input element', () => {
      const ref = createRef<HTMLInputElement>()
      render(<Input ref={ref} aria-label="Name" />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
      expect(ref.current).toBe(screen.getByRole('textbox'))
    })
  })

  describe('displayName', () => {
    it('has displayName set to "Input"', () => {
      expect(Input.displayName).toBe('Input')
    })
  })

  describe('user interaction', () => {
    it('accepts typed input', async () => {
      const user = userEvent.setup()
      render(<Input aria-label="Name" />)
      const input = screen.getByRole('textbox')
      await user.type(input, 'Hello')
      expect(input).toHaveValue('Hello')
    })

    it('calls onChange when value changes', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(<Input aria-label="Name" onChange={handleChange} />)
      await user.type(screen.getByRole('textbox'), 'A')
      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe('custom className', () => {
    it('merges custom className with internal classes', () => {
      render(<Input aria-label="Name" className="custom" />)
      const input = screen.getByRole('textbox')
      expect(input.className).toContain('input')
      expect(input.className).toContain('custom')
    })
  })
})
