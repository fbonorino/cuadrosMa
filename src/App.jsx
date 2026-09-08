import { useState } from 'react'
import { obras } from './data/obras.js'
import Header from './components/Header.jsx'
import Gallery from './components/Gallery.jsx'
import Modal from './components/Modal.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [selectedObra, setSelectedObra] = useState(null)

  return (
    <div className="min-h-screen bg-canvas text-carbon font-sans">
      <Header />
      <Gallery obras={obras} onSelect={setSelectedObra} />
      <Footer />
      {selectedObra && (
        <Modal obra={selectedObra} onClose={() => setSelectedObra(null)} />
      )}
    </div>
  )
}
