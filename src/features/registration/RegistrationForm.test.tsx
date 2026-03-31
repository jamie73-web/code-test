import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RegistrationForm } from './RegistrationForm'

function renderForm() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <RegistrationForm />
    </QueryClientProvider>
  )
}

beforeEach(() => {
  global.fetch = jest.fn()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('RegistrationForm', () => {
  test('renders four labelled fields', () => {
    renderForm()
    expect(screen.getByLabelText('First name')).toBeInTheDocument()
    expect(screen.getByLabelText('Last name')).toBeInTheDocument()
    expect(screen.getByLabelText('Date of birth')).toBeInTheDocument()
    expect(screen.getByLabelText('Reason for visit')).toBeInTheDocument()
  })

  test('shows all errors on empty submit without calling API', async () => {
    renderForm()
    await userEvent.click(screen.getByRole('button', { name: 'Register' }))

    expect(await screen.findByText('First name is required')).toBeInTheDocument()
    expect(screen.getByText('Last name is required')).toBeInTheDocument()
    expect(screen.getByText('Date of birth is required')).toBeInTheDocument()
    expect(screen.getByText('Reason for visit is required')).toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  test('shows single field error on blur', async () => {
    renderForm()
    const input = screen.getByLabelText('First name')
    await userEvent.click(input)
    await userEvent.tab()

    expect(await screen.findByText('First name is required')).toBeInTheDocument()
  })

  test('keeps field values after failed validation', async () => {
    renderForm()
    await userEvent.type(screen.getByLabelText('First name'), 'James')
    await userEvent.click(screen.getByRole('button', { name: 'Register' }))

    expect(screen.getByLabelText('First name')).toHaveValue('James')
  })

  test('posts to API and shows confirmation on success', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ok: true,
        registration: {
          firstName: 'James',
          lastName: 'Whitfield',
          dateOfBirth: '1990-01-15',
          reason: 'Experiencing chest pain and shortness of breath',
        },
      }),
    })

    renderForm()
    await userEvent.type(screen.getByLabelText('First name'), 'James')
    await userEvent.type(screen.getByLabelText('Last name'), 'Whitfield')

    const dateInput = screen.getByLabelText('Date of birth')
    await userEvent.clear(dateInput)
    await userEvent.type(dateInput, '1990-01-15')

    await userEvent.type(screen.getByLabelText('Reason for visit'), 'Experiencing chest pain and shortness of breath')
    await userEvent.click(screen.getByRole('button', { name: 'Register' }))

    expect(await screen.findByText(/Thank you, James/)).toBeInTheDocument()
  })

  test('shows server errors when API returns 422', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ok: false,
        errors: { firstName: 'Server says name is invalid' },
      }),
    })

    renderForm()
    await userEvent.type(screen.getByLabelText('First name'), 'James')
    await userEvent.type(screen.getByLabelText('Last name'), 'Whitfield')

    const dateInput = screen.getByLabelText('Date of birth')
    await userEvent.clear(dateInput)
    await userEvent.type(dateInput, '1990-01-15')

    await userEvent.type(screen.getByLabelText('Reason for visit'), 'Experiencing chest pain and shortness of breath')
    await userEvent.click(screen.getByRole('button', { name: 'Register' }))

    expect(await screen.findByText('Server says name is invalid')).toBeInTheDocument()
  })
})
