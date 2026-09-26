import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Provider as ReduxProvider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import keycloak from '../features/auth/keycloak'
import { store } from './store'

interface ProvidersProps {
  children: ReactNode
}

const queryClient = new QueryClient()

export function Providers({ children }: ProvidersProps) {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (keycloak.didInitialize) {
      setAuthenticated(!!keycloak.authenticated)
      setLoading(false)
      return
    }

    keycloak
      .init({
        onLoad: 'login-required',
        pkceMethod: 'S256',
      })
      .then((auth) => {
        setAuthenticated(auth)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Keycloak initialization failed:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!authenticated) {
    return <div>Authentication failed.</div>
  }

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ReduxProvider>
  )
}