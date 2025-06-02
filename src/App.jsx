import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import './App.css'

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
    <div className="card">
      <h1>Reactive Timer-Motivator</h1>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="timer-select" style={{ marginRight: 8 }}>Timer:</label>
        <select
          id="timer-select"
          value={customSeconds ? '' : duration}
          onChange={handleDurationChange}
          disabled={isRunning || isCompleted}
          style={{ padding: '0.4rem', borderRadius: '0.5rem', fontSize: '1rem', marginRight: 8 }}
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
          style={{ width: 120, padding: '0.4rem', borderRadius: '0.5rem', fontSize: '1rem' }}
        />
      </div>
      <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
        Completed: {completedCount} {completedCount === 1 ? 'time' : 'times'}
      </div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.5 }}
        style={{
          height: 10,
          background: '#646cff',
          borderRadius: 5,
          marginBottom: 20,
          width: `${progress * 100}%`,
          minWidth: 10,
        }}
      />
      {!isCompleted ? (
        <>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={isRunning}
            style={{ marginBottom: '1rem', padding: '0.5rem', fontSize: '1rem', borderRadius: '0.5rem', outline: 'none', border: '1px solid #ccc', textAlign: 'center' }}
          />
          <div style={{ margin: '1rem 0', fontSize: '2rem' }}>
            {isRunning && name ? `${name}, ${timer} seconds left` : `${timer} seconds`}
          </div>
          {isRunning && motivation && (
            <div style={{ marginBottom: '1rem', color: '#646cff', fontWeight: 'bold' }}>{motivation}</div>
          )}
          <button onClick={handleStart} disabled={isRunning || !name} style={{ marginRight: '1rem' }}>
            Start timer
          </button>
          <button onClick={handleReset}>Reset</button>
        </>
      ) : (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            style={{ display: 'inline-block' }}
          >
            <div style={{ fontSize: '2rem', margin: '1rem 0' }}>
              You did it, {name} 💪
            </div>
          </motion.div>
          <div style={{ marginBottom: '1rem', color: '#646cff', fontWeight: 'bold' }}>{motivation}</div>
          <button onClick={handleTryAgain} style={{ marginRight: '1rem' }}>Try again</button>
          <button onClick={handleReset}>Reset</button>
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
          <span style={{ fontSize: '3rem', color: '#FFD700', margin: 8 }}>🎉</span>
          <span style={{ fontSize: '3rem', color: '#FF69B4', margin: 8 }}>✨</span>
          <span style={{ fontSize: '3rem', color: '#00BFFF', margin: 8 }}>🎊</span>
        </motion.div>
      )}
    </div>
  )
}

export default App
