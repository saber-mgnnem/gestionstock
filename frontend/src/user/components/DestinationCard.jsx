import React from 'react';
import './DestinationCard.css';

const DestinationCard = ({ name, rating, image }) => {
  // Generate stars based on rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    const stars = [];

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="star full">
          ★
        </span>
      );
    }

    // Half star (if applicable)
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">
          ★
        </span>
      );
    }

    // Empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty">
          ★
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="destination-card">
      {/* Destination image with background */}
      <div
        className="destination-image"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="destination-overlay">
          <button className="explore-btn" type="button">
            Explore
          </button>
        </div>
      </div>

      {/* Destination details */}
      <div className="destination-details">
        <h3>{name}</h3>
        <div className="rating">
          {/* Displaying stars */}
          <div className="stars">{renderStars(rating)}</div>
          <span className="rating-value">{rating}</span>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;

