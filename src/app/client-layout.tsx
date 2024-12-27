"use client"

import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Navigation } from "@/components/navigation"
import "./globals.css"

// Wrapper component to handle client-side navigation
function NavigationWrapper() {
  return (
    <Suspense fallback={<div className="h-14 bg-background/95 backdrop-blur" />}>
      <Navigation />
    </Suspense>
  )
}

// Wrapper component to handle client-side content
function ContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NavigationWrapper />
      <ContentWrapper>
        {children}
      </ContentWrapper>
      <Toaster />
    </ThemeProvider>
  )
}
