// lines: [{ itemId, expectedQty, countedQty }] — countedQty null/undefined/'' means blank (skipped).
// Positive variance (expected > counted) = consumption since last count.
// Negative variance (counted > expected) = surplus found, corrects stock upward.
export function reconcileCount(lines) {
  const adjustments = []
  let matched = 0
  let skipped = 0

  const results = lines.map(({ itemId, expectedQty, countedQty }) => {
    if (countedQty === null || countedQty === undefined || countedQty === '') {
      skipped++
      return { itemId, expectedQty, countedQty: null, variance: null }
    }

    const variance = expectedQty - countedQty
    if (variance === 0) {
      matched++
      return { itemId, expectedQty, countedQty, variance: 0 }
    }

    adjustments.push({
      itemId,
      qty: variance,
      reason: 'count_adjustment',
      note: `Count: expected ${expectedQty}, counted ${countedQty}`,
    })
    return { itemId, expectedQty, countedQty, variance }
  })

  return {
    lines: results,
    adjustments,
    summary: { adjusted: adjustments.length, matched, skipped, total: lines.length },
  }
}
