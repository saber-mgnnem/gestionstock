import { Outlet } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { CartProvider } from "./context/CartContext"
import { WishlistProvider } from "./context/WishlistContext"
import { AuthProvider } from "./context/AuthContext"
import "./globals.css"

export default function Layout() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Header />
          <main>
            <Outlet /> {/* Renders the child page here! */}
          </main>
          <Footer />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

