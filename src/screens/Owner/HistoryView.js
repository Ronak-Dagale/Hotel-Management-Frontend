import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const HistoryOrderView = () => {
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)
  const { orderId } = useParams()

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem('authToken')
      console.log('Token:', token)

      if (!token) {
        setError('Authorization token is missing')
        return
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/history/${orderId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        )
        console.log(response.data)
        setOrder(response.data)
      } catch (error) {
        console.error('Error fetching order:', error)
        setError('Failed to fetch order data')
      }
    }

    fetchOrder()
  }, [orderId])

  if (error) {
    return (
      <div className='container mt-5'>
        <div className='alert alert-danger'>{error}</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className='container mt-5'>
        <div className='alert alert-info'>Loading...</div>
      </div>
    )
  }

  return (
    <div className='container mt-5'>
      <h1>Hotel Name</h1>
      <h2>Table - {order.table_number}</h2>

      <table className='table table-bordered mb-4'>
        <thead>
          <tr>
            <th>SR NO</th>
            <th>Table Number</th>
            <th>Item Name</th>
            <th>Qty</th>

            <th>Price</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {order.orders.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{order.table_number}</td>
              <td>{item.name}</td>
              <td>{item.qty}</td>

              <td>${item.price}</td>
              <td>${item.qty * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        <strong>Total Bill: </strong> ${order.total_bill}
      </p>
    </div>
  )
}

export default HistoryOrderView
