import styles from './ActionButton.module.css'

interface ActionButtonProps {
  pending: boolean
  children: React.ReactNode
  pendingText?: string
}

export function ActionButton({ pending, children, pendingText = 'Submitting…' }: ActionButtonProps) {
  return (
    <button type="submit" disabled={pending} className={styles.button}>
      {pending ? (
        <>
          <span className={styles.spinner} aria-hidden="true" />
          {pendingText}
        </>
      ) : children}
    </button>
  )
}
