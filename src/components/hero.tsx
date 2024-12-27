"use client"

import { Suspense, useState } from 'react'
import { Button } from "./ui/button"
import Link from "next/link"
import { MotionDiv } from "./motion"
import { useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { useEffect } from "react"
import { Github, Linkedin, Mail, ChevronDown } from 'lucide-react'
import { TypewriterEffect } from "@/components/typewriter-effect"

function HeroContent() {
  const [isHovered, setIsHovered] = useState(false)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 100], [1, 0])
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { damping: 25, stiffness: 700 }
  const moveX = useSpring(mouseX, springConfig)
  const moveY = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      mouseX.set((clientX - centerX) / 20)
      mouseY.set((clientY - centerY) / 20)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div className="w-full">
      <MotionDiv
        className="flex flex-col items-center justify-center min-h-[90vh] text-center space-y-8 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background particles */}
        <MotionDiv
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1 }}
        >
          {[...Array(50)].map((_, i) => (
            <MotionDiv
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </MotionDiv>

        {/* Interactive gradient background */}
        <MotionDiv
          className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20"
          style={{
            x: moveX,
            y: moveY,
          }}
        />

        {/* Main content container */}
        <div className="relative z-10 px-4 w-full max-w-5xl mx-auto">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">
                Richard Kirkham
              </span>
            </h1>
            
            <MotionDiv
              className="mt-4 text-xl md:text-2xl text-muted-foreground"
              animate={isHovered ? { y: 5 } : { y: 0 }}
            >
              Full Stack Developer & Designer
            </MotionDiv>
          </MotionDiv>

          {/* Animated typing text */}
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <div className="text-xl text-muted-foreground flex items-center justify-center flex-wrap gap-2">
              <span>Crafting digital experiences with</span>
              <MotionDiv
                className="text-primary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <TypewriterEffect words={[
                  "passion",
                  "creativity",
                  "precision",
                  "innovation",
                  "dedication",
                  "excellence"
                ]} />
              </MotionDiv>
            </div>
          </MotionDiv>

          {/* CTA Buttons */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap gap-4 justify-center mt-12"
          >
            <MotionDiv
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-lg px-8 relative overflow-hidden group"
              >
                <Link href="/portfolio">
                  <span className="relative z-10">View My Work</span>
                  <MotionDiv
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                </Link>
              </Button>
            </MotionDiv>
            
            <MotionDiv
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="border-secondary hover:bg-secondary/10 text-lg px-8"
              >
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </MotionDiv>
          </MotionDiv>
        </div>

        {/* Scroll indicator */}
        <MotionDiv
          style={{ opacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <MotionDiv
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-muted-foreground cursor-pointer flex flex-col items-center"
            whileHover={{ scale: 1.2 }}
          >
            <span className="mb-2">Scroll to explore</span>
            <ChevronDown className="animate-bounce" />
          </MotionDiv>
        </MotionDiv>
      </MotionDiv>
    </div>
  )
}

export function Hero() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeroContent />
    </Suspense>
  )
}