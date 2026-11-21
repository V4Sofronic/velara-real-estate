import { Link } from 'react-router-dom'
import { Phone, Mail, Languages } from 'lucide-react'
import { agents } from '../data/site'
import { Reveal, Tilt } from '../components/ui'
import { initials } from '../utils'

export default function Agents() {
  return (
    <main className="page container">
      <Reveal className="page-head">
        <p className="mono eyebrow"><i className="rule" /> ADVISORS</p>
        <h1 className="h-section">People who know<br />the addresses.</h1>
        <p className="lede">Each Velara advisor specialises in a region, so you speak to someone who has actually walked the property.</p>
      </Reveal>
      <div className="grid grid--4">
        {agents.map((a, i) => (
          <Reveal key={a.id} delay={i * 80}>
            <Tilt><article className="panel agent-card">
              <span className="avatar avatar--xl">{initials(a.name)}</span>
              <h3>{a.name}</h3><p className="mono muted">{a.role}</p><p className="muted">{a.bio}</p>
              <ul><li><Languages size={14} /> {a.langs}</li><li><Phone size={14} /> {a.phone}</li><li><Mail size={14} /> {a.email}</li></ul>
              <Link className="btn btn--ghost btn--sm" to="/contact">Contact {a.name.split(' ')[0]}</Link>
            </article></Tilt>
          </Reveal>
        ))}
      </div>
    </main>
  )
}
