import { z } from 'zod'
import type { RegistrationData, FieldErrors } from '@/types'

export const registrationSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((val) => {
      const match = val.match(/^(\d{4})-(\d{2})-(\d{2})$/)
      if (!match) return false
      const [, yearStr, monthStr, dayStr] = match
      const y = Number(yearStr)
      const m = Number(monthStr)
      const d = Number(dayStr)
      const date = new Date(Date.UTC(y, m - 1, d))
      return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d
    }, 'Date of birth must be a valid date')
    .refine((val) => {
      const [yearStr, monthStr, dayStr] = val.split('-').map(Number)
      const date = new Date(Date.UTC(yearStr, monthStr - 1, dayStr))
      const now = new Date()
      const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
      return date < today
    }, 'Date of birth must be in the past'),
  reason: z.string().trim().min(1, 'Reason for visit is required').min(10, 'Reason must be at least 10 characters'),
})

export function validate(data: unknown): { success: true; data: RegistrationData } | { success: false; errors: FieldErrors } {
  const result = registrationSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  const errors: FieldErrors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof RegistrationData
    if (!errors[field]) {
      errors[field] = issue.message
    }
  }
  return { success: false, errors }
}

export function validateField(name: keyof RegistrationData, value: string): string | undefined {
  const schema = registrationSchema.shape[name]
  const result = schema.safeParse(value)
  if (result.success) return undefined
  return result.error.issues[0].message
}
