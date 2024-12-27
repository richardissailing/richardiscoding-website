"use client"

import { useInView } from "framer-motion"
import { useRef } from "react"
import { MotionDiv } from "./motion"

interface ScrollAnimationProps {
  children: React.ReactNode
  className?: string
}

export function ScrollAnimation({ children, className }: ScrollAnimationProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div ref={ref}>
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={className}
      >
        {children}
      </MotionDiv>
    </div>
  )
}
