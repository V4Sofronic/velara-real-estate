export const money = (p, status) => {
  const s = p >= 1e6 ? `$${(p / 1e6).toFixed(p % 1e6 === 0 ? 0 : 2).replace(/\.?0+$/, '')}M` : `$${p.toLocaleString('en-US')}`
  return status === 'rent' ? `${s} / mo` : s
}
export const moneyFull = (p) => '$' + Math.round(p).toLocaleString('en-US')
export const sqft = (n) => n.toLocaleString('en-US')
export const initials = (n = '') => n.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
