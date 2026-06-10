import { useState, useEffect } from 'react'

export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    'portrait',
  )

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(
        window.innerHeight < window.innerWidth ? 'landscape' : 'portrait',
      )
    }

    // Set initial value
    handleOrientationChange()

    window.addEventListener('resize', handleOrientationChange)

    const handleWindowChange = () => {
      setTimeout(handleOrientationChange, 50)
    }
    window.addEventListener('orientationchange', handleWindowChange)

    return () => {
      window.removeEventListener('resize', handleOrientationChange)
      window.removeEventListener('orientationchange', handleWindowChange)
    }
  }, [])

  return orientation
}
