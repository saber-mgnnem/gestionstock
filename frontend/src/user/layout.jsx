
import { useState } from "react"
import "./dashboard.css"

// Component imports
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import TripCard from "./components/TripCard"
import StatsCard from "./components/StatsCard"
import DestinationCard from "./components/DestinationCard"
import WeatherWidget from "./components/WeatherWidget"

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Sample data
  const upcomingTrips = [
    {
      id: 1,
      destination: "Paris, France",
      startDate: "2023-06-15",
      endDate: "2023-06-22",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073",
      status: "confirmed",
    },
    {
      id: 2,
      destination: "Bali, Indonesia",
      startDate: "2023-08-03",
      endDate: "2023-08-17",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2938",
      status: "pending",
    },
  ]

  const popularDestinations = [
    {
      id: 1,
      name: "Santorini, Greece",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2574",
    },
    {
      id: 2,
      name: "Tokyo, Japan",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=2487",
    },
    {
      id: 3,
      name: "New York, USA",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2670",
    },
  ]

  const travelStats = [
    { title: "Countries Visited", value: 12, icon: "🌎" },
    { title: "Total Trips", value: 24, icon: "✈️" },
    { title: "Travel Miles", value: "34,287", icon: "📍" },
    { title: "Loyalty Points", value: "2,450", icon: "⭐" },
  ]

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="dashboard-container">
    <Sidebar isOpen={sidebarOpen} />

    <div className={`main-content ${sidebarOpen ? "" : "expanded"}`}>
      <Header toggleSidebar={toggleSidebar} />

      <div className="dashboard-content">
        <h1>Welcome back, Traveler!</h1>
        <p className="subtitle">Here's your travel overview and upcoming adventures</p>

        <div className="stats-container">
          {travelStats.map((stat) => (
            <StatsCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
          ))}
        </div>

        <div className="section">
          <div className="section-header">
            <h2>Your Upcoming Trips</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="trips-container">
            {upcomingTrips.map((trip) => (
              <TripCard
                key={trip.id}
                destination={trip.destination}
                startDate={trip.startDate}
                endDate={trip.endDate}
                image={trip.image}
                status={trip.status}
              />
            ))}
            <div className="add-trip-card">
              <div className="add-icon">+</div>
              <p>Plan a New Trip</p>
            </div>
          </div>
        </div>

        <div className="two-column-layout">
          <div className="section popular-destinations">
            <div className="section-header">
              <h2>Popular Destinations</h2>
              <button className="view-all-btn">Explore</button>
            </div>
            <div className="destinations-container">
              {popularDestinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  name={destination.name}
                  rating={destination.rating}
                  image={destination.image}
                />
              ))}
            </div>
          </div>

          <div className="section weather-section">
            <h2>Weather Forecast</h2>
            <WeatherWidget />
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Layout
