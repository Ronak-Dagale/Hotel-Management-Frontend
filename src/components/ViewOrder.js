import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import OrderCard from './OrderCard'
import axios from 'axios'
import io from 'socket.io-client'
import { useAuth } from '../store/auth'

const socket = io(`${process.env.REACT_APP_BASE_URL}`)

const ViewOrder = () => {
  const { tableId } = useParams()
  const [tableNo, setTableNo] = useState('')
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [confirmedOrders, setConfirmedOrders] = useState([])
  const [categories, setCategories] = useState([])

  const { auth } = useAuth()
  useEffect(() => {
    const fetchItems = async () => {
      // const token = localStorage.getItem('authToken')
      const { token } = auth
      // console.log('Token:', token)
      try {
        // Book the table
        await axios.put(
          `${process.env.REACT_APP_BASE_URL}/api/tables/${tableId}/book`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        )

        // Fetch table details
        const tableResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/tables/${tableId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        )
        setTableNo(tableResponse.data.table_number)

        // Fetch active items
        const itemsResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/fooditems/`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        )
        const activeItems = itemsResponse.data
          .filter((item) => item.status === 'Active')
          .map((item) => ({ ...item, qty: 0 })) // Add qty field with initial value of 0
        setItems(activeItems)
        setConfirmedOrders(tableResponse.data.order)
        setFilteredItems(activeItems)
      } catch (error) {
        console.error('Error fetching items:', error)
      }
    }

    const fetchCategories = async () => {
      const { token } = auth
      try {
        const categoriesResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/foodcategory`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        )
        const activeCategories = categoriesResponse.data.filter(
          (category) => category.status === 'Active'
        )
        setCategories(activeCategories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchItems()
    fetchCategories()
  }, [tableId])

  useEffect(() => {
    if (searchQuery) {
      searchItems()
    } else if (selectedCategory) {
      filterItems(selectedCategory)
    } else {
      setFilteredItems(items)
    }
  }, [items, searchQuery, selectedCategory])

  const searchItems = () => {
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredItems(filtered)
  }

  const filterItems = (category) => {
    const filtered = items.filter((item) => item.category === category)
    setFilteredItems(filtered)
    setSelectedCategory(category)
  }

  const adjustQuantity = (itemId, amount) => {
    const updatedItems = items.map((item) => {
      if (item._id === itemId) {
        const newQty = item.qty + amount
        return { ...item, qty: newQty >= 0 ? newQty : 0 }
      }
      return item
    })
    setItems(updatedItems)
  }

  const confirmOrder = async (itemId) => {
    const itemToConfirm = items.find((item) => item._id === itemId)
    // console.log('Item to confirm:', itemToConfirm)
    const { token } = auth
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/tables/${tableId}/order`,
        {
          name: itemToConfirm.name,
          qty: itemToConfirm.qty,
          status: 'pending',
          price: itemToConfirm.price,
          total_price: itemToConfirm.qty * itemToConfirm.price,
          note: itemToConfirm.note || '',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      )

      setConfirmedOrders(response.data.order)

      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, qty: 0, note: '' } : item
        )
      )
      setFilteredItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, qty: 0, note: '' } : item
        )
      )
    } catch (error) {
      console.error('Error confirming order:', error)
    }
  }

  const deleteItem = async (item) => {
    // const token = localStorage.getItem('authToken')
    const { token } = auth
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/tables/${tableId}/order`,
        {
          ...item,
          action: 'delete',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      )
      setConfirmedOrders(response.data.order)
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  useEffect(() => {
    socket.on('orderUpdated', (updatedTable) => {
      if (updatedTable._id === tableId) {
        setConfirmedOrders(updatedTable.order)
      }
    })

    socket.on('tableDeleted', (deletedTable) => {
      if (deletedTable._id === tableId) {
        setTableNo(null)
        setItems([])
        setConfirmedOrders([])
      }
    })

    socket.on('orderStatusOngoing', (receivedTableId, updatedOrderItem) => {
      if (receivedTableId === tableId) {
        setConfirmedOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === updatedOrderItem._id
              ? { ...order, status: 'ongoing' }
              : order
          )
        )
      }
    })

    socket.on('orderStatusDone', (receivedTableId, updatedOrderItem) => {
      if (receivedTableId === tableId) {
        setConfirmedOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === updatedOrderItem._id
              ? { ...order, status: 'done' }
              : order
          )
        )
      }
    })

    return () => {
      socket.off('orderUpdated')
      socket.off('tableDeleted')
      socket.off('orderStatusOngoing')
      socket.off('orderStatusDone')
    }
  }, [tableId])

  return (
    <div className='container'>
      <h1>Hotel Name</h1>
      <h2>Table- {tableNo}</h2>

      <table className='table table-bordered mb-4'>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Qty</th>
            <th>Status</th>
            <th>Price</th>
            <th>Total Price</th>
            <th>Note</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {confirmedOrders.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>{item.status}</td>
              <td>{item.price}</td>
              <td>{item.qty * item.price}</td>
              <td>{item.note}</td>
              <td>
                {item.status === 'pending' ? (
                  <button
                    className='btn btn-danger btn-sm'
                    onClick={() => deleteItem(item)}>
                    Delete
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        Total Amount Rs.{' '}
        {confirmedOrders.reduce((acc, cur) => acc + cur.qty * cur.price, 0)}
      </p>

      <form className='mb-4'>
        <div className='input-group'>
          <input
            type='text'
            className='form-control'
            placeholder='Search items...'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              searchItems()
            }}
          />
          <div className='input-group-append'>
            <button
              className='btn btn-primary'
              type='button'
              onClick={searchItems}>
              Search
            </button>
          </div>
        </div>
      </form>

      <h2>Categories</h2>
      <div className='btn-group mb-4'>
        {categories.map((category) => (
          <button
            key={category._id}
            className={`btn btn-outline-primary ${
              selectedCategory === category.categoryname && 'active'
            }`}
            onClick={() => filterItems(category.categoryname)}>
            {category.categoryname}
          </button>
        ))}
      </div>

      <h2>Items</h2>
      <div className='row'>
        {filteredItems.map((item, index) => (
          <div key={index} className='col-12 col-md-6 col-lg-4 mb-3'>
            <OrderCard
              item={item}
              updateOrderQuantity={adjustQuantity}
              confirmOrder={confirmOrder}
              deleteItem={deleteItem}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ViewOrder
