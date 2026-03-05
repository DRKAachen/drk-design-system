import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Select from '../components/Select/Select'

vi.mock('next/link', () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}))
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}))

const sampleOptions = [
  { value: 'de', label: 'Deutschland' },
  { value: 'at', label: 'Österreich' },
  { value: 'ch', label: 'Schweiz' },
]

describe('Select', () => {
  describe('rendering', () => {
    it('renders a select element', () => {
      render(<Select options={sampleOptions} aria-label="Country" />)
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('renders all provided options', () => {
      render(<Select options={sampleOptions} aria-label="Country" />)
      expect(screen.getByRole('option', { name: 'Deutschland' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Österreich' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Schweiz' })).toBeInTheDocument()
    })

    it('renders the correct number of options without placeholder', () => {
      render(<Select options={sampleOptions} aria-label="Country" />)
      expect(screen.getAllByRole('option')).toHaveLength(3)
    })
  })

  describe('placeholder', () => {
    it('renders placeholder option when provided', () => {
      render(<Select options={sampleOptions} placeholder="Bitte wählen" aria-label="Country" />)
      expect(screen.getByRole('option', { name: 'Bitte wählen' })).toBeInTheDocument()
      expect(screen.getAllByRole('option')).toHaveLength(4)
    })

    it('placeholder option is disabled by default', () => {
      render(<Select options={sampleOptions} placeholder="Bitte wählen" aria-label="Country" />)
      const placeholder = screen.getByRole('option', { name: 'Bitte wählen' })
      expect(placeholder).toBeDisabled()
    })

    it('placeholder option has empty string value', () => {
      render(<Select options={sampleOptions} placeholder="Bitte wählen" aria-label="Country" />)
      const placeholder = screen.getByRole('option', { name: 'Bitte wählen' }) as HTMLOptionElement
      expect(placeholder.value).toBe('')
    })

    it('does not render placeholder when not provided', () => {
      render(<Select options={sampleOptions} aria-label="Country" />)
      expect(screen.queryByRole('option', { name: 'Bitte wählen' })).not.toBeInTheDocument()
    })
  })

  describe('allowEmpty', () => {
    it('makes placeholder option selectable when allowEmpty is true', () => {
      render(
        <Select
          options={sampleOptions}
          placeholder="Bitte wählen"
          allowEmpty
          aria-label="Country"
        />
      )
      const placeholder = screen.getByRole('option', { name: 'Bitte wählen' })
      expect(placeholder).not.toBeDisabled()
    })

    it('placeholder remains disabled when allowEmpty is false (default)', () => {
      render(
        <Select
          options={sampleOptions}
          placeholder="Bitte wählen"
          allowEmpty={false}
          aria-label="Country"
        />
      )
      const placeholder = screen.getByRole('option', { name: 'Bitte wählen' })
      expect(placeholder).toBeDisabled()
    })
  })

  describe('error state', () => {
    it('applies error class when error is true', () => {
      render(<Select options={sampleOptions} error aria-label="Country" />)
      expect(screen.getByRole('combobox').className).toContain('selectError')
    })

    it('does not apply error class by default', () => {
      render(<Select options={sampleOptions} aria-label="Country" />)
      expect(screen.getByRole('combobox').className).not.toContain('selectError')
    })

    it('sets aria-invalid when error is true', () => {
      render(<Select options={sampleOptions} error aria-label="Country" />)
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
    })

    it('does not set aria-invalid when no error', () => {
      render(<Select options={sampleOptions} aria-label="Country" />)
      expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-invalid')
    })
  })

  describe('aria-describedby', () => {
    it('sets aria-describedby when provided', () => {
      render(
        <Select options={sampleOptions} aria-label="Country" aria-describedby="country-error" />
      )
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-describedby', 'country-error')
    })

    it('does not set aria-describedby when not provided', () => {
      render(<Select options={sampleOptions} aria-label="Country" />)
      expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-describedby')
    })
  })

  describe('fullWidth', () => {
    it('applies fullWidth class when fullWidth is true', () => {
      render(<Select options={sampleOptions} fullWidth aria-label="Country" />)
      expect(screen.getByRole('combobox').className).toContain('selectFullWidth')
    })

    it('does not apply fullWidth class by default', () => {
      render(<Select options={sampleOptions} aria-label="Country" />)
      expect(screen.getByRole('combobox').className).not.toContain('selectFullWidth')
    })
  })

  describe('disabled options', () => {
    it('renders disabled options correctly', () => {
      const optionsWithDisabled = [
        { value: 'de', label: 'Deutschland' },
        { value: 'at', label: 'Österreich', disabled: true },
      ]
      render(<Select options={optionsWithDisabled} aria-label="Country" />)
      expect(screen.getByRole('option', { name: 'Österreich' })).toBeDisabled()
      expect(screen.getByRole('option', { name: 'Deutschland' })).not.toBeDisabled()
    })
  })

  describe('ref forwarding', () => {
    it('forwards ref to the select element', () => {
      const ref = createRef<HTMLSelectElement>()
      render(<Select ref={ref} options={sampleOptions} aria-label="Country" />)
      expect(ref.current).toBeInstanceOf(HTMLSelectElement)
      expect(ref.current).toBe(screen.getByRole('combobox'))
    })
  })

  describe('displayName', () => {
    it('has displayName set to "Select"', () => {
      expect(Select.displayName).toBe('Select')
    })
  })

  describe('user interaction', () => {
    it('allows selecting an option', async () => {
      const user = userEvent.setup()
      render(<Select options={sampleOptions} aria-label="Country" />)
      const select = screen.getByRole('combobox')
      await user.selectOptions(select, 'at')
      expect(select).toHaveValue('at')
    })

    it('calls onChange when selection changes', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(<Select options={sampleOptions} aria-label="Country" onChange={handleChange} />)
      await user.selectOptions(screen.getByRole('combobox'), 'ch')
      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe('custom className', () => {
    it('merges custom className with internal classes', () => {
      render(<Select options={sampleOptions} className="extra" aria-label="Country" />)
      const select = screen.getByRole('combobox')
      expect(select.className).toContain('select')
      expect(select.className).toContain('extra')
    })
  })
})
