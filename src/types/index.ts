export interface RegistrationData {
  firstName: string
  lastName: string
  dateOfBirth: string
  reason: string
}

export type FieldErrors = Partial<Record<keyof RegistrationData, string>>

export type ApiResult =
  | { ok: true; registration: RegistrationData }
  | { ok: false; errors: FieldErrors }
