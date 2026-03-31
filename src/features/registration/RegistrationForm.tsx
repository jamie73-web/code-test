'use client'

import { useRef, useEffect } from 'react'
import { useRegistrationForm } from './useRegistrationForm'
import { FormRow } from '@/components/FormRow'
import { ActionButton } from '@/components/ActionButton'
import { StatusMessage } from '@/components/StatusMessage'
import styles from './RegistrationForm.module.css'

export function RegistrationForm() {
  const successRef = useRef<HTMLDivElement>(null)
  const { fields, errors, isPending, isSuccess, submittedData, handleChange, handleBlur, handleSubmit } = useRegistrationForm()

  useEffect(() => {
    if (isSuccess && successRef.current) {
      successRef.current.focus()
    }
  }, [isSuccess])

  if (isSuccess && submittedData) {
    return (
      <StatusMessage variant="success" ref={successRef}>
        <h2>Registration submitted</h2>
        <p>Thank you, {submittedData.firstName}. We have received your registration.</p>
      </StatusMessage>
    )
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Patient registration" noValidate className={styles.form}>
      <FormRow label="First name" name="firstName" value={fields.firstName} error={errors.firstName} onChange={handleChange} onBlur={handleBlur} />
      <FormRow label="Last name" name="lastName" value={fields.lastName} error={errors.lastName} onChange={handleChange} onBlur={handleBlur} />
      <FormRow label="Date of birth" name="dateOfBirth" type="date" value={fields.dateOfBirth} error={errors.dateOfBirth} onChange={handleChange} onBlur={handleBlur} />
      <FormRow label="Reason for visit" name="reason" type="textarea" value={fields.reason} error={errors.reason} onChange={handleChange} onBlur={handleBlur} />
      <ActionButton pending={isPending} pendingText="Registering…">Register</ActionButton>
    </form>
  )
}
