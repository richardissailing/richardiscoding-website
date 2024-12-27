"use client"

import { MotionDiv } from "./motion"

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <MotionDiv
        className="h-12 w-12 rounded-full border-4 border-foreground/20 border-t-foreground"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  )
}
