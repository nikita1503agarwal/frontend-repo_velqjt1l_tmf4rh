import Hero from './components/Hero'
import VoiceAgent from './components/VoiceAgent'
import Features from './components/Features'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Hero />
      <VoiceAgent />
      <Features />
      <Footer />
    </div>
  )
}

export default App