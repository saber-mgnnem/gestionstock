"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [cartTotal, setCartTotal] = useState(0)

  useEffect(() => {
    // Load cart from localStorage on client side
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
        setCartItems([])
      }
    }
  }, [])

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    }

    // Calculate cart total
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setCartTotal(total)
  }, [cartItems])

  const addToCart = (product, quantity = 1, size = null, color = null) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.size === size && item.color === color,
      )

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      } else {
        // Add new item to cart
        return [
          ...prevItems,
          {
            ...product,
            quantity,
            size,
            color,
          },
        ]
      }
    })
  }

  const removeFromCart = (itemId, size = null, color = null) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === itemId && item.size === size && item.color === color)),
    )
  }

  const updateQuantity = (itemId, quantity, size = null, color = null) => {
    if (quantity < 1) return

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId && item.size === size && item.color === color) {
          return { ...item, quantity }
        }
        return item
      }),
    )
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem("cart")
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
