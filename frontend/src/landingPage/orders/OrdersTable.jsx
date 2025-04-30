import { useState, useEffect } from "react"
import "./orderstable.css"

export default function OrdersTable() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortField, setSortField] = useState("created_at")
  const [sortDirection, setSortDirection] = useState("desc")

  useEffect(() => {
    const fetchOrders = async () => {
      const user = localStorage.getItem('user');
      const parsedUser = JSON.parse(user);
      const userId = parsedUser?.id;
      if (!userId) {
        console.log("No user ID found");
        return;
      }

      setIsLoading(true)
      try {
        const response = await fetch(`http://localhost:5050/orders/user/${userId}`)
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setOrders(data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch orders. Please try again later.")
        console.error("Error fetching orders:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortField === "total_amount") {
      return sortDirection === "asc"
        ? parseFloat(a.total_amount) - parseFloat(b.total_amount)
        : parseFloat(b.total_amount) - parseFloat(a.total_amount)
    } else {
      return sortDirection === "asc"
        ? String(a[sortField]).localeCompare(String(b[sortField]))
        : String(b[sortField]).localeCompare(String(a[sortField]))
    }
  })

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (isLoading) return <div className="orders-loading">Loading orders...</div>
  if (error) return <div className="orders-error">{error}</div>

  return (
    <div className="orders-container mt-5">
      <h2>My Orders</h2>
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("order_number")}>
                Order #
                {sortField === "order_number" && <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>}
              </th>
              <th onClick={() => handleSort("created_at")}>
                Date
                {sortField === "created_at" && <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>}
              </th>
              <th onClick={() => handleSort("status")}>
                Status
                {sortField === "status" && <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>}
              </th>
              <th onClick={() => handleSort("total_amount")}>
                Total
                {sortField === "total_amount" && <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.order_number}</td>
                <td>{formatDate(order.created_at)}</td>
                <td>
                  <span className={`status-badge status-${order.status.toLowerCase()}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td>{formatCurrency(order.total_amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && <div className="no-orders">No orders found</div>}
    </div>
  )
}

