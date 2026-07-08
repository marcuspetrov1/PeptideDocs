import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog.jsx'

const STORAGE_KEY = 'disclaimer_accepted'

/**
 * One-time legal disclaimer dialog. Mounts in Layout; only appears on first
 * visit (or when localStorage is cleared). Cannot be dismissed with Escape —
 * user must click "I Understand and Agree".
 */
export default function LegalDisclaimer() {
  const [open, setOpen] = useState(() => !localStorage.getItem(STORAGE_KEY))

  function handleAccept() {
    localStorage.setItem(STORAGE_KEY, 'true')
    setOpen(false)
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="max-w-[520px]"
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Research Use Only</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-[14px] leading-[1.6]">
              <p>
                This website provides information on research peptides for
                <strong> educational and research purposes only</strong>. It does
                not constitute medical advice, diagnosis, or treatment.
              </p>
              <p>
                Research peptides are <strong>not approved for human use</strong>{' '}
                by any regulatory authority. Always consult a qualified healthcare
                professional before using any compound.
              </p>
              <p>Not for use by persons under 18 years of age.</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleAccept}>
            I Understand and Agree
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
