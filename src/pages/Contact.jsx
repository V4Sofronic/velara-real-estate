import { Mail, MapPin, Phone } from 'lucide-react'
import InquiryForm from '../components/InquiryForm'
import { Reveal } from '../components/ui'

export default function Contact() {
  return (
    <main className="page container">
      <Reveal className="page-head">
        <p className="mono eyebrow"><i className="rule" /> CONTACT</p>
        <h1 className="h-section">Let’s talk about<br />where you’re going next.</h1>
      </Reveal>
      <div className="contact">
        <Reveal className="contact__info">
          <p className="lede">Tell us a little about what you’re looking for. Enquiries are answered within one business day.</p>
          <ul>
            <li><Phone size={16} /> +357 25 555 0100</li><li><Mail size={16} /> hello@velara.example</li><li><MapPin size={16} /> 1 Marina Promenade, Limassol</li>
          </ul>
        </Reveal>
        <Reveal><InquiryForm title="Send us a message" /></Reveal>
      </div>
    </main>
  )
}
