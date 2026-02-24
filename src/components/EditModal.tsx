import { useEffect, useRef } from 'react'
import { ApplicationForm } from './ApplicationForm'
import type { JobApplication } from '../types'

type FormData = Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>

interface Props {
  app: JobApplication
  onSave: (data: FormData) => void
  onClose: () => void
}

export function EditModal({ app, onSave, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    dialog.showModal()
    // Sync React state when dialog is closed via Escape key
    const handleClose = () => onClose()
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [onClose])

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose()
  }

  function handleSave(data: FormData) {
    onSave(data)
    dialogRef.current?.close()
  }

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl rounded-lg p-0 shadow-xl backdrop:bg-black/50 open:flex open:flex-col"
      aria-label="Edit job application"
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 className="text-base font-semibold text-gray-900">Edit Application</h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ✕
        </button>
      </div>
      <div className="px-6 py-5">
        <ApplicationForm
          onSubmit={handleSave}
          initialData={app}
          onCancel={onClose}
        />
      </div>
    </dialog>
  )
}
