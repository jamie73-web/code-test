import styles from './FormRow.module.css'

interface FormRowProps {
  label: string
  name: string
  type?: 'text' | 'date' | 'textarea'
  value: string
  error?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function FormRow({ label, name, type = 'text', value, error, onChange, onBlur }: FormRowProps) {
  const id = `field-${name}`
  const errorId = `${id}-error`
  const hasError = Boolean(error)

  const inputProps = {
    id,
    name,
    value,
    onChange,
    onBlur,
    'aria-describedby': hasError ? errorId : undefined,
    'aria-invalid': hasError ? (true as const) : undefined,
    className: `${styles.input} ${hasError ? styles.inputError : ''}`.trim(),
  }

  return (
    <div className={styles.row}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      {type === 'textarea' ? (
        <textarea {...inputProps} rows={4} />
      ) : (
        <input {...inputProps} type={type} />
      )}
      {hasError && (
        <span id={errorId} role="alert" className={styles.error}>{error}</span>
      )}
    </div>
  )
}
