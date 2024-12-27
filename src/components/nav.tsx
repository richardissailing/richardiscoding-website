"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { ThemeToggle } from './theme-toggle'
import { MobileNav } from './mobile-nav'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-6">
          <MobileNav />
          <Link href="/" className="font-bold">
            Richard Kirkham
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative transition-colors hover:text-foreground/80"
              >
                {pathname === item.href && (
                  <motion.span
                    layoutId="underline"
                    className="absolute left-0 top-full block h-px w-full bg-foreground"
                  />
                )}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
