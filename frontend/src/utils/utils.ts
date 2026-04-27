export const getImageUrl = (imagePath: string | undefined | null) => {
  if (!imagePath) return ''

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081'
  return `${backendUrl}${imagePath}`
}

/** Format tiền tệ VND */
export const formatCurrency = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })
    .format(price)
    .replace(/\s*₫$/, ' đ')
}
