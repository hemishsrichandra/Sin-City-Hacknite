// AuthModal is deprecated — authentication is now handled globally by
// FirebaseAuthGate (enforced in App.tsx via onAuthStateChanged).
// This stub is kept to satisfy any stale imports during the build.
// It renders nothing.

export default function AuthModal(_props: { open?: boolean; onClose?: () => void }) {
  return null
}
