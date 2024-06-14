import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import { useAuth } from '../../store/auth'
const socket = io(`${process.env.REACT_APP_BASE_URL}`) // Replace with your actual server URL

const Dashboard = () => {
  const [workingOrders, setWorkingOrders] = useState([])
  const [pendingOrders, setPendingOrders] = useState([])
  const [doneOrders, setDoneOrders] = useState([])
  const [tables, setTables] = useState([])
  const { auth } = useAuth()
  useEffect(() => {
    const fetchTables = async () => {
      // const token = localStorage.getItem('authToken')
      const { token } = auth
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/tables`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        )

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        setTables(data) // Update state with fetched tables
      } catch (error) {
        console.error('Error fetching tables:', error)
      }
    }
    fetchTables()

    const handleTableDeleted = (deletedTable) => {
      // setTables((prevTables) =>
      //   prevTables.filter((table) => table._id !== deletedTable._id)
      // )
      // console.log('Deleted table:', deletedTable)
      fetchTables()
    }

    const handleTableAdded = (newTable) => {
      // console.log('New table')
      // setTables((prevTables) => [...prevTables, newTable])
      fetchTables()
    }

    const handleOrderTaken = (tableId, order) => {
      // console.log('orderTaken')
      // appendOrderToTable(tableId, order)
      // const tableNumber = findTableNumber(tableId)
      // const orderWithTableInfo = {
      //   ...order,
      //   table_number: tableNumber,
      //   table_id: tableId,
      // }
      // setPendingOrders((prevPendingOrders) => [
      //   ...prevPendingOrders,
      //   orderWithTableInfo,
      // ])
      fetchTables()
    }

    const handleOrderDeleted = (tableId, order) => {
      // console.log('orderDeleted')
      // setTables((prevTables) => {
      //   const newTables = prevTables.map((table) => {
      //     if (table._id === tableId && table.order) {
      //       const updatedOrders = table.order.filter((o) => o._id !== order._id)
      //       return { ...table, orders: updatedOrders }
      //     }
      //     return table
      //   })
      //   return newTables
      // })

      // setPendingOrders((prevPendingOrders) =>
      //   prevPendingOrders.filter((o) => o._id !== order._id)
      // )
      fetchTables()
    }

    const handleOrderStatusOngoing = (tableId, order) => {
      // console.log('orderStatusOngoing')
      // setPendingOrders((prevOrders) =>
      //   prevOrders.filter((o) => o._id !== order._id)
      // )
      // setWorkingOrders((prevWorkingOrders) => [
      //   ...prevWorkingOrders,
      //   { ...order, status: 'ongoing' },
      // ])

      // setTables((prevTables) => {
      //   return prevTables.map((table) => {
      //     if (table._id === tableId) {
      //       if (!Array.isArray(table.order)) {
      //         return table
      //       }
      //       const updatedOrders = table.order.map((o) =>
      //         o._id === order._id ? { ...o, status: 'ongoing' } : o
      //       )
      //       return { ...table, orders: updatedOrders }
      //     }
      //     return table
      //   })
      // })
      fetchTables()
    }

    const handleOrderStatusDone = (tableId, order) => {
      // console.log('orderStatusDone')
      // if (order) {
      //   setWorkingOrders((prevWorkingOrders) =>
      //     prevWorkingOrders.filter((o) => o._id !== order._id)
      //   )

      //   setDoneOrders((prevDoneOrders) => [
      //     ...prevDoneOrders,
      //     { ...order, status: 'done' },
      //   ])

      //   setTables((prevTables) =>
      //     prevTables.map((table) => {
      //       if (table._id === tableId) {
      //         const updatedOrders = table.order.map((o) =>
      //           o._id === order._id ? { ...o, status: 'done' } : o
      //         )
      //         return { ...table, orders: updatedOrders }
      //       }
      //       return table
      //     })
      //   )
      // } else {
      //   console.warn('Order object is undefined')
      // }
      fetchTables()
    }

    const handleTableFreed = (tableId) => {
      // console.log('tableFreed')
      // setTables((prevTables) => {
      //   const newTables = prevTables.map((table) => {
      //     if (table._id === tableId) {
      //       const updatedOrders = table.order.map((order) => ({
      //         ...order,
      //         status: 'done',
      //       }))
      //       return { ...table, orders: updatedOrders, condition: '' }
      //     }
      //     return table
      //   })
      //   updateOrders(newTables)
      //   return newTables
      // })

      // const removeOrdersByTableId = (tableId) => {
      //   setWorkingOrders((prevWorkingOrders) =>
      //     prevWorkingOrders.filter((order) => order.table_id !== tableId)
      //   )
      //   setPendingOrders((prevPendingOrders) =>
      //     prevPendingOrders.filter((order) => order.table_id !== tableId)
      //   )
      //   setDoneOrders((prevDoneOrders) =>
      //     prevDoneOrders.filter((order) => order.table_id !== tableId)
      //   )
      // }

      // removeOrdersByTableId(tableId)
      fetchTables()
    }

    socket.on('tableDeleted', handleTableDeleted)
    socket.on('tableAdded', handleTableAdded)
    socket.on('orderTaken', handleOrderTaken)
    socket.on('orderDeleted', handleOrderDeleted)
    socket.on('orderStatusOngoing', handleOrderStatusOngoing)
    socket.on('orderStatusDone', handleOrderStatusDone)
    socket.on('tableFreed', handleTableFreed)

    return () => {
      socket.off('tableDeleted', handleTableDeleted)
      socket.off('tableAdded', handleTableAdded)
      socket.off('orderTaken', handleOrderTaken)
      socket.off('orderDeleted', handleOrderDeleted)
      socket.off('orderStatusOngoing', handleOrderStatusOngoing)
      socket.off('orderStatusDone', handleOrderStatusDone)
      socket.off('tableFreed', handleTableFreed)
    }
  }, [])

  useEffect(() => {
    if (tables.length > 0) {
      updateOrders(tables)
    }
  }, [tables])

  useEffect(() => {
    // console.log('workingOrders:', workingOrders)
  }, [workingOrders])

  const updateOrders = (tablesData) => {
    const working = []
    const pending = []
    const done = []

    tablesData.forEach((table) => {
      table.order.forEach((order) => {
        if (order.status === 'pending') {
          pending.push({
            ...order,
            table_number: table.table_number,
            table_id: table._id,
          })
        } else if (order.status === 'ongoing') {
          working.push({
            ...order,
            table_number: table.table_number,
            table_id: table._id,
          })
        } else if (order.status === 'done') {
          done.push({
            ...order,
            table_number: table.table_number,
            table_id: table._id,
          })
        }
      })
    })

    pending.sort((a, b) => new Date(a.date) - new Date(b.date))

    setWorkingOrders(working)
    setPendingOrders(pending)
    setDoneOrders(done)
  }

  const findTableNumber = (tableId) => {
    const table = tables.find((table) => table._id === tableId)
    return table ? table.table_number : null
  }

  const appendOrderToTable = (tableId, order) => {
    setTables((prevTables) => {
      const newTables = prevTables.map((table) => {
        if (table._id === tableId) {
          const updatedOrders = [...table.order, order]
          return { ...table, order: updatedOrders }
        }
        return table
      })
      return newTables
    })
  }

  const handleAction = async (order, action) => {
    // console.log('from handleaction : ')
    // console.log(order)
    // console.log(action)
    // const token = localStorage.getItem('authToken')
    const { token } = auth
    try {
      if (action === 'Accept') {
        try {
          const response = await axios.put(
            `${process.env.REACT_APP_BASE_URL}/api/tables/${order.table_id}/order/ongoing`,
            order,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
              },
            }
          )
          setPendingOrders((prevOrders) =>
            prevOrders.filter((o) => o._id !== order._id)
          )
          setWorkingOrders((prevOrders) => [
            ...prevOrders,
            { ...order, status: 'ongoing' },
          ])
          updateOrderStatusInTable(order.table_id, order, 'ongoing')
        } catch (error) {
          console.error('Error:', error.message)
        }
      } else if (action === 'Done') {
        try {
          const response = await axios.put(
            `${process.env.REACT_APP_BASE_URL}/api/tables/${order.table_id}/order/done`,
            order,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
              },
            }
          )
          setWorkingOrders((prevOrders) =>
            prevOrders.filter((o) => o._id !== order._id)
          )
          setDoneOrders((prevOrders) => [
            ...prevOrders,
            { ...order, status: 'done' },
          ])
          updateOrderStatusInTable(order.table_id, order, 'done')
        } catch (error) {
          console.error('Error:', error.message)
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const updateOrderStatusInTable = (tableId, order, status) => {
    setTables((prevTables) => {
      const newTables = prevTables.map((table) => {
        if (table._id === tableId) {
          const updatedOrders = table.order.map((o) =>
            o._id === order._id ? { ...o, status } : o
          )
          return { ...table, order: updatedOrders }
        }
        return table
      })
      return newTables
    })
  }

  return (
    <div className='container'>
      <h1 className='text-center'>Dashboard</h1>

      {/* Ongoing Section */}
      <div>
        <h2 className='text-center mt-5'>Ongoing</h2>
        <div className='table-responsive'>
          <table className='table table-sm'>
            <thead>
              <tr>
                <th>Table No</th>
                <th>Order</th>
                <th>Quantity</th>
                <th>Note</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {workingOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order.table_number}</td>
                  <td>{order.name}</td>
                  <td>{order.qty}</td>
                  <td>{order.note}</td>
                  <td>
                    <button
                      className='btn btn-primary'
                      onClick={() => handleAction(order, 'Done')}>
                      Done
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Section */}
      <div>
        <h2 className='text-center mt-5'>Pending</h2>
        <div className='table-responsive'>
          <table className='table table-sm'>
            <thead>
              <tr>
                <th>Table No</th>
                <th>Order</th>
                <th>Quantity</th>
                <th>Note</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order.table_number}</td>
                  <td>{order.name}</td>
                  <td>{order.qty}</td>
                  <td>{order.note}</td>
                  <td>
                    <button
                      className='btn btn-primary'
                      onClick={() => handleAction(order, 'Accept')}>
                      Accept
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Done Section */}
      <div>
        <h2 className='text-center mt-5'>Done</h2>
        <div className='table-responsive'>
          <table className='table table-sm'>
            <thead>
              <tr>
                <th>Table No</th>
                <th>Order</th>
                <th>Quantity</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {doneOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order.table_number}</td>
                  <td>{order.name}</td>
                  <td>{order.qty}</td>
                  <td>{order.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
