import { createContext, useContext, ReactNode } from 'react'
import PocketBase from 'pocketbase'
import pb from '@/lib/pocketbase/client'

const PocketBaseContext = createContext<PocketBase | undefined>(undefined)

export const usePocketBase = () => {
  const context = useContext(PocketBaseContext)
  if (!context) {
    throw new Error('usePocketBase must be used within a PocketBaseProvider')
  }
  return context
}

export const PocketBaseProvider = ({ children }: { children: ReactNode }) => {
  // Pass the singleton PocketBase instance down without blocking initial render.
  // Any network or authentication errors should be handled locally by the components.
  return (
    <PocketBaseContext.Provider value={pb}>
      {children}
    </PocketBaseContext.Provider>
  )
}
