import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface OrbButtonProps {
  onHoldStart: () => void
  onHoldEnd: () => void
  onSuccess: () => void
}

export const OrbButton = ({
  onHoldStart,
  onHoldEnd,
  onSuccess,
}: OrbButtonProps) => {
  const [isHolding, setIsHolding] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleStart = () => {
    setIsHolding(true)
    onHoldStart()

    timerRef.current = setTimeout(() => {
      onSuccess()
      setIsHolding(false) // Optionally keep holding state if needed
    }, 1500)
  }

  const handleEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setIsHolding(false)
    onHoldEnd()
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        className="group relative flex h-[60px] w-[60px] items-center justify-center outline-none"
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        aria-label="Hold to enter"
      >
        {/* Outer Ring */}
        <div
          className={cn(
            'absolute inset-0 rounded-full border border-[#c97d31]/20 transition-all duration-700 ease-out',
            'group-hover:scale-125 group-hover:border-[#c97d31]/40',
            isHolding && 'scale-100 border-[#c97d31]/60',
          )}
        />

        {/* Inner static border */}
        <div className="absolute inset-2 rounded-full border border-[#c97d31]/10" />

        {/* Filling Circle (Success Indicator) */}
        <div
          className={cn(
            'absolute inset-0 rounded-full bg-[#c97d31] transition-transform ease-linear will-change-transform',
            isHolding ? 'scale-100 duration-1500' : 'scale-0 duration-300',
          )}
        />

        {/* Center Dot */}
        <div className="z-10 h-3 w-3 rounded-full border border-[#c97d31]/80 bg-transparent" />
      </button>

      <span className="text-xs uppercase tracking-[0.2em] text-sanctuary-muted font-sans select-none">
        Hold to enter
      </span>
    </div>
  )
}
