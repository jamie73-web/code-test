import { NextResponse } from 'next/server'
import { validate } from '@/lib/validation'
import type { ApiResult } from '@/types'

export async function POST(request: Request): Promise<NextResponse<ApiResult>> {
  const raw = await request.json()
  const body = {
    firstName: raw.firstName ?? '',
    lastName: raw.lastName ?? '',
    dateOfBirth: raw.dateOfBirth ?? '',
    reason: raw.reason ?? '',
  }

  const result = validate(body)

  if (!result.success) {
    return NextResponse.json({ ok: false as const, errors: result.errors }, { status: 422 })
  }

  return NextResponse.json({ ok: true as const, registration: result.data })
}
