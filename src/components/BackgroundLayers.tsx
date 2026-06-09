import { cn } from '@/lib/utils'

interface BackgroundLayersProps {
  className?: string
}

export const BackgroundLayers = ({ className }: BackgroundLayersProps) => {
  const imageUrl =
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2560&auto=format&fit=crop'

  return (
    <div className={cn('absolute inset-0 z-0 overflow-hidden', className)}>
      {/* Sharp Layer (Base) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: `url(${imageUrl})`,
          filter: 'sepia(0.3) grayscale(0.2)',
        }}
      />

      {/* Blur Layer (Top) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${imageUrl})`,
          filter: 'blur(30px) sepia(0.6) brightness(0.8)',
          // The magic mask: transparent at cursor, black elsewhere.
          // In CSS mask, transparent means HIDDEN, black means VISIBLE (alpha mask).
          // We want to REVEAL the sharp layer underneath.
          // So the BLUR layer should be HIDDEN at the cursor.
          // So the mask should be TRANSPARENT at the cursor.
          maskImage:
            'radial-gradient(circle 350px at var(--mouse-x, 50%) var(--mouse-y, 50%), transparent 0%, black 100%)',
          WebkitMaskImage:
            'radial-gradient(circle 350px at var(--mouse-x, 50%) var(--mouse-y, 50%), transparent 0%, black 100%)',
        }}
      />

      {/* Global Overlay Tint */}
      <div className="absolute inset-0 bg-sanctuary-bg/30 pointer-events-none mix-blend-multiply" />
    </div>
  )
}
