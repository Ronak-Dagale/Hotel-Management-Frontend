import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import PrintBill from '../../components/PrintBill'
import { useReactToPrint } from 'react-to-print'

const Bill = () => {
  const { tableId } = useParams()
  const navigate = useNavigate()
  const [tableDetails, setTableDetails] = useState(null)
  const [totalAmount, setTotalAmount] = useState(0)
  const printRef = useRef()

  useEffect(() => {
    const fetchTableDetails = async () => {
      const token = localStorage.getItem('authToken')
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/tables/${tableId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setTableDetails(response.data)
        const total = response.data.order.reduce(
          (sum, item) => sum + item.qty * item.price,
          0
        )
        setTotalAmount(total)
      } catch (error) {
        console.error('Error fetching table details:', error)
      }
    }

    fetchTableDetails()
  }, [tableId])

  const handleDelete = async (item) => {
    console.log('Deleting item:', item)
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/tables/${tableId}/order`,
        {
          ...item,
          action: 'delete',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setTableDetails(response.data)
      const total = response.data.order.reduce(
        (sum, item) => sum + item.qty * item.price,
        0
      )
      setTotalAmount(total)
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const handleFreeTable = async () => {
    const token = localStorage.getItem('authToken')
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/tables/${tableId}/free`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      navigate('/owner/dashboard')
    } catch (error) {
      console.error('Error freeing table:', error)
    }
  }

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  })

  if (!tableDetails) {
    return <div>Loading...</div>
  }

  return (
    <div className='container'>
      <h1>Bill for Table {tableDetails.table_number}</h1>

      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tableDetails.order.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>{item.price}</td>
              <td>{item.qty * item.price}</td>
              <td>
                <button
                  className='btn btn-danger'
                  onClick={() => handleDelete(item)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className='text-center'>Total Amount: Rs. {totalAmount}</h2>

      <div className='text-center'>
        <button className='btn btn-success m-2' onClick={handleFreeTable}>
          Paid
        </button>
        <button className='btn btn-primary m-2' onClick={handlePrint}>
          Print
        </button>
      </div>

      <div style={{ display: 'none' }}>
        <PrintBill
          ref={printRef}
          tableDetails={tableDetails}
          totalAmount={totalAmount}
        />
      </div>
    </div>
  )
}

export default Bill
