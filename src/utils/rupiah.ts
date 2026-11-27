const digits = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 })

/** `10000000` → `10.000.000`, for places that draw "Rp" on their own. */
export function formatDigits(amount: number) {
  return digits.format(amount)
}

/** `10000000` → `Rp 10.000.000` */
export function formatRupiah(amount: number) {
  return `Rp ${formatDigits(amount)}`
}

/** `-5000` → `−Rp 5.000`, `5000` → `+Rp 5.000` */
export function formatSignedRupiah(amount: number) {
  return `${amount < 0 ? '−' : '+'}${formatRupiah(Math.abs(amount))}`
}
