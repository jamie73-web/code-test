'use client'

import { useReducer, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { validateField, validate } from '@/lib/validation'
import type { RegistrationData, FieldErrors, ApiResult } from '@/types'

type FormState = {
  fields: RegistrationData
  errors: FieldErrors
}

type FormAction =
  | { type: 'SET_FIELD'; name: keyof RegistrationData; value: string }
  | { type: 'SET_ERRORS'; errors: FieldErrors }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'RESET' }

const initialFields: RegistrationData = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  reason: '',
}

const initialState: FormState = {
  fields: initialFields,
  errors: {},
}

function reducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        fields: { ...state.fields, [action.name]: action.value },
      }
    case 'SET_ERRORS':
      return { ...state, errors: { ...state.errors, ...action.errors } }
    case 'CLEAR_ERRORS':
      return { ...state, errors: {} }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

async function submitRegistration(data: RegistrationData): Promise<ApiResult> {
  const response = await fetch('/api/registrations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}

export function useRegistrationForm() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const mutation = useMutation<ApiResult, Error, RegistrationData>({
    mutationFn: submitRegistration,
    onSuccess: (result) => {
      if (!result.ok) {
        dispatch({ type: 'SET_ERRORS', errors: result.errors })
      }
    },
  })

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as keyof RegistrationData
    dispatch({ type: 'SET_FIELD', name, value: e.target.value })
  }, [])

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as keyof RegistrationData
    const error = validateField(name, e.target.value)
    dispatch({ type: 'SET_ERRORS', errors: { [name]: error } })
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch({ type: 'CLEAR_ERRORS' })

    const result = validate(state.fields)
    if (!result.success) {
      dispatch({ type: 'SET_ERRORS', errors: result.errors })
      const firstErrorField = Object.keys(result.errors)[0]
      if (firstErrorField) {
        const el = document.querySelector<HTMLElement>(`[name="${firstErrorField}"]`)
        el?.focus()
      }
      return
    }

    mutation.mutate(state.fields)
  }

  const submittedData = mutation.data?.ok ? mutation.data.registration : null

  return {
    fields: state.fields,
    errors: state.errors,
    isPending: mutation.isPending,
    isSuccess: mutation.data?.ok === true,
    submittedData,
    handleChange,
    handleBlur,
    handleSubmit,
  }
}
