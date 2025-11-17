import Spline from '@splinetool/react-spline'

function Hero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
        <div className="mx-auto mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur border border-white/20 shadow-lg">
            <span className="text-white/90 text-xl">AI</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-sm">
          JARVIS Design Agent for <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-amber-300">UMAR SAJID</span>
        </h1>
        <p className="mt-4 md:mt-6 text-blue-100/90 text-lg md:text-xl max-w-3xl mx-auto">
          Speak your intent. Get instant, professional design direction — ideas, palettes, fonts, layouts, and resources — all with a human-like voice.
        </p>
        <div className="mt-6 md:mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#agent" className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-colors">
            Summon the Agent
          </a>
          <a href="#quick" className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500/90 to-sky-500/90 hover:from-indigo-500 hover:to-sky-500 text-white shadow-lg shadow-indigo-500/20">
            Quick Commands
          </a>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.15),transparent_60%)]" />
    </section>
  )
}

export default Hero
