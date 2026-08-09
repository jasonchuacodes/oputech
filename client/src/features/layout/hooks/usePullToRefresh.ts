import { useRef, useState } from 'react'
import { useVerticalDrag } from '../../../hooks/useVerticalDrag'

interface UsePullToRefreshOptions {
  threshold?: number
  maxPull?: number
}

const REFRESH_SETTLE_DELAY = 500

export const usePullToRefresh = (
  containerRef: React.RefObject<HTMLElement | null>,
  onRefresh: () => void | Promise<void>,
  { threshold = 56, maxPull = 90 }: UsePullToRefreshOptions = {}
) => {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const isRefreshingRef = useRef(false)

  const bind = useVerticalDrag(
    ({ movement: [, my], last, cancel, first }) => {
      if (isRefreshingRef.current) return cancel()
      if (first && (containerRef.current?.scrollTop ?? 0) !== 0) return cancel()

      if (!last) {
        setPullDistance(Math.max(0, Math.min(maxPull, my)))
        return
      }

      if (my >= threshold) {
        isRefreshingRef.current = true
        setIsRefreshing(true)
        setTimeout(() => {
          Promise.resolve(onRefresh())
            .catch(() => {})
            .finally(() => {
              isRefreshingRef.current = false
              setIsRefreshing(false)
              setPullDistance(0)
            })
        }, REFRESH_SETTLE_DELAY)
      } else {
        setPullDistance(0)
      }
    },
    { rubberband: true }
  )

  return { bind, pullDistance, isRefreshing, isTriggered: pullDistance >= threshold }
}
