// Plain ESM with no Vite-only imports, so the Express server can import it too.
// Photos are frames from the placeholder film. Replace with your own in /public/img.
const ext = (n) => `/img/ext-${n}.jpg`
const int = (n) => `/img/int-${n}.jpg`

const F = {
  pool: 'Infinity pool', tennis: 'Tennis court', cinema: 'Home cinema', wine: 'Wine cellar',
  spa: 'Spa & hammam', gym: 'Private gym', gate: 'Gated entrance', sea: 'Sea views',
  garden: 'Landscaped gardens', smart: 'Smart-home system', garage: '6-car garage', staff: 'Staff quarters',
  conc: '24h concierge', terrace: 'Panoramic terrace', jetty: 'Private jetty', helipad: 'Helipad',
}

const base = [
  { id: 'p1', title: 'Villa Cielo Aurea', city: 'Limassol', country: 'Cyprus', type: 'Estate', status: 'sale', price: 18500000, beds: 7, baths: 9, area: 14200, lot: '1.9 acres', year: 2022, featured: true, agentId: 'a1',
    summary: 'A hilltop estate of pale stone and amber light, stepping down to the Mediterranean.',
    description: 'Cielo Aurea is composed as a sequence of arrivals: a gated forecourt, a double-height hall, and a living room that opens fully to the sea. Seven suites, a tennis court, and terraced gardens sit within 1.9 acres of private, lit grounds.',
    features: [F.pool, F.tennis, F.sea, F.gate, F.garden, F.cinema, F.smart, F.wine], images: [ext(1), int(3), ext(3), int(4)], focus: '50% 55%' },
  { id: 'p2', title: 'Casa Mar y Luz', city: 'Marbella', country: 'Spain', type: 'Villa', status: 'sale', price: 9250000, beds: 6, baths: 7, area: 9100, lot: '0.8 acres', year: 2020, featured: true, agentId: 'a1',
    summary: 'Andalusian proportions with a contemporary calm, minutes from the Golden Mile.',
    description: 'Warm plaster walls, deep loggias and a pool that appears to dissolve into the horizon. Casa Mar y Luz is a home built for long lunches and longer evenings, with a guest wing and a self-contained staff apartment.',
    features: [F.pool, F.sea, F.gate, F.garden, F.terrace, F.gym, F.smart], images: [ext(2), int(2), ext(4), int(4)], focus: '40% 50%' },
  { id: 'p3', title: 'The Cypress Terrace', city: 'Lake Como', country: 'Italy', type: 'Villa', status: 'sale', price: 12900000, beds: 6, baths: 8, area: 10800, lot: '1.2 acres', year: 2019, featured: true, agentId: 'a1',
    summary: 'Lakefront living behind a line of cypress, with a private mooring.',
    description: 'A restored 1920s villa joined to a precise modern extension. Original frescoes are preserved in the formal rooms; the new wing holds a spa, cinema and a kitchen designed for a full catering team.',
    features: [F.jetty, F.spa, F.garden, F.cinema, F.wine, F.gate, F.terrace], images: [ext(3), int(1), ext(1), int(3)], focus: '60% 50%' },
  { id: 'p4', title: 'Skyline Penthouse 88', city: 'Dubai Marina', country: 'UAE', type: 'Penthouse', status: 'sale', price: 6400000, beds: 4, baths: 5, area: 5200, lot: 'Full floor', year: 2023, featured: true, agentId: 'a3',
    summary: 'A full-floor penthouse with a 270° view of the marina and the open Gulf.',
    description: 'Floor-to-ceiling glass, a private elevator lobby and a wrap-around terrace with plunge pool. Serviced by a 24-hour concierge with direct beach and marina access.',
    features: [F.sea, F.conc, F.pool, F.gym, F.smart, F.terrace, F.garage], images: [int(4), int(3), int(2), ext(2)], focus: '60% 50%' },
  { id: 'p5', title: 'Maison des Pins', city: 'Saint-Tropez', country: 'France', type: 'Estate', status: 'rent', price: 42000, beds: 8, baths: 9, area: 11500, lot: '2.4 acres', year: 2018, featured: true, agentId: 'a4',
    summary: 'A summer estate under umbrella pines, available by the month.',
    description: 'Eight bedrooms across a main house and two guest pavilions, a 25 m pool, a pétanque lawn and a chef’s kitchen. Fully staffed on request; minimum four weeks.',
    features: [F.pool, F.garden, F.staff, F.gate, F.wine, F.tennis], images: [ext(4), int(2), ext(2), int(3)], focus: '55% 50%' },
  { id: 'p6', title: 'Horizon House', city: 'Malibu', country: 'USA', type: 'Villa', status: 'sale', price: 14750000, beds: 5, baths: 6, area: 7800, lot: '0.9 acres', year: 2021, featured: false, agentId: 'a2',
    summary: 'Oceanfront glass and timber on the Pacific Coast Highway.',
    description: 'Cantilevered above the bluff, Horizon House frames the Pacific in every room. A cedar-lined spa, outdoor kitchen and a private path to the sand complete the offering.',
    features: [F.sea, F.spa, F.pool, F.smart, F.garage, F.terrace], images: [int(3), ext(1), int(4), ext(3)], focus: '50% 50%' },
  { id: 'p7', title: 'Aegean Stone Residence', city: 'Mykonos', country: 'Greece', type: 'Villa', status: 'sale', price: 7800000, beds: 5, baths: 6, area: 6400, lot: '0.6 acres', year: 2021, featured: false, agentId: 'a1',
    summary: 'Whitewashed volumes and a sunset terrace above the Aegean.',
    description: 'Hand-finished stone, a pool carved into the rock and uninterrupted views to Delos. Five ensuite bedrooms and a separate studio for guests.',
    features: [F.pool, F.sea, F.terrace, F.garden, F.smart], images: [ext(2), int(1), ext(4), int(2)], focus: '45% 50%' },
  { id: 'p8', title: 'Palazzo Verde', city: 'Florence', country: 'Italy', type: 'Townhouse', status: 'sale', price: 4950000, beds: 5, baths: 5, area: 6100, lot: 'Walled garden', year: 1790, featured: false, agentId: 'a1',
    summary: 'A restored Renaissance townhouse with a private walled garden.',
    description: 'Painted ceilings, a loggia and a hidden courtyard in the historic centre. Discreetly modernised, with a lift, a cellar and underground parking.',
    features: [F.garden, F.wine, F.gate, F.smart, F.garage], images: [int(1), ext(3), int(3), ext(1)], focus: '50% 50%' },
  { id: 'p9', title: 'Marina Glass Loft', city: 'Miami Beach', country: 'USA', type: 'Apartment', status: 'rent', price: 18500, beds: 3, baths: 3, area: 3300, lot: 'Corner unit', year: 2022, featured: false, agentId: 'a2',
    summary: 'A light-filled corner residence above the bay, fully furnished.',
    description: 'Designer-furnished with a wine wall, a chef’s kitchen and a long balcony over Biscayne Bay. Building amenities include a spa, rooftop pool and valet.',
    features: [F.conc, F.pool, F.gym, F.sea, F.smart], images: [int(4), int(2), ext(2), int(3)], focus: '60% 50%' },
  { id: 'p10', title: 'Hillcrest Manor', city: 'Beverly Hills', country: 'USA', type: 'Estate', status: 'sale', price: 23900000, beds: 9, baths: 12, area: 18400, lot: '2.1 acres', year: 2017, featured: true, agentId: 'a2',
    summary: 'A gated hillside manor with canyon-to-ocean views and a full resort wing.',
    description: 'Nine bedrooms, a 20-seat screening room, a bowling lane and a spa pavilion. Motor court for twelve cars and a separate gatehouse.',
    features: [F.pool, F.cinema, F.gym, F.spa, F.gate, F.garage, F.helipad, F.staff], images: [ext(1), int(4), ext(4), int(3)], focus: '50% 55%' },
  { id: 'p11', title: 'Azure Court', city: 'Cannes', country: 'France', type: 'Apartment', status: 'sale', price: 3600000, beds: 3, baths: 3, area: 2900, lot: 'La Croisette', year: 2016, featured: false, agentId: 'a4',
    summary: 'A Croisette apartment with sea-facing terraces and a private garage.',
    description: 'Moments from the Palais, this top-floor apartment offers two terraces, a marble-clad primary suite and a concierge-managed building with indoor pool.',
    features: [F.sea, F.conc, F.terrace, F.garage, F.pool], images: [int(2), int(3), ext(3), int(4)], focus: '50% 50%' },
  { id: 'p12', title: 'Olive Ridge Retreat', city: 'Ibiza', country: 'Spain', type: 'Villa', status: 'rent', price: 29000, beds: 6, baths: 6, area: 7200, lot: '3.0 acres', year: 2019, featured: false, agentId: 'a4',
    summary: 'A finca among olive groves, five minutes from the sea.',
    description: 'Stone terraces, an outdoor cinema and a yoga pavilion. Sleeps twelve across six suites; weekly or monthly rentals with housekeeping.',
    features: [F.pool, F.garden, F.gym, F.cinema, F.staff, F.terrace], images: [ext(3), int(1), ext(1), int(4)], focus: '50% 50%' },
]

// ---- Photos: every image below is used exactly once (no repeats across villas). ----
// [file, caption, note, kind]. Order = gallery order; the first photo is the card cover.
const SHOTS = {
  p1: [
    ['/img/v/p1-1.jpg', 'Front exterior', 'The façade and approach.', 'ext'],
    ['/img/v/p1-2.jpg', 'Living room', 'Double-height, light-filled and open to the outdoors.', 'living'],
    ['/img/v/p1-3.jpg', 'Master bedroom', 'A calm suite with layered lighting and a dressing area.', 'bed'],
    ['/img/v/p1-4.jpg', 'Grounds & exterior', 'Another view of the property and its setting.', 'ext'],
  ],
  p2: [
    ['/img/v/p2-1.jpg', 'Front exterior', 'The façade and approach.', 'ext'],
    ['/img/v/p2-2.jpg', 'Living room', 'Double-height, light-filled and open to the outdoors.', 'living'],
    ['/img/v/p2-3.jpg', 'Master bedroom', 'A calm suite with layered lighting and a dressing area.', 'bed'],
    ['/img/v/p2-4.jpg', 'Grounds & exterior', 'Another view of the property and its setting.', 'ext'],
  ],
  p3: [
    ['/img/v/p3-1.jpg', 'Front exterior', 'The façade and approach.', 'ext'],
    ['/img/v/p3-2.jpg', 'Living room', 'Double-height, light-filled and open to the outdoors.', 'living'],
    ['/img/v/p3-3.jpg', 'Master bedroom', 'A calm suite with layered lighting and a dressing area.', 'bed'],
    ['/img/v/p3-4.jpg', 'Grounds & exterior', 'Another view of the property and its setting.', 'ext'],
  ],
  p4: [
    ['/img/v/p4-1.jpg', 'Front exterior', 'The façade and approach.', 'ext'],
    ['/img/v/p4-2.jpg', 'Living room', 'Double-height, light-filled and open to the outdoors.', 'living'],
    ['/img/v/p4-3.jpg', 'Master bedroom', 'A calm suite with layered lighting and a dressing area.', 'bed'],
  ],
  p5: [
    ['/img/v/p5-1.jpg', 'Front exterior', 'The façade and approach.', 'ext'],
    ['/img/v/p5-2.jpg', 'Living room', 'Double-height, light-filled and open to the outdoors.', 'living'],
    ['/img/v/p5-3.jpg', 'Master bedroom', 'A calm suite with layered lighting and a dressing area.', 'bed'],
    ['/img/v/p5-4.jpg', 'Grounds & exterior', 'Another view of the property and its setting.', 'ext'],
  ],
  p6: [
    ['/img/v/p6-1.jpg', 'Front exterior', 'The façade and approach.', 'ext'],
    ['/img/v/p6-2.jpg', 'Living room', 'Double-height, light-filled and open to the outdoors.', 'living'],
    ['/img/v/p6-3.jpg', 'Chef’s kitchen', 'Island seating, full-height storage and professional appliances.', 'kitchen'],
    ['/img/v/p6-4.jpg', 'Grounds & exterior', 'Another view of the property and its setting.', 'ext'],
  ],
  p7: [
    ['/img/v/p7-1.jpg', 'Front exterior', 'The façade and approach.', 'ext'],
    ['/img/v/p7-2.jpg', 'Living room', 'Double-height, light-filled and open to the outdoors.', 'living'],
    ['/img/v/p7-3.jpg', 'Chef’s kitchen', 'Island seating, full-height storage and professional appliances.', 'kitchen'],
    ['/img/v/p7-4.jpg', 'Grounds & exterior', 'Another view of the property and its setting.', 'ext'],
  ],
  p8: [
    ['/img/v/p8-1.jpg', 'Front exterior', 'The façade and approach.', 'ext'],
    ['/img/v/p8-2.jpg', 'Living room', 'Double-height, light-filled and open to the outdoors.', 'living'],
    ['/img/v/p8-3.jpg', 'Spa bathroom', 'Marble, soaking tub and a view to match.', 'bath'],
    ['/img/v/p8-4.jpg', 'Grounds & exterior', 'Another view of the property and its setting.', 'ext'],
  ],
  p9: [
    ['/img/v/p9-1.jpg', 'Front exterior', 'The façade and approach.', 'ext'],
    ['/img/v/p9-2.jpg', 'Living room', 'Double-height, light-filled and open to the outdoors.', 'living'],
    ['/img/v/p9-3.jpg', 'Spa bathroom', 'Marble, soaking tub and a view to match.', 'bath'],
  ],
  p10: [
    ['/img/v/p10-1.jpg', 'Front exterior', 'The façade and approach.', 'ext'],
    ['/img/v/p10-2.jpg', 'Living room', 'Double-height, light-filled and open to the outdoors.', 'living'],
    ['/img/v/p10-3.jpg', 'Chef’s kitchen', 'Island seating, full-height storage and professional appliances.', 'kitchen'],
  ],
  p11: [
    ['/img/v/p11-1.jpg', 'Front exterior', 'The façade and approach.', 'ext'],
    ['/img/v/p11-2.jpg', 'Living room', 'Double-height, light-filled and open to the outdoors.', 'living'],
    ['/img/v/p11-3.jpg', 'Chef’s kitchen', 'Island seating, full-height storage and professional appliances.', 'kitchen'],
  ],
  p12: [
    ['/img/v/p12-1.jpg', 'Front exterior', 'The façade and approach.', 'ext'],
    ['/img/v/p12-2.jpg', 'Pool terrace', 'Loungers, shade and lawn beside the pool.', 'terrace'],
    ['/img/v/p12-3.jpg', 'Chef’s kitchen', 'Island seating, full-height storage and professional appliances.', 'kitchen'],
  ],
}

export const properties = base.map((p) => {
  const s = SHOTS[p.id] || []
  return {
    ...p,
    focus: '50% 50%',
    images: s.map((x) => x[0]),
    captions: s.map((x) => x[1]),
    // Interior rooms shown in the "Inside the residence" section
    rooms: s.filter((x) => x[3] !== 'ext').map((x) => ({ image: x[0], name: x[1], note: x[2] })),
  }
})
