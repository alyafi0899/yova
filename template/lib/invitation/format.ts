export function formatPrice(price: number): string {
  if (!price) return 'Rp0'
  return `Rp${price.toLocaleString('id-ID')}`
}
