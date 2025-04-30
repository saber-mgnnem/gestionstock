export const products = [
    {
      id: "1",
      name: "Classic White T-Shirt",
      price: 24.99,
      category: "men",
      subcategory: "t-shirts",
      description: "A timeless classic white t-shirt made from 100% organic cotton for everyday comfort and style.",
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=600",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=600",
        "https://images.unsplash.com/photo-1527719327859-c6ce80353573?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=600"
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["white", "black", "gray"],
      rating: 4.5,
      reviews: 128,
      inStock: true,
      isNew: false,
      isSale: false,
      discount: 0,
    },
    {
      id: "2",
      name: "Slim Fit Jeans",
      price: 59.99,
      category: "men",
      subcategory: "jeans",
      description: "Modern slim fit jeans with a comfortable stretch fabric that moves with you throughout the day.",
      images: [
        "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=600",
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=600",
        "https://images.unsplash.com/photo-1475178626620-a4d074967452?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=600"
      ],
      sizes: ["28", "30", "32", "34", "36", "38"],
      colors: ["blue", "black", "gray"],
      rating: 4.3,
      reviews: 95,
      inStock: true,
      isNew: false,
      isSale: true,
      discount: 15,
    },
    {
      id: "3",
      name: "Floral Summer Dress",
      price: 49.99,
      category: "women",
      subcategory: "dresses",
      description: "A beautiful floral summer dress perfect for warm days and special occasions.",
      images: [
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=600",
        "https://images.unsplash.com/photo-1585487000160-6ebcfceb595d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=600",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=600"
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["blue", "pink", "yellow"],
      rating: 4.7,
      reviews: 156,
      inStock: true,
      isNew: true,
      isSale: false,
      discount: 0,
    },
    // ... (other products with similar image replacements)
  ];
  
  export const categories = [
    {
      id: "men",
      name: "Men",
      image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400",
      subcategories: ["t-shirts", "jeans", "shirts", "hoodies", "jackets"],
    },
    {
      id: "women",
      name: "Women",
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400",
      subcategories: ["dresses", "tops", "jeans", "skirts", "jackets"],
    },
    // ... (other categories with similar image replacements)
  ];