import { SessionProvider, signIn, signOut, useSession } from '@hono/auth-js/react'
import { createRoot } from 'react-dom/client'

function App() {
  return (
    <SessionProvider>
      <SignInButton />
      <SignOutButton />
      <Session />
    </SessionProvider>
  )
}

function SignInButton() {
  return <button type="button" onClick={() => signIn('google')}>Sign in with Google</button>
}

function SignOutButton() {
  return <button type="button" onClick={() => signOut()}>Sign out</button>
}

function Session() {
  const { data: session, status } = useSession()
  return <div>I am {session?.user?.name || 'unknown'}</div>
}

const domNode = document.getElementById('root')
if (domNode) {
  const root = createRoot(domNode)
  root.render(<App />)
} else {
  console.error('Failed to find the root element')
}