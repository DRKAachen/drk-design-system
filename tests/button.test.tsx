import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Button from '../components/Button/Button'

vi.mock('next/link', () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}))
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}))

describe('Button', () => {
  describe('rendering', () => {
    it('renders a button element by default', () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole('button', { name: 'Click me' })
      expect(button).toBeInTheDocument()
      expect(button.tagName).toBe('BUTTON')
    })

    it('renders children text', () => {
      render(<Button>Save</Button>)
      expect(screen.getByText('Save')).toBeInTheDocument()
    })

    it('has type="button" by default', () => {
      render(<Button>Click</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
    })
  })

  describe('variants', () => {
    it('applies primary variant class by default', () => {
      render(<Button>Primary</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('button--primary')
    })

    it('applies secondary variant class', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('button--secondary')
    })

    it('applies outline variant class', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('button--outline')
    })
  })

  describe('sizes', () => {
    it('applies md size class by default', () => {
      render(<Button>Medium</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('button--md')
    })

    it('applies sm size class', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('button--sm')
    })

    it('applies lg size class', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('button--lg')
    })
  })

  describe('disabled state', () => {
    it('sets disabled attribute', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('sets aria-disabled when disabled', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })

    it('does not set disabled when not passed', () => {
      render(<Button>Enabled</Button>)
      const button = screen.getByRole('button')
      expect(button).not.toBeDisabled()
    })
  })

  describe('click handling', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click</Button>)
      await user.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(
        <Button disabled onClick={handleClick}>
          Click
        </Button>
      )
      await user.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('custom className', () => {
    it('merges custom className with internal classes', () => {
      render(<Button className="my-custom">Styled</Button>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('my-custom')
      expect(button.className).toContain('button')
    })
  })

  describe('asChild pattern', () => {
    it('renders child element instead of a button when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/home">Home</a>
        </Button>
      )
      const link = screen.getByRole('link', { name: 'Home' })
      expect(link).toBeInTheDocument()
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', '/home')
    })

    it('applies button classes to the child element', () => {
      render(
        <Button asChild variant="secondary" size="lg">
          <a href="/about">About</a>
        </Button>
      )
      const link = screen.getByRole('link')
      expect(link.className).toContain('button')
      expect(link.className).toContain('button--secondary')
      expect(link.className).toContain('button--lg')
    })

    it('merges child className with button classes', () => {
      render(
        <Button asChild>
          <a href="/" className="child-class">
            Go
          </a>
        </Button>
      )
      const link = screen.getByRole('link')
      expect(link.className).toContain('button')
      expect(link.className).toContain('child-class')
    })

    it('does not render a <button> element when asChild is true', () => {
      render(
        <Button asChild>
          <span>Custom</span>
        </Button>
      )
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })
})
