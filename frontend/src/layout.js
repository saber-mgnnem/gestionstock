import { Link } from "react-router-dom"
import "./styles.css"

export default function Home() {
  return (
    <div className="home-container">
      <div className="auth-card">
        <div className="card-header">

          <img src="/images/logo.png"alt="Inventory Management System Logo" width={100} height={100} className="logo" />
          <h1 className="title">Inventory Management System</h1>
          <p className="subtitle">Manage your inventory efficiently and effectively</p>
        </div>

        <div className="button-container">
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
          <Link to="/register" className="btn btn-outline">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}
