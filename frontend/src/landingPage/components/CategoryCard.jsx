import { Link } from "react-router-dom";
import "./CategoryCard.css";

const CategoryCard = ({ category }) => {
  // 🛠 Fix parsing the image
  const categoryImage = category.image || "/placeholder.svg"; // category.image is the correct field for the image

  // 🛠 Fix parsing the subcategories
  let parsedSubcategories = [];
  try {
    parsedSubcategories = category.subcategories ? JSON.parse(category.subcategories) : [];
  } catch (error) {
    console.error("Error parsing subcategories:", error);
  }

  return (
    <Link to={`/categories/${category.id}`} className="category-card">
      <div className="category-image-container">
        <img
          src={categoryImage}
          alt={category.name}
          className="category-image"
        />
      </div>
      <div className="category-info">
        <h3 className="category-name">{category.name}</h3>
        <p className="category-count">{parsedSubcategories.length} Collections</p>
      </div>
    </Link>
  );
};

export default CategoryCard;

