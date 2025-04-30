import "./TripCard.css"

const TripCard = ({ destination, startDate, endDate, image, status }) => {
  // Format dates
  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const startFormatted = formatDate(startDate)
  const endFormatted = formatDate(endDate)

  return (
    <div className="trip-card">
      <div className="trip-image" style={{ backgroundImage: `url(${image})` }}>
        <div className={`trip-status ${status}`}>{status}</div>
      </div>
      <div className="trip-details">
        <h3>{destination}</h3>
        <div className="trip-dates">
          <span className="date-icon">📅</span>
          <span>
            {startFormatted} - {endFormatted}
          </span>
        </div>
        <div className="trip-actions">
          <button className="trip-btn details-btn">View Details</button>
          <button className="trip-btn itinerary-btn">Itinerary</button>
        </div>
      </div>
    </div>
  )
}

export default TripCard
