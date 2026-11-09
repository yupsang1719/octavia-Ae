// Practices whose site has a /prices page (and no treatments list on the homepage)
export const PRICE_LIST_PRACTICES = ['octavia-aesthetic', 'new-octavia']

export const hasPriceList = slug => PRICE_LIST_PRACTICES.includes(slug)
