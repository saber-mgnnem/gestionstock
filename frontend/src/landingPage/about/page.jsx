import { Link } from "react-router-dom"
import "./about.css"

export default function AboutPage() {
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "Founder & CEO",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Sarah founded StyleHub in 2018 with a vision to create a fashion platform that combines style, quality, and affordability."
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "Creative Director",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Michael brings over 15 years of experience in fashion design and brand development to the StyleHub team."
    },
    {
      id: 3,
      name: "Jessica Williams",
      position: "Head of Operations",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Jessica ensures that StyleHub runs smoothly, from supply chain management to customer satisfaction."
    },
    {
      id: 4,
      name: "David Rodriguez",
      position: "Marketing Director",
      image: "/placeholder.svg?height=300&width=300",
      bio: "David leads our marketing efforts, bringing innovative strategies to connect StyleHub with fashion enthusiasts worldwide."
    }
  ]

  const testimonials = [
    {
      id: 1,
      name: "Emma Thompson",
      location: "New York, USA",
      image: "/placeholder.svg?height=100&width=100",
      text: "StyleHub has completely transformed my shopping experience. The quality of their clothes is exceptional, and their customer service is top-notch!"
    },
    {
      id: 2,
      name: "James Wilson",
      location: "London, UK",
      image: "/placeholder.svg?height=100&width=100",
      text: "I've been a loyal customer for over two years now. StyleHub consistently delivers trendy, high-quality clothing at reasonable prices."
    },
    {
      id: 3,
      name: "Sophia Garcia",
      location: "Toronto, Canada",
      image: "/placeholder.svg?height=100&width=100",
      text: "The variety of styles available at StyleHub is impressive. I always find exactly what I'm looking for, and their shipping is incredibly fast!"
    }
  ]

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <h1>Our Story</h1>
            <p>Discover the journey behind StyleHub and our commitment to fashion excellence</p>
          </div>
        </div>
      </div>

      <div className="container">
        <section className="about-section">
          <div className="about-content">
            <div className="about-text">
              <h2 className="section-title">Who We Are</h2>
              <p>
                Founded in 2018, StyleHub has grown from a small online boutique to a leading fashion destination. 
                We believe that everyone deserves to look and feel their best without breaking the bank.
              </p>
              <p>
                Our mission is to provide high-quality, trendy clothing that empowers individuals to express their 
                unique style. We carefully curate our collections to ensure that we offer the latest fashion trends 
                while maintaining our commitment to quality and affordability.
              </p>
              <p>
                At StyleHub, we're not just selling clothes – we're helping our customers build confidence through 
                fashion. Our team of fashion enthusiasts works tirelessly to bring you the best shopping experience 
                possible, from browsing our website to receiving your package.
              </p>
            </div>
            <div className="about-image">
              <img src="/placeholder.svg?height=400&width=500" alt="StyleHub store" />
            </div>
          </div>
        </section>

        <section className="about-section values-section">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🌟</div>
              <h3>Quality</h3>
              <p>We never compromise on the quality of our products, ensuring that each item meets our high standards.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Innovation</h3>
              <p>We constantly seek new ways to improve our products and services to provide the best experience.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h3>Sustainability</h3>
              <p>We're committed to reducing our environmental impact through responsible sourcing and practices.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3>Community</h3>
              <p>We value our community of customers and strive to build lasting relationships based on trust.</p>
            </div>
          </div>
        </section>

        <section className="about-section team-section">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-grid">
            {teamMembers.map(member => (
              <div className="team-card" key={member.id}>
                <div className="team-image">
                  <img src={member.image || "/placeholder.svg"} alt={member.name} />
                </div>
                <div className="team-info">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-position">{member.position}</p>
                  <p className="team-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section testimonials-section">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            {testimonials.map(testimonial => (
              <div className="testimonial-card" key={testimonial.id}>
                <div className="testimonial-content">
                  <p className="testimonial-text">"{testimonial.text}"</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-image">
                    <img src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                  </div>
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-location">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section cta-section">
          <div className="cta-content">
            <h2>Join the StyleHub Community</h2>
            <p>Discover the latest trends and exclusive offers by shopping with us today.</p>
            <div className="cta-buttons">
              <Link href="/shop" className="btn btn-primary">Shop Now</Link>
              <Link href="/contact" className="btn btn-outline">Contact Us</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
