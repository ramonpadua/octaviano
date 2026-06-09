import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'

interface CustomCursorProps {
  isHolding: boolean
}

export const CustomCursor = ({ isHolding }: CustomCursorProps) => {
  const isMobile = useIsMobile()
  const outlineRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  // Position state for the smooth lerp
  const cursorPos = useRef({ x: 0, y: 0 }) // Current visual position
  const targetPos = useRef({ x: 0, y: 0 }) // Actual mouse position

  // Hide cursor initially until mouse moves
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isMobile) return

    const onMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY }

      // Update dot immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }

      if (!isVisible) setIsVisible(true)
    }

    window.addEventListener('mousemove', onMouseMove)

    // Animation loop for the lagging outline
    let rafId: number
    const animate = () => {
      // Linear interpolation (Lerp)
      const dx = targetPos.current.x - cursorPos.current.x
      const dy = targetPos.current.y - cursorPos.current.y

      cursorPos.current.x += dx * 0.15 // 0.15 factor for lag
      cursorPos.current.y += dy * 0.15

      if (outlineRef.current) {
        outlineRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px)`
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [isMobile, isVisible])

  if (isMobile) return null

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 z-[100] overflow-hidden',
        !isVisible && 'opacity-0',
      )}
    >
      {/* Outline */}
      <div
        ref={outlineRef}
        className={cn(
          'absolute left-0 top-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 transition-all duration-300 ease-out will-change-transform',
          isHolding && 'h-5 w-5 bg-white/10 border-white/50',
        )}
      />
      {/* Dot */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white will-change-transform"
      />
    </div>
  )
}
