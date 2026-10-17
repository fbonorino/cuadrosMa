import { useState } from 'react'
import { obras } from './data/obras.js'
import Header from './components/Header.jsx'
import AboutMe from './components/AboutMe.jsx'
import Gallery from './components/Gallery.jsx'
import Catalog from './components/Catalog.jsx'
import Lightbox from './components/Lightbox.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(null)

  return (
    <div className="min-h-screen bg-canvas text-carbon font-sans">
      <Header />
      <AboutMe />
      <Gallery obras={obras} onSelect={setSelectedIndex} />
      <Catalog obras={obras} onSelect={setSelectedIndex} />
      <Footer />
      <Lightbox
        obras={obras}
        openIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
      />
    </div>
  )
}
