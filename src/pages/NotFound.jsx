import { Link } from 'react-router-dom'
export default function NotFound() {
  return <main className="page container center"><p className="mono eyebrow">404</p><h1 className="h-section">This page has moved on.</h1><Link to="/" className="btn btn--light">Back home</Link></main>
}
