// Locale-independent contact / link data shared across pages.
export const profile = {
  email: 'lucas.smds1728@gmail.com',
  phone: '+55 (32) 98462-3535',
  phoneHref: 'tel:+5532984623535',
  linkedin: {
    label: 'linkedin.com/in/lcasm',
    href: 'https://www.linkedin.com/in/lcasm',
  },
  github: {
    label: 'github.com/Lcasmendes',
    href: 'https://github.com/Lcasmendes',
  },
} as const;

// Order of sections used by the radial navigation wheel.
export const sections = [
  { key: 'about', href: '/' },
  { key: 'journey', href: '/journey' },
  { key: 'projects', href: '/projects' },
  { key: 'skills', href: '/skills' },
] as const;
