"use client"

import { useState, useCallback } from "react"

interface CheckoutFormData {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  zipCode?: string
  coupon?: string | null
  paymentMethod?: string
  cardNumber?: string
  cardName?: string
  cardExpiry?: string
  cardCVC?: string
}

export function useCheckout() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderData, setOrderData] = useState<any>(null)
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    coupon: null,
    paymentMethod: "stripe",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCVC: "",
  })

  const handlePlaceOrder = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Replace with actual API call to POST /api/checkout/
      // const response = await fetch(`/api/checkout/`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({
      //     items: cart.items.map(item => ({
      //       product_id: item.id,
      //       qty: item.quantity
      //     })),
      //     coupon_code: formData.coupon,
      //     shipping_info: {
      //       first_name: formData.firstName,
      //       last_name: formData.lastName,
      //       email: formData.email,
      //       phone: formData.phone,
      //       address: formData.address,
      //       city: formData.city,
      //       country: formData.country,
      //       zip_code: formData.zipCode
      //     },
      //     payment_method: formData.paymentMethod,
      //     payment_details: {
      //       card_number: formData.cardNumber,
      //       cardholder_name: formData.cardName,
      //       expiry: formData.cardExpiry,
      //       cvc: formData.cardCVC
      //     }
      //   })
      // })

      // Mock successful order placement
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockOrderResponse = {
        status: "success",
        orderId: "DV-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        total: 249.97,
        estimatedCashback: 22.5,
        email: formData.email,
      }

      setOrderData(mockOrderResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while placing your order. Please try again.")
      setIsLoading(false)
    }
  }, [formData])

  return {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    handlePlaceOrder,
    isLoading,
    error,
    orderData,
  }
}
