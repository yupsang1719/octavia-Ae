import { STATUS_STYLES } from '../../../data/stockConstants'

const LABELS = { ORDER_NOW: 'Order now', LOW: 'Low', OK: 'OK' }

export default function StockStatusBadge({ status }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium font-sans whitespace-nowrap ${STATUS_STYLES[status] || STATUS_STYLES.OK}`}>
      {LABELS[status] || status}
    </span>
  )
}
