import React, { useState, useEffect } from 'react'

import { io } from 'socket.io-client'
const Table = () => {
  const [tables, setTables] = useState([])

  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_BASE_URL}`)
    // Fetch all tables on component mount
    const token = localStorage.getItem('authToken') // Retrieve the token from localStorage

    fetch(`${process.env.REACT_APP_BASE_URL}/api/tables`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        setTables(data)
      })
      .catch((error) => {
        console.error('Error fetching tables:', error)
      })

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

    return () => {
      socket.off('tableDeleted')
      socket.off('tableAdded')
    }
  }, [])

  const handleDeleteHighestTable = async () => {
    // Handle delete functionality
    const token = localStorage.getItem('authToken')
    try {
      // Retrieve the token from localStorage

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/tables/delete`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        )

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        // Handle successful deletion if needed
      } catch (error) {
        console.error('Error deleting tables:', error)
      }
      // Fetch the updated list of tables
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/tables`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const updatedTables = await response.json()
      setTables(updatedTables)
      // console.log('Deleted the table with the highest table number')
    } catch (error) {
      console.error('Error deleting table:', error)
    }
  }

  const handleAddNewTable = async () => {
    // Handle add new table functionality
    const token = localStorage.getItem('authToken')
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/tables/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      )
      const newTable = await response.json()
      setTables([...tables, newTable])
      // console.log('Added new table:', newTable.table_number)
    } catch (error) {
      console.error('Error adding table:', error)
    }
  }

  return (
    <div className='container'>
      <h2 className='text-center mt-5'>Table Information</h2>
      <div className='table-responsive'>
        <table className='table table-bordered'>
          <thead className='thead-dark'>
            <tr>
              <th scope='col'>Sr. No</th>
              <th scope='col'>Table Number</th>
              <th scope='col'>Status</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table, index) => (
              <tr key={table._id}>
                <td>{index + 1}</td>
                <td>{`Table Number ${table.table_number}`}</td>
                <td>{table.condition || 'Active'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className='btn btn-success' onClick={handleAddNewTable}>
        Add New Table
      </button>
      <button className='btn btn-danger m-2' onClick={handleDeleteHighestTable}>
        Delete Table{' '}
      </button>
    </div>
  )
}

export default Table
