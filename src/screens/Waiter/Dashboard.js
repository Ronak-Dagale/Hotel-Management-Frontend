import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { io } from 'socket.io-client'
import Cards from '../../components/Cards'
import { useAuth } from '../../store/auth'

const Dashboard = () => {
  const socket = io(`${process.env.REACT_APP_BASE_URL}`)
  const navigate = useNavigate()
  const [tables, setTables] = useState([])
  const { auth } = useAuth()
  useEffect(() => {
    const fetchTablesData = () => {
      // const token = localStorage.getItem('authToken') // Retrieve the token from localStorage
      const { token } = auth
      if (!token) {
        console.error('No authentication token found')
        return
      }

      fetch(`${process.env.REACT_APP_BASE_URL}/api/tables/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Network response was not ok, status code: ${response.status}`
            )
          }
          return response.json()
        })
        .then((data) => {
          setTables(data)
        })
        .catch((error) => {
          console.error('Error fetching tables data:', error)
        })
    }

    fetchTablesData()
    socket.on('tableDeleted', (deletedTable) => {
      setTables((prevTables) =>
        prevTables.filter((table) => table._id !== deletedTable._id)
      )
      // console.log('Deleted table:', deletedTable)
    })

    socket.on('tableAdded', (newTable) => {
      // console.log('New table')
      setTables((prevTables) => [...prevTables, newTable])
    })

    socket.on('orderUpdated', (updatedTable) => {
      // console.log('Order updated')
      // setTables((prevTables) =>
      //   prevTables.map((table) =>
      //     table._id === updatedTable._id ? updatedTable : table
      //   )
      // )
      fetchTablesData()
    })

    socket.on('tableBooked', (bookedTable) => {
      setTables((prevTables) =>
        prevTables.map((table) =>
          table._id === bookedTable._id ? bookedTable : table
        )
      )
    })

    socket.on('tableFreed', (freedTable) => {
      // console.log('Table freed')
      fetchTablesData()
    })

    return () => {
      socket.off('tableDeleted')
      socket.off('tableAdded')
      socket.off('orderUpdated')
      socket.off('tableBooked')
      socket.off('tableFreed')
    }
  }, [])

  const freeTable = async (tableId) => {
    // const token = localStorage.getItem('authToken') // Retrieve the token from localStorage
    const { token } = auth
    try {
      await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/tables/${tableId}/free`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      )
    } catch (error) {
      console.error('Error freeing table:', error)
    }
  }

  const viewOrder = (tableNo) => {
    navigate(`/vieworder/${tableNo}`)
  }

  return (
    <div className='m-3'>
      <h1>Welcome Staff</h1>

      <div className='m-2'>
        <h2 className='text-center mt-5'>Occupied Tables</h2>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Table No</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tables
                .filter((table) => table.condition === 'running')
                .map((table) => (
                  <tr key={table.table_number}>
                    <td>{table.table_number}</td>
                    <td>
                      {/* <button
                        className='btn btn-primary m-2'
                        onClick={() => freeTable(table._id)}>
                        Free
                      </button> */}
                      <button
                        className='btn btn-primary'
                        onClick={() => viewOrder(table._id)}>
                        Order
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className='text-center mt-5'>All Tables</h2>
      <div className='row'>
        {tables.map((table) => (
          <div className='col-md-3' key={table.table_number}>
            <Cards
              isFree={table.condition === ''}
              tableNo={table.table_number}
              tabelId={table._id}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
