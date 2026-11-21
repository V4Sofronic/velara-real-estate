import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div>
          <div className="brand">VELARA<span className="brand__dot" /></div>
          <p className="muted footer__tag">Private estates, rare addresses and the people who know them.</p>
        </div>
        <nav aria-label="Footer"><h4 className="mono">Explore</h4>
          <Link to="/properties">All properties</Link><Link to="/properties?status=sale">Buy</Link><Link to="/properties?status=rent">Rent</Link><Link to="/agents">Our advisors</Link></nav>
        <nav aria-label="Account"><h4 className="mono">Account</h4>
          <Link to="/signin">Sign in</Link><Link to="/signup">Create account</Link><Link to="/account">Saved homes</Link><Link to="/contact">Contact</Link></nav>
        <div><h4 className="mono">Offices</h4><p className="muted">Limassol · Milan · Dubai<br />Los Angeles · Saint-Tropez</p></div>
      </div>
      <div className="footer__bottom mono"><span>© {new Date().getFullYear()} VELARA. Demo website with sample data.</span><span>Not a real brokerage</span></div>
    </footer>
  )
}
