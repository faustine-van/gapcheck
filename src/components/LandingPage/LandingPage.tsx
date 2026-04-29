import { useState } from 'react'
import Hero from './Hero'
import DemoPreview from './DemoPreview'
import HowItWorks from './HowItWorks'
import Features from './Features'
import BottomCTA from './BottomCTA'
import './styles/LandingPage.css'
import './styles/animations.css'

interface Props {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: Props) {
  const [loading, setLoading] = useState(false)

  const handleStart = () => {
    setLoading(true)
    setTimeout(() => {
      onGetStarted()
      setLoading(false)
    }, 300)
  }

  return (
    <div className="landing">
      <Hero onGetStarted={handleStart} loading={loading} />
      <HowItWorks />
      <DemoPreview />
      <Features />
      <BottomCTA onGetStarted={handleStart} loading={loading} />
    </div>
  )
}