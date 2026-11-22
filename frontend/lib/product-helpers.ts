// Helper functions for product formatting

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

export function calculateCashback(price: number, percent: number): number {
  return (price * percent) / 100
}

export function calculateDiscount(originalPrice: number, salePrice: number): number {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

export function generateProductSchema(product: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.image,
    url: `/products/${product.id}`,
    sku: product.id,
    offers: {
      "@type": "Offer",
      url: `/products/${product.id}`,
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      priceCurrencyStandard: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.ratingCount,
    },
  }
}
