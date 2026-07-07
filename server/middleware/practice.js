const DOMAIN_MAP = {
  'octavia-dental.co.uk':              'octavia-aesthetic',
  'www.octavia-dental.co.uk':          'octavia-aesthetic',
  'octaviahousedentalpractice.co.uk':  'octavia-house',
  'www.octaviahousedentalpractice.co.uk': 'octavia-house',
  'newoctaviadentalsurgery.com':        'new-octavia',
  'www.newoctaviadentalsurgery.com':    'new-octavia',
}

export function resolvePractice(req, _res, next) {
  req.practiceSlug = DOMAIN_MAP[req.hostname] || 'octavia-aesthetic'
  next()
}
