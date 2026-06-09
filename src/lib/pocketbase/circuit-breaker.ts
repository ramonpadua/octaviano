import pb from '@/lib/pocketbase/client'

const baseUrl = import.meta.env.VITE_POCKETBASE_URL

interface FallbackConfig<T> {
  collection: string
  params?: Record<string, string>
  extractItems?: boolean
  defaultReturn: T
}

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(
      () => reject(new Error('CircuitBreaker Timeout')),
      ms,
    )
    promise.then(
      (res) => {
        clearTimeout(timeoutId)
        resolve(res)
      },
      (err) => {
        clearTimeout(timeoutId)
        reject(err)
      },
    )
  })
}

export const safeExecute = async <T>(
  operation: () => Promise<T>,
  fallback: FallbackConfig<T>,
  timeoutMs: number = 5000,
): Promise<T> => {
  try {
    return await withTimeout(operation(), timeoutMs)
  } catch (error) {
    console.warn(
      `[CircuitBreaker] SDK failed/timed out, trying native fetch for ${fallback.collection}`,
      error,
    )
    try {
      const url = new URL(
        `${baseUrl}/api/collections/${fallback.collection}/records`,
      )
      if (fallback.params) {
        Object.entries(fallback.params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value))
          }
        })
      }

      const controller = new AbortController()
      const fallbackTimeout = setTimeout(() => controller.abort(), timeoutMs)

      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(pb.authStore.token
            ? { Authorization: `Bearer ${pb.authStore.token}` }
            : {}),
        },
      }).finally(() => clearTimeout(fallbackTimeout))

      if (!response.ok) {
        throw new Error(`Fallback HTTP error: ${response.status}`)
      }

      const data = await response.json()

      if (fallback.extractItems) {
        return (data.items || []) as T
      }

      return data as T
    } catch (fallbackError) {
      console.error(
        `[CircuitBreaker] Fallback failed for ${fallback.collection}`,
        fallbackError,
      )
      return fallback.defaultReturn
    }
  }
}
