import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Modal from '../components/Modal/Modal'

vi.mock('next/link', () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}))
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}))
vi.mock('../lib/scroll-lock', () => ({
  lockBodyScroll: vi.fn(),
  unlockBodyScroll: vi.fn(),
}))

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  title: 'Test Modal',
}

describe('Modal', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('open/close', () => {
    it('renders nothing when open is false', () => {
      const { container } = render(
        <Modal open={false} onClose={vi.fn()} title="Hidden">
          <p>Content</p>
        </Modal>
      )
      expect(container.innerHTML).toBe('')
    })

    it('renders content when open is true', () => {
      render(
        <Modal {...defaultProps}>
          <p>Modal body</p>
        </Modal>
      )
      expect(screen.getByText('Modal body')).toBeInTheDocument()
    })

    it('renders the title', () => {
      render(
        <Modal {...defaultProps}>
          <p>Content</p>
        </Modal>
      )
      expect(screen.getByText('Test Modal')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has role="dialog"', () => {
      render(
        <Modal {...defaultProps}>
          <p>Content</p>
        </Modal>
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('has aria-modal="true"', () => {
      render(
        <Modal {...defaultProps}>
          <p>Content</p>
        </Modal>
      )
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
    })

    it('has aria-labelledby pointing to the title', () => {
      render(
        <Modal {...defaultProps}>
          <p>Content</p>
        </Modal>
      )
      const dialog = screen.getByRole('dialog')
      const labelledBy = dialog.getAttribute('aria-labelledby')
      expect(labelledBy).toBeTruthy()

      const heading = screen.getByText('Test Modal')
      expect(heading.id).toBe(labelledBy)
    })

    it('renders h2 heading for the title', () => {
      render(
        <Modal {...defaultProps}>
          <p>Content</p>
        </Modal>
      )
      const heading = screen.getByRole('heading', { level: 2, name: 'Test Modal' })
      expect(heading).toBeInTheDocument()
    })
  })

  describe('close button', () => {
    it('shows close button by default', () => {
      render(
        <Modal {...defaultProps}>
          <p>Content</p>
        </Modal>
      )
      expect(screen.getByLabelText('Schließen')).toBeInTheDocument()
    })

    it('hides close button when showCloseButton is false', () => {
      render(
        <Modal {...defaultProps} showCloseButton={false}>
          <p>Content</p>
        </Modal>
      )
      expect(screen.queryByLabelText('Schließen')).not.toBeInTheDocument()
    })

    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup()
      const onClose = vi.fn()
      render(
        <Modal open={true} onClose={onClose} title="Close test">
          <p>Content</p>
        </Modal>
      )
      await user.click(screen.getByLabelText('Schließen'))
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Escape key', () => {
    it('calls onClose when Escape is pressed', async () => {
      const user = userEvent.setup()
      const onClose = vi.fn()
      render(
        <Modal open={true} onClose={onClose} title="Escape test">
          <p>Content</p>
        </Modal>
      )
      await user.keyboard('{Escape}')
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('backdrop click', () => {
    it('calls onClose when backdrop is clicked', async () => {
      const user = userEvent.setup()
      const onClose = vi.fn()
      render(
        <Modal open={true} onClose={onClose} title="Backdrop test">
          <p>Content</p>
        </Modal>
      )
      const backdrop = screen.getByRole('dialog')
      await user.click(backdrop)
      expect(onClose).toHaveBeenCalled()
    })

    it('does not call onClose when modal content is clicked', async () => {
      const user = userEvent.setup()
      const onClose = vi.fn()
      render(
        <Modal open={true} onClose={onClose} title="Content click test">
          <p>Click inside</p>
        </Modal>
      )
      await user.click(screen.getByText('Click inside'))
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('focus management', () => {
    it('moves focus into the modal when opened', () => {
      render(
        <Modal {...defaultProps} showCloseButton={false}>
          <button>Inside</button>
        </Modal>
      )
      const insideButton = screen.getByRole('button', { name: 'Inside' })
      expect(document.activeElement).toBe(insideButton)
    })

    it('focuses the close button when it is the first focusable element', () => {
      render(
        <Modal {...defaultProps}>
          <p>No focusable children here</p>
        </Modal>
      )
      const closeButton = screen.getByLabelText('Schließen')
      expect(document.activeElement).toBe(closeButton)
    })
  })

  describe('scroll lock', () => {
    it('calls lockBodyScroll when opened', async () => {
      const { lockBodyScroll } = await import('../lib/scroll-lock')
      render(
        <Modal {...defaultProps}>
          <p>Content</p>
        </Modal>
      )
      expect(lockBodyScroll).toHaveBeenCalled()
    })

    it('calls unlockBodyScroll when closed', async () => {
      const { unlockBodyScroll } = await import('../lib/scroll-lock')
      const { rerender } = render(
        <Modal open={true} onClose={vi.fn()} title="Lock test">
          <p>Content</p>
        </Modal>
      )
      rerender(
        <Modal open={false} onClose={vi.fn()} title="Lock test">
          <p>Content</p>
        </Modal>
      )
      expect(unlockBodyScroll).toHaveBeenCalled()
    })
  })

  describe('custom className', () => {
    it('merges custom className on the modal container', () => {
      render(
        <Modal {...defaultProps} className="custom-modal">
          <p>Content</p>
        </Modal>
      )
      const dialog = screen.getByRole('dialog')
      const container = dialog.firstElementChild as HTMLElement
      expect(container.className).toContain('custom-modal')
    })
  })
})
