function Features() {
  const items = [
    { title: 'Voice In / Voice Out', desc: 'Speak naturally. Get clear, human-sounding answers.' },
    { title: 'Design Research', desc: 'Trends, styles, UI patterns, and inspiration on demand.' },
    { title: 'Idea Generation', desc: 'Logos, posters, branding, thumbnails, reels, ads, packaging, and social.' },
    { title: 'Craft Toolkit', desc: 'Palettes, font pairs, gradients, shadows, layouts, compositions.' },
    { title: 'Brief → Tasks', desc: 'Turn any client brief into actionable, prioritized steps.' },
    { title: 'Resources', desc: 'Icons, mockups, inspiration, palettes, references, UI kits, templates.' },
  ]
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-10 md:py-16">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {items.map((it, idx) => (
          <div key={idx} className="rounded-2xl p-5 md:p-6 bg-slate-900/60 border border-white/10 text-blue-50">
            <h3 className="font-semibold text-white mb-1">{it.title}</h3>
            <p className="text-blue-200/80 text-sm">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features
