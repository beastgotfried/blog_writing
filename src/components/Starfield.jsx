import { useEffect, useMemo, useRef } from 'react'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const randomBetween = (min, max) => min + Math.random() * (max - min)

export function Starfield({ count = 160 }) {
  const canvasRef = useRef(null)

  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed = i * 73.2 // Prime multiplier for better distribution
      const randomX = seededRandom(seed * 11.3)
      const randomY = seededRandom(seed * 23.7)
      const randomSize = seededRandom(seed * 31.4)
      const randomTwinkle = seededRandom(seed * 41.9)
      const randomDrift = seededRandom(seed * 53.2)
      const randomDx = seededRandom(seed * 79.1)
      const randomDy = seededRandom(seed * 89.6)

      return {
        id: i,
        x: randomX,
        y: randomY,
        radius: 0.45 + randomSize * 1.15,
        opacity: 0.22 + randomSize * 0.58,
        twinkleSpeed: 0.2 + randomTwinkle * 0.55,
        twinklePhase: seededRandom(seed * 97.5) * Math.PI * 2,
        driftSpeed: 0.03 + randomDrift * 0.08,
        driftPhase: seededRandom(seed * 117.5) * Math.PI * 2,
        driftX: (randomDx - 0.5) * 18,
        driftY: (randomDy - 0.5) * 14,
      }
    })
  }, [count])

  const shootingStars = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      startAt: 1800 + i * 3200 + randomBetween(0, 2200),
      duration: randomBetween(900, 1350),
      angle: randomBetween(15, 24) * (Math.PI / 180),
      lane: randomBetween(0.08, 0.48),
      tail: randomBetween(100, 180),
      width: randomBetween(1, 1.6),
      opacity: randomBetween(0.7, 1),
      speedScale: randomBetween(0.95, 1.15),
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const context = canvas.getContext('2d')
    if (!context) return undefined

    const parent = canvas.parentElement
    if (!parent) return undefined

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const reduceMotion = reduceMotionQuery.matches
    let width = 0
    let height = 0
    let devicePixelRatio = clamp(window.devicePixelRatio || 1, 1, 2)
    let animationFrame = 0

    const resize = () => {
      width = parent.clientWidth
      height = parent.clientHeight
      devicePixelRatio = clamp(window.devicePixelRatio || 1, 1, 2)

      canvas.width = Math.max(1, Math.floor(width * devicePixelRatio))
      canvas.height = Math.max(1, Math.floor(height * devicePixelRatio))
      canvas.style.width = '100%'
      canvas.style.height = '100%'

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }

    const drawBackgroundStars = (elapsed) => {
      context.clearRect(0, 0, width, height)

      for (const star of stars) {
        const driftX = Math.sin(elapsed * star.driftSpeed + star.driftPhase) * star.driftX
        const driftY = Math.cos(elapsed * star.driftSpeed + star.driftPhase) * star.driftY
        const twinkle = 0.5 + 0.5 * Math.sin(elapsed * star.twinkleSpeed + star.twinklePhase)
        const opacity = star.opacity * (0.35 + twinkle * 0.65)
        const x = star.x * width + driftX
        const y = star.y * height + driftY

        context.beginPath()
        context.fillStyle = `rgba(255, 255, 255, ${opacity})`
        context.shadowColor = 'rgba(255, 255, 255, 0.25)'
        context.shadowBlur = star.radius * 3
        context.arc(x, y, star.radius, 0, Math.PI * 2)
        context.fill()
      }
    }

    const drawShootingStars = (elapsed) => {
      for (const star of shootingStars) {
        const cycleTime = elapsed - star.startAt

        if (cycleTime < 0) continue

        const progress = cycleTime / star.duration

        if (progress > 1) {
          star.startAt = elapsed + randomBetween(1800, 7200)
          star.duration = randomBetween(900, 1350)
          star.angle = randomBetween(15, 24) * (Math.PI / 180)
          star.lane = randomBetween(0.08, 0.48)
          star.tail = randomBetween(100, 180)
          star.width = randomBetween(1, 1.6)
          star.opacity = randomBetween(0.7, 1)
          star.speedScale = randomBetween(0.95, 1.15)
          continue
        }

        const travel = Math.hypot(width * 1.35, height * 0.55) * star.speedScale
        const distance = travel * progress
        const startX = -width * 0.18
        const startY = height * star.lane
        const vx = Math.cos(star.angle)
        const vy = Math.sin(star.angle)
        const x = startX + vx * distance
        const y = startY + vy * distance
        const tailX = x - vx * star.tail
        const tailY = y - vy * star.tail
        const fade = progress < 0.15 ? progress / 0.15 : progress > 0.8 ? (1 - progress) / 0.2 : 1
        const alpha = Math.max(0, star.opacity * fade)

        context.save()
        context.lineCap = 'round'
        context.beginPath()
        context.moveTo(tailX, tailY)
        context.lineTo(x, y)
        context.strokeStyle = `rgba(255, 255, 255, ${alpha})`
        context.lineWidth = star.width
        context.shadowColor = 'rgba(255, 255, 255, 0.85)'
        context.shadowBlur = 16
        context.stroke()

        const head = context.createRadialGradient(x, y, 0, x, y, 10)
        head.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
        head.addColorStop(1, 'rgba(255, 255, 255, 0)')
        context.fillStyle = head
        context.beginPath()
        context.arc(x, y, 5, 0, Math.PI * 2)
        context.fill()
        context.restore()
      }
    }

    const render = (now) => {
      drawBackgroundStars(now * 0.001)
      drawShootingStars(now)
      animationFrame = window.requestAnimationFrame(render)
    }

    resize()

    if (reduceMotion) {
      drawBackgroundStars(performance.now() * 0.001)
      return undefined
    }

    const observer = new ResizeObserver(() => {
      resize()
      drawBackgroundStars(performance.now() * 0.001)
    })

    observer.observe(parent)
    animationFrame = window.requestAnimationFrame(render)

    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(animationFrame)
    }
  }, [shootingStars, stars])

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}