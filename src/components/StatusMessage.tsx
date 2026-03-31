import { forwardRef } from 'react'
import styles from './StatusMessage.module.css'

interface StatusMessageProps {
  variant: 'success' | 'error'
  children: React.ReactNode
}

export const StatusMessage = forwardRef<HTMLDivElement, StatusMessageProps>(
  function StatusMessage({ variant, children }, ref) {
    return (
      <div
        ref={ref}
        role={variant === 'error' ? 'alert' : 'status'}
        aria-live="polite"
        tabIndex={-1}
        className={`${styles.message} ${styles[variant]}`}
      >
        {children}
      </div>
    )
  }
)
