import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from "./auth/Login"
import Register from "./auth/Register"
import AdminDashboard from "./admin/Layout"
import UserDashboard from "./user/layout"
import ProtectedRoute from './ProtectedRoute'
import Users from "./admin/components/Clients"
import Layout from './landingPage/layout'
import LandingPage from "./landingPage/page" // <- Home page
import ShopPage from './landingPage/shop/page' // <- Shop page
import ContactPage from './landingPage/contact/page'
import AboutPage from './landingPage/about/page'
import Dashboard from "./admin/components/dashboard"
import Cart from "./landingPage/cart/page"
import AdminCategory from './admin/components/Category'
import AdminProducts from './admin/components/Products'
import AdminOrders from "./admin/components/Orders"
import Checkout from "./landingPage/checkout/page"
import OrdresUser from "./landingPage/orders/OrdersTable"
import EmployeDashboard from "./landingPage/caissier/caissier"
import BoutiqueOrders from './admin/components/BoutiqueOrders'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* All public pages share Layout (header/footer) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} /> {/* Home page */}
          <Route path="shop" element={<ShopPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="/ordres" element={<OrdresUser />} />

          
        </Route>

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Layout />
            </ProtectedRoute>
          }
        >
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />


        </Route>
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="users" element={<Users />} />
          <Route path="adminDashboard" element={<Dashboard />} />
          <Route path="categorys" element={<AdminCategory />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="ordersboutique" element={<BoutiqueOrders />} />

        </Route>

        <Route
          path="/employe-dashboard"
          element={
            <ProtectedRoute allowedRoles={['employ']}>
              <EmployeDashboard />
            </ProtectedRoute>
          }
        >
         
        </Route>

        {/* Optional: Unauthorized */}
        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
