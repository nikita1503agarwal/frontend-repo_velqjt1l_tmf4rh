import { useEffect, useMemo, useRef, useState } from 'react'

// Basic voice I/O using Web Speech API (Chrome/Edge). No external deps.
// Fallback: text only if APIs unavailable.

const supportsSTT = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
const supportsTTS = typeof window !== 'undefined' && 'speechSynthesis' in window

const recognitionFactory = () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) return null
  const r = new SR()
  r.lang = 'en-US'
  r.continuous = false
  r.interimResults = true
  r.maxAlternatives = 1
  return r
}

function useVoice() {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const recognition = useRef(null)

  useEffect(() => {
    if (supportsSTT) {
      recognition.current = recognitionFactory()
      if (recognition.current) {
        recognition.current.onresult = (e) => {
          let text = ''
          for (let i = e.resultIndex; i < e.results.length; i++) {
            text += e.results[i][0].transcript
          }
          setTranscript(text.trim())
        }
        recognition.current.onend = () => {
          setListening(false)
        }
        recognition.current.onerror = () => setListening(false)
      }
    }
    return () => {
      if (recognition.current) recognition.current.stop()
    }
  }, [])

  const start = () => {
    if (!recognition.current) return
    setTranscript('')
    recognition.current.start()
    setListening(true)
  }

  const stop = () => {
    if (!recognition.current) return
    recognition.current.stop()
    setListening(false)
  }

  const speak = (text) => {
    if (!supportsTTS) return
    try {
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = 'en-US'
      utter.rate = 1.02
      utter.pitch = 1.0
      utter.volume = 1
      const voices = window.speechSynthesis.getVoices()
      const preferred = voices.find(v => /male|daniel|en-us|google uk english male/i.test(v.name)) || voices[0]
      if (preferred) utter.voice = preferred
      utter.onstart = () => setSpeaking(true)
      utter.onend = () => setSpeaking(false)
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utter)
    } catch (e) {
      console.error(e)
    }
  }

  return { listening, transcript, start, stop, speaking, speak, sttReady: !!recognition.current, ttsReady: supportsTTS }
}

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function VoiceAgent() {
  const { listening, transcript, start, stop, speaking, speak, sttReady, ttsReady } = useVoice()
  const [reply, setReply] = useState('Ready when you are, Umar.')
  const [loading, setLoading] = useState(false)

  const actions = useMemo(() => ([
    { label: 'Design Ideas', payload: { endpoint: '/api/ideas', body: { category: 'branding', keywords: 'AI creative studio', style: 'futuristic' } } },
    { label: 'Palettes', payload: { endpoint: '/api/palettes', body: { vibe: 'tech', accent: '#7C3AED' } } },
    { label: 'Fonts', payload: { endpoint: '/api/fonts', body: { mood: 'tech' } } },
    { label: 'Resources', payload: { endpoint: '/api/resources', body: { topic: 'SaaS dashboard', kind: 'ui' } } },
  ]), [])

  const ask = async (intent) => {
    setLoading(true)
    try {
      let endpoint = '/api/ideas'
      let body = { category: 'branding', keywords: transcript || 'brand', style: 'modern' }

      if (intent?.endpoint) {
        endpoint = intent.endpoint
        body = intent.body
      } else if (/palette|color/i.test(transcript)) {
        endpoint = '/api/palettes'
        body = { vibe: 'tech', accent: '#7C3AED' }
      } else if (/font|type/i.test(transcript)) {
        endpoint = '/api/fonts'
        body = { mood: 'modern' }
      } else if (/resource|icon|mockup|template|ui/i.test(transcript)) {
        endpoint = '/api/resources'
        body = { topic: transcript || 'dashboard', kind: 'ui' }
      } else if (/brief|task|scope|deliverable/i.test(transcript)) {
        endpoint = '/api/brief/analyze'
        body = { client: 'Client', project_type: 'branding', goals: transcript }
      }

      const res = await fetch(baseUrl + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      const text = formatResponse(endpoint, data)
      setReply(text)
      if (ttsReady) speak(text)
    } catch (e) {
      const msg = 'Connection issue. I will retry shortly.'
      setReply(msg)
      if (ttsReady) speak(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="agent" className="relative z-10 max-w-5xl mx-auto px-6 -mt-10">
      <div className="rounded-2xl border border-white/15 bg-white/7.5 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <button onClick={listening ? stop : start} className={`shrink-0 w-14 h-14 rounded-full grid place-items-center border transition-all ${listening ? 'bg-rose-500 border-rose-400 shadow-rose-500/40 shadow-lg' : 'bg-indigo-500/90 border-indigo-400/50 hover:bg-indigo-500'} text-white`}
            aria-label={listening ? 'Stop listening' : 'Start listening'}>
            {listening ? (
              <span className="animate-pulse">●</span>
            ) : (
              <span className="font-semibold">🎤</span>
            )}
          </button>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wide text-blue-200/80">Voice Command</div>
            <div className="mt-1 text-white/90 min-h-[24px]">
              {transcript || 'Press mic and speak. “Suggest tech color palettes with purple accent.”'}
            </div>
          </div>
          <button onClick={() => ask()} disabled={loading} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 disabled:opacity-60">
            {loading ? 'Thinking…' : 'Ask Agent'}
          </button>
        </div>

        <div className="mt-6 p-4 md:p-5 rounded-xl bg-slate-900/60 border border-white/10 min-h-[100px] text-blue-100/90">
          {reply}
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3" id="quick">
          {actions.map((a, i) => (
            <button key={i} onClick={() => ask(a.payload)} className="px-3 py-2 rounded-xl bg-white/8 hover:bg-white/15 text-white border border-white/15 text-sm">
              {a.label}
            </button>
          ))}
        </div>

        <div className="mt-4 text-xs text-blue-200/60">
          {(!sttReady || !ttsReady) && 'Note: Your browser may limit voice features. Chrome recommended.'}
          {speaking && ' Speaking…'}
        </div>
      </div>
    </section>
  )
}

function formatResponse(endpoint, data) {
  if (endpoint === '/api/brief/analyze') {
    return [
      'Brief distilled. Key steps:',
      ...(data.tasks || []),
      'Risks:',
      ...(data.risks || []),
    ].join('\n')
  }
  if (endpoint === '/api/ideas') {
    return ['Directions:', ...(data.ideas || [])].join('\n')
  }
  if (endpoint === '/api/resources') {
    return ['Resources:', ...(data.results || [])].join('\n')
  }
  if (endpoint === '/api/palettes') {
    const groups = (data.palettes || []).map(p => `${p.name}: ${p.colors.join(' | ')}`)
    return ['Palettes:', ...groups].join('\n')
  }
  if (endpoint === '/api/fonts') {
    const pairs = (data.pairs || []).map(p => `${p.heading} + ${p.body}`)
    return ['Font pairs:', ...pairs].join('\n')
  }
  return JSON.stringify(data, null, 2)
}

export default VoiceAgent
