import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import './App.css'
import { useTheme } from './ThemeContext'

const MOTIVATIONAL_PHRASES = [
  "Keep going!",
  "You're doing great!",
  "Stay strong!",
  "Almost there!",
  "Push through!",
  "You got this!",
  "Believe in yourself!",
  "Keep up the good work!",
  "Stay focused!",
  "Finish strong!"
]

const TIMER_OPTIONS = [10, 20, 30]

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      className="theme-toggle"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      style={{ position: 'fixed', top: 24, right: 24, zIndex: 1001, background: 'var(--color-card-bg)', boxShadow: 'var(--color-shadow)', border: 'none', padding: 10, borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.4s' }}
    >
      <motion.span
        key={theme}
        initial={{ rotate: theme === 'dark' ? 90 : -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {theme === 'dark' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M21.5 14.078A8.557 8.557 0 0 1 9.922 2.5C5.668 3.497 2.5 7.315 2.5 11.873a9.627 9.627 0 0 0 9.627 9.627c4.558 0 8.376-3.168 9.373-7.422"
              color="currentColor"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M17 12a5 5 0 1 1-10 0a5 5 0 0 1 10 0m-5.004-9h.008m-.008 18h.01m6.353-15.364h.009M5.634 18.364h.01m-.01-12.728h.01m12.714 12.729h.01M20.99 12H21M3 12h.009"
              color="currentColor"
            />
          </svg>
        )}
      </motion.span>
    </button>
  )
}

function App() {
  const [name, setName] = useState(() => localStorage.getItem('timerName') || '')
  const [timer, setTimer] = useState(TIMER_OPTIONS[0])
  const [duration, setDuration] = useState(TIMER_OPTIONS[0])
  const [customSeconds, setCustomSeconds] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [motivation, setMotivation] = useState('')
  const [completedCount, setCompletedCount] = useState(() => Number(localStorage.getItem('timerCompletedCount') || 0))
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    let interval = null
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
        setMotivation(MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)])
      }, 1000)
    } else if (isRunning && timer === 0) {
      setIsRunning(false)
      setIsCompleted(true)
      setMotivation(MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)])
      setCompletedCount((prev) => {
        const newCount = prev + 1
        localStorage.setItem('timerCompletedCount', newCount)
        return newCount
      })
      setShowConfetti(true)
    }
    return () => clearInterval(interval)
  }, [isRunning, timer])

  useEffect(() => {
    if (name) localStorage.setItem('timerName', name)
  }, [name])

  useEffect(() => {
    if (showConfetti) {
      const timeout = setTimeout(() => setShowConfetti(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [showConfetti])

  const handleStart = () => {
    setIsRunning(true)
    setIsCompleted(false)
    setMotivation(MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)])
  }

  const handleReset = () => {
    setName('')
    setTimer(TIMER_OPTIONS[0])
    setDuration(TIMER_OPTIONS[0])
    setCustomSeconds('')
    setIsRunning(false)
    setIsCompleted(false)
    setMotivation('')
    setShowConfetti(false)
    localStorage.removeItem('timerName')
    setCompletedCount(0)
    localStorage.setItem('timerCompletedCount', 0)
  }

  const handleTryAgain = () => {
    setTimer(duration)
    setIsRunning(false)
    setIsCompleted(false)
    setMotivation('')
    setShowConfetti(false)
  }

  const handleDurationChange = (e) => {
    const value = Number(e.target.value)
    setDuration(value)
    setTimer(value)
    setCustomSeconds('')
  }

  const handleCustomSecondsChange = (e) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      setCustomSeconds(value)
      if (value) {
        const num = Math.max(1, Math.min(999, Number(value)))
        setDuration(num)
        setTimer(num)
      }
    }
  }

  const progress = 1 - timer / duration

  return (
    <>
      <ThemeToggle />
      <div className="card">
        <h1 style={{ marginBottom: '0.5em', fontWeight: 800, letterSpacing: '-1px' }}>Reactive Timer-Motivator</h1>
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label htmlFor="timer-select" style={{ marginRight: 8, fontWeight: 600, fontSize: '1.1em' }}>Timer:</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <select
              id="timer-select"
              value={customSeconds ? '' : duration}
              onChange={handleDurationChange}
              disabled={isRunning || isCompleted}
              style={{ minWidth: 120, cursor: 'pointer' }}
            >
              {TIMER_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt} seconds</option>
              ))}
              <option value="">Custom</option>
            </select>
            <input
              type="number"
              min="1"
              max="999"
              placeholder="Custom seconds"
              value={customSeconds}
              onChange={handleCustomSecondsChange}
              disabled={isRunning || isCompleted}
              style={{ width: 120 }}
            />
          </div>
        </div>
        <div style={{ marginBottom: '1.2rem', fontWeight: 'bold', fontSize: '1.1em', color: 'var(--color-primary)' }}>
          Completed: {completedCount} {completedCount === 1 ? 'time' : 'times'}
        </div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5 }}
          style={{
            height: 10,
            background: 'var(--color-progress)',
            borderRadius: 5,
            marginBottom: 20,
            width: `${progress * 100}%`,
            minWidth: 10,
            boxShadow: 'var(--color-shadow)',
            transition: 'background 0.5s',
          }}
        />
        {!isCompleted ? (
          <>
            <input
              type="text"
              placeholder="Enter your name"
              maxLength={16}
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={isRunning}
              style={{ marginBottom: '1rem', textAlign: 'center', fontWeight: 600 }}
            />
            <div style={{ margin: '1rem 0', fontSize: '2.2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              {isRunning && name ? `${name}, ${timer} seconds left` : `${timer} seconds`}
            </div>
            {isRunning && motivation && (
              <div style={{ marginBottom: '1rem', color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '1.1em' }}>{motivation}</div>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
              <button onClick={handleStart} disabled={isRunning || !name} style={{ fontWeight: 700, fontSize: '1.1em' }}>
                Start timer
              </button>
              <button onClick={handleReset} style={{ fontWeight: 700, fontSize: '1.1em' }}>Reset</button>
            </div>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              style={{ display: 'inline-block' }}
            >
              <div style={{ fontSize: '2rem', margin: '1rem 0', fontWeight: 800, color: 'var(--color-primary)' }}>
                You did it, {name} 💪
              </div>
            </motion.div>
            <div style={{ marginBottom: '1rem', color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '1.1em' }}>{motivation}</div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
              <button onClick={handleTryAgain} style={{ fontWeight: 700, fontSize: '1.1em' }}>Try again</button>
              <button onClick={handleReset} style={{ fontWeight: 700, fontSize: '1.1em' }}>Reset</button>
            </div>
          </>
        )}
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            style={{ position: 'fixed', top: 80, left: 0, right: 0, zIndex: 1000, pointerEvents: 'none' }}
          >
            <div style={{ fontSize: '2.5rem', color: 'var(--color-primary)', fontWeight: 900, textShadow: '0 2px 8px #0002' }}>🎉</div>
          </motion.div>
        )}
      </div>
    </>
  )
}

export default App
