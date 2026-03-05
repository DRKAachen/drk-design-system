import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Alert from '../components/Alert/Alert'

vi.mock('next/link', () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}))
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}))

describe('Alert', () => {
  describe('rendering', () => {
    it('renders children content', () => {
      render(<Alert>Something happened</Alert>)
      expect(screen.getByText('Something happened')).toBeInTheDocument()
    })

    it('renders optional title', () => {
      render(<Alert title="Heads up">Details here</Alert>)
      expect(screen.getByText('Heads up')).toBeInTheDocument()
      expect(screen.getByText('Details here')).toBeInTheDocument()
    })

    it('does not render title element when title is omitted', () => {
      const { container } = render(<Alert>No title</Alert>)
      expect(container.querySelector('.alert__title')).not.toBeInTheDocument()
    })
  })

  describe('variants', () => {
    it('applies info variant class by default', () => {
      const { container } = render(<Alert>Info</Alert>)
      const alert = container.firstElementChild!
      expect(alert.className).toContain('alert--info')
    })

    it('applies success variant class', () => {
      const { container } = render(<Alert variant="success">OK</Alert>)
      const alert = container.firstElementChild!
      expect(alert.className).toContain('alert--success')
    })

    it('applies error variant class', () => {
      const { container } = render(<Alert variant="error">Fail</Alert>)
      const alert = container.firstElementChild!
      expect(alert.className).toContain('alert--error')
    })

    it('applies warning variant class', () => {
      const { container } = render(<Alert variant="warning">Careful</Alert>)
      const alert = container.firstElementChild!
      expect(alert.className).toContain('alert--warning')
    })
  })

  describe('accessibility roles', () => {
    it('has role="alert" for error variant', () => {
      render(<Alert variant="error">Error msg</Alert>)
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('has role="status" for info variant (default)', () => {
      render(<Alert>Info msg</Alert>)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('has role="status" for success variant', () => {
      render(<Alert variant="success">Success</Alert>)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('has role="status" for warning variant', () => {
      render(<Alert variant="warning">Warning</Alert>)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('allows overriding the role prop', () => {
      render(
        <Alert variant="info" role="region">
          Custom role
        </Alert>
      )
      expect(screen.getByRole('region')).toBeInTheDocument()
    })
  })

  describe('aria-live', () => {
    it('uses aria-live="assertive" for error variant', () => {
      render(<Alert variant="error">Error</Alert>)
      expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive')
    })

    it('uses aria-live="polite" for non-error variants', () => {
      render(<Alert variant="success">OK</Alert>)
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
    })

    it('uses aria-live="polite" for info variant', () => {
      render(<Alert>Info</Alert>)
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
    })

    it('uses aria-live="polite" for warning variant', () => {
      render(<Alert variant="warning">Warning</Alert>)
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('dismiss callback', () => {
    it('does not render close button when onDismiss is not provided', () => {
      render(<Alert>Static</Alert>)
      expect(screen.queryByLabelText('Meldung schließen')).not.toBeInTheDocument()
    })

    it('renders close button when onDismiss is provided', () => {
      render(<Alert onDismiss={() => {}}>Dismissible</Alert>)
      expect(screen.getByLabelText('Meldung schließen')).toBeInTheDocument()
    })

    it('calls onDismiss when close button is clicked', async () => {
      const user = userEvent.setup()
      const handleDismiss = vi.fn()
      render(<Alert onDismiss={handleDismiss}>Dismiss me</Alert>)

      await user.click(screen.getByLabelText('Meldung schließen'))
      expect(handleDismiss).toHaveBeenCalledTimes(1)
    })

    it('close button has aria-label for accessibility', () => {
      render(<Alert onDismiss={() => {}}>Close me</Alert>)
      const button = screen.getByLabelText('Meldung schließen')
      expect(button).toHaveAttribute('type', 'button')
    })
  })

  describe('custom className', () => {
    it('merges custom className with alert classes', () => {
      const { container } = render(<Alert className="extra">Styled</Alert>)
      const alert = container.firstElementChild!
      expect(alert.className).toContain('alert')
      expect(alert.className).toContain('extra')
    })
  })
})
