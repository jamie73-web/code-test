/**
 * @jest-environment node
 */
import { POST } from './route'

describe('POST /api/registrations', () => {
  test('422 for missing fields', async () => {
    const request = new Request('http://localhost/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const response = await POST(request)
    expect(response.status).toBe(422)
    const data = await response.json()
    expect(data.ok).toBe(false)
    expect(data.errors.firstName).toBeDefined()
  })

  test('422 for future date of birth', async () => {
    const request = new Request('http://localhost/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'James',
        lastName: 'Whitfield',
        dateOfBirth: '2099-01-01',
        reason: 'Experiencing chest pain and shortness of breath',
      }),
    })
    const response = await POST(request)
    expect(response.status).toBe(422)
    const data = await response.json()
    expect(data.ok).toBe(false)
    expect(data.errors.dateOfBirth).toBe('Date of birth must be in the past')
  })

  test('200 for valid registration', async () => {
    const request = new Request('http://localhost/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'James',
        lastName: 'Whitfield',
        dateOfBirth: '1990-01-15',
        reason: 'Experiencing chest pain and shortness of breath',
      }),
    })
    const response = await POST(request)
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.ok).toBe(true)
    expect(data.registration.firstName).toBe('James')
  })
})
