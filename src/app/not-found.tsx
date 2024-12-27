import { Suspense } from 'react'
import Link from 'next/link'

function NotFoundContent() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-4">The page you're looking for doesn't exist.</p>
      <Link 
        href="/" 
        className="text-blue-500 hover:text-blue-700 underline"
      >
        Return to Home
      </Link>
    </div>
  )
}

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  )
} 