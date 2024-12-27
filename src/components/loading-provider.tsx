"use client"

import { Suspense, createContext, useContext, useState, useEffect } from "react"
import { AnimatePresence, MotionDiv } from "./motion"
import { LoadingSpinner } from "./loading-spinner"

// Context for loading state
const LoadingContext = createContext({ 
  isLoading: false,
  setIsLoading: (loading: boolean) => {}
})

// Hook to use loading state
export function useLoading() {
  return useContext(LoadingContext)
}

// Component to handle route changes
function RouteChangeHandler({ setIsLoading }: { setIsLoading: (loading: boolean) => void }) {
  const { usePathname, useSearchParams } = require('next/navigation')
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    setIsLoading(false)
  }, [pathname, searchParams, setIsLoading])

  return null
}

// Main loading overlay component
function LoadingOverlay({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur">
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LoadingSpinner />
        </MotionDiv>
      </div>
    </AnimatePresence>
  )
}

// Main provider component
export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <Suspense fallback={null}>
        <RouteChangeHandler setIsLoading={setIsLoading} />
      </Suspense>
      <LoadingOverlay isLoading={isLoading} />
      {children}
    </LoadingContext.Provider>
  )
}
