import { validate } from './validation'

const validPayload = {
  firstName: 'James',
  lastName: 'Whitfield',
  dateOfBirth: '1990-01-15',
  reason: 'Experiencing chest pain and shortness of breath',
}

describe('registration validation', () => {
  test('valid payload passes', () => {
    const result = validate(validPayload)
    expect(result.success).toBe(true)
  })

  test('empty first name fails', () => {
    const result = validate({ ...validPayload, firstName: '' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.errors.firstName).toBe('First name is required')
  })

  test('future date of birth fails', () => {
    const result = validate({ ...validPayload, dateOfBirth: '2099-01-01' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.errors.dateOfBirth).toBe('Date of birth must be in the past')
  })

  test('invalid date format fails', () => {
    const result = validate({ ...validPayload, dateOfBirth: 'not-a-date' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.errors.dateOfBirth).toBe('Date of birth must be a valid date')
  })

  test('reason under 10 chars fails', () => {
    const result = validate({ ...validPayload, reason: 'Short' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.errors.reason).toBe('Reason must be at least 10 characters')
  })

  test('only invalid fields produce errors', () => {
    const result = validate({ ...validPayload, firstName: '', lastName: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.errors.firstName).toBeDefined()
      expect(result.errors.lastName).toBeDefined()
      expect(result.errors.dateOfBirth).toBeUndefined()
      expect(result.errors.reason).toBeUndefined()
    }
  })
})
