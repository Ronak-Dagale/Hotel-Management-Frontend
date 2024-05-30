import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CompletedOrdersPage = () => {
  const [completedOrders, setCompletedOrders] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      const token = localStorage.getItem('authToken')
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/history/`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        )
        setCompletedOrders(response.data)
      } catch (error) {
        console.error('Error fetching completed orders:', error)
      }
    }
    fetchCompletedOrders()
  }, [])

  const handleViewOrder = (orderId) => {
    navigate(`/owner/history/${orderId}`)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDeleteAll = async () => {
    const token = localStorage.getItem('authToken')
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/history/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      setCompletedOrders([]) // Clear the state after successful deletion
      alert('All completed orders have been deleted.')
    } catch (error) {
      console.error('Error deleting completed orders:', error)
      alert('Failed to delete completed orders.')
    }
  }

  return (
    <div className='container'>
      <h1>Hotel Name</h1>
      <div className='d-flex justify-content-between mb-3'>
        <button className='btn btn-secondary' onClick={handlePrint}>
          Print
        </button>
        <button className='btn btn-danger' onClick={handleDeleteAll}>
          Delete All
        </button>
      </div>
      <table className='table table-bordered mb-4'>
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Table Number</th>
            <th>Time</th>
            <th>Total Bill</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {completedOrders.map((order, index) => (
            <tr key={order._id}>
              <td>{index + 1}</td>
              <td>{order.table_number}</td>
              <td>{new Date(order.timestamp).toLocaleString()}</td>
              <td>${order.total_bill}</td>
              <td>
                <button
                  className='btn btn-primary'
                  onClick={() => handleViewOrder(order._id)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CompletedOrdersPage
