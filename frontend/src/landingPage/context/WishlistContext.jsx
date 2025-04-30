"use client"

import { createContext, useContext, useState, useEffect } from "react"

const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([])

  useEffect(() => {
    // Load wishlist from localStorage on client side
    const storedWishlist = localStorage.getItem("wishlist")
    if (storedWishlist) {
      try {
        setWishlistItems(JSON.parse(storedWishlist))
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage:", error)
        setWishlistItems([])
      }
    }
  }, [])

  useEffect(() => {
    // Save wishlist to localStorage whenever it changes
    if (wishlistItems.length > 0) {
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems))
    } else {
      localStorage.removeItem("wishlist")
    }
  }, [wishlistItems])

  const addToWishlist = (product) => {
    setWishlistItems((prevItems) => {
      // Check if item already exists in wishlist
      const exists = prevItems.some((item) => item.id === product.id)

      if (exists) {
        return prevItems
      } else {
        return [...prevItems, product]
      }
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId)
  }

  const clearWishlist = () => {
    setWishlistItems([])
    localStorage.removeItem("wishlist")
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
