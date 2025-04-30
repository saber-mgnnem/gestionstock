
import { useState } from "react"
import { Outlet } from "react-router-dom"
import NavbarComponent from "./components/Navbar" // Adjust the path as needed
import SidebarComponent from "./components/Sidebar" // Adjust the path as needed

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <>
      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <NavbarComponent />
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div className={`sidebar ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
            <SidebarComponent />
          </div>
          <div className={`main-content ${isSidebarCollapsed ? "main-content-expanded" : ""}`}>
            <button className="sidebar-toggler" onClick={toggleSidebar}>
              {isSidebarCollapsed ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              )}
            </button>
            <section className="section">
              <div className="container-fluid">
                <Outlet />
              </div>
            </section>
          </div>
        </div>
      </div>

      <style>{`
        .main-content {
          height: 100%;
          overflow-y: auto;
          flex-grow: 1;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .container-fluid {
          width: 100%;
          padding-right: 30px;
          padding-left: 15px;
          margin-right: auto;
          margin-left: auto;
        }

        .section {
          padding: 10px;
        }

        .content {
          margin: 10px;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          background-color: #fff;
        }

        .sidebar {
          transition: all 0.3s ease;
          width: 250px;
          background-color: #f8f9fa;
          border-right: 1px solid #e9ecef;
          z-index: 1000;
        }

        .sidebar-collapsed {
          transform: translateX(-100%);
        }

        .sidebar-toggler {
          position: fixed;
          left: 240px;
          top: 20px;
          z-index: 1001;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #fff;
          border: 1px solid #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .main-content-expanded {
          margin-left: 0;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            height: 100%;
            transform: translateX(-100%);
          }
          
          .main-content {
            width: 100%;
            margin-left: 0;
          }
          
          .sidebar-toggler {
            display: flex;
          }
        }
      `}</style>
    </>
  )
}

export default Layout
