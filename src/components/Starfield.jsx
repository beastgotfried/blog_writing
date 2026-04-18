import { useMemo } from 'react'

export function Starfield({ count = 300 }) {
  const stars = useMemo(() => {
    // Seeded random number generator for consistency
    const seededRandom = (seed) => {
      const x = Math.sin(seed) * 10000
      return x - Math.floor(x)
    }

    return Array.from({ length: count }, (_, i) => {
      const seed = i * 73.2 // Prime multiplier for better distribution
      const randomX = seededRandom(seed * 11.3)
      const randomY = seededRandom(seed * 23.7)
      const randomSize = seededRandom(seed * 31.4)
      const randomTwinkle = seededRandom(seed * 41.9)
      const randomDrift = seededRandom(seed * 53.2)
      const randomDelay = seededRandom(seed * 67.8)
      const randomDx = seededRandom(seed * 79.1)
      const randomDy = seededRandom(seed * 89.6)

      return {
        id: i,
        left: `${randomX * 100}%`,
        top: `${randomY * 100}%`,
        size: `${2 + randomSize * 2.5}px`, // Stars between 2-4.5px
        twinkle: `${2 + randomTwinkle * 3}s`, // Twinkle between 2-5s
        drift: `${10 + randomDrift * 12}s`, // Drift between 10-22s
        delay: `${randomDelay * 5}s`, // Stagger up to 5s
        dx: `${(randomDx - 0.5) * 4}px`, // X movement -2 to 2px
        dy: `${(randomDy - 0.5) * 4}px`, // Y movement -2 to 2px
        opacity: `${0.4 + randomSize * 0.6}`, // Opacity 0.4-1
      }
    })
  }, [count])

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {stars.map((star) => (
        <span
          key={star.id}
          className="star"
          style={{
            '--left': star.left,
            '--top': star.top,
            '--size': star.size,
            '--twinkle': star.twinkle,
            '--drift': star.drift,
            '--delay': star.delay,
            '--dx': star.dx,
            '--dy': star.dy,
            '--opacity': star.opacity,
          }}
        />
      ))}
    </div>
  )
}