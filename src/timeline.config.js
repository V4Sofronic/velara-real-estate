/**
 * Retime the film or change its copy HERE. Values are global scroll progress 0..1.
 * Clip durations are read from the video files, so any length works.
 */
export const timeline = {
  brand: 'VELARA',

  clip1: { src: '/assets/sequence-01.mp4' },
  clip2: { src: '/assets/sequence-02.mp4' },

  // Where clip 1 hands over to clip 2; the still fades across +/- halfWidth to hide the join.
  seam: { at: 0.5, halfWidth: 0.025, image: '/assets/exploded-anchor.png', peakOpacity: 1 },

  scroll: { desktopVh: 700, mobileVh: 480, mobileBreakpoint: 768 },
  feel: { smoothing: 9 },
  framing: { desktop: '50% 50%', mobile: '50% 50%' },

  hero: {
    eyebrow: 'VELARA / PRIVATE ESTATES',
    lines: ['LIVE ABOVE', 'THE ORDINARY.'],
    body: 'Scroll to walk through the gates.',
    side: 'left', in: [0, 0], out: [0.04, 0.09],
  },
  chapters: [
    { id: 'arrival', num: '01', name: 'ARRIVAL', range: [0, 0.25],
      lines: ['A ROAD THAT ENDS', 'AT A VIEW.'],
      body: 'Private gates open onto stone drives, lit gardens and the first glimpse of the sea.',
      side: 'right', in: [0.10, 0.14], out: [0.20, 0.25] },
    { id: 'estate', num: '02', name: 'ESTATE', range: [0.25, 0.5],
      lines: ['ACRES OF QUIET.', 'ONE SKYLINE.'],
      body: 'Pool, courts and terraces, composed like a landscape rather than a plot.',
      side: 'left', in: [0.29, 0.34], out: [0.43, 0.47] },
    { id: 'interior', num: '03', name: 'INTERIOR', range: [0.5, 0.77],
      lines: ['STEP INSIDE', 'THE CALM.'],
      body: 'Warm timber, travertine floors and light that follows you from room to room.',
      side: 'right', in: [0.56, 0.60], out: [0.70, 0.75] },
    { id: 'horizon', num: '04', name: 'HORIZON', range: [0.77, 1],
      lines: ['THE SEA,', 'FRAMED.'],
      body: 'Every Velara residence is chosen for what it looks out on. Browse the collection.',
      side: 'left', in: [0.82, 0.87], out: [1.1, 1.2],
      cta: { label: 'Explore properties', to: '/properties' } },
  ],
}
