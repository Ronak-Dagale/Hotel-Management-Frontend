import React, { useState, useEffect } from 'react'
import axios from 'axios'
import EditFoodItemModal from './EditFoodItemModal'
import { useAuth } from '../../store/auth'
const FoodItem = () => {
  const [foodItems, setFoodItems] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedFoodItem, setSelectedFoodItem] = useState(null)
  const [editModalShow, setEditModalShow] = useState(false)
  const { auth } = useAuth()
  useEffect(() => {
    fetchFoodItems()
    fetchCategories()
  }, [])

  const fetchFoodItems = async () => {
    // const token = localStorage.getItem('authToken')
    const { token } = auth
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/fooditems/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      ) // Update endpoint if necessary
      setFoodItems(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchCategories = async () => {
    // const token = localStorage.getItem('authToken')
    const { token } = auth
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/foodcategory/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setCategories(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (foodItem) => {
    setSelectedFoodItem(foodItem)
    setEditModalShow(true)
  }

  const handleDelete = async (id) => {
    // const token = localStorage.getItem('authToken')
    const { token } = auth
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/fooditems/delete/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      ) // Update endpoint if necessary
      fetchFoodItems()
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddFoodItem = () => {
    setSelectedFoodItem(null)
    setEditModalShow(true)
  }

  const closeModal = () => {
    setSelectedFoodItem(null)
    setEditModalShow(false)
  }

  const toggleStatus = async (id) => {
    const updatedFoodItem = foodItems.find((item) => item._id === id)
    // console.log(updatedFoodItem)
    updatedFoodItem.status =
      updatedFoodItem.status === 'Active' ? 'Inactive' : 'Active'
    // const token = localStorage.getItem('authToken')
    const { token } = auth
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/fooditems/update/${id}`,
        updatedFoodItem,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      ) // Update endpoint if necessary
      fetchFoodItems()
    } catch (err) {
      console.error(err)
    }
  }

  const saveFoodItem = async (updatedFoodItem) => {
    // const token = localStorage.getItem('authToken')
    const { token } = auth
    if (selectedFoodItem) {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/fooditems/update/${updatedFoodItem.id}`,
        updatedFoodItem,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      ) // Update endpoint if necessary
    } else {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/fooditems/add`,
        updatedFoodItem,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      ) // Update endpoint if necessary
    }
    fetchFoodItems()
    closeModal()
  }

  return (
    <div className='container'>
      <h2 className='text-center mt-5'>Food Item Information</h2>
      <button className='btn btn-success mt-3 mb-3' onClick={handleAddFoodItem}>
        Add Food Item
      </button>
      <div className='table-responsive'>
        <table className='table table-bordered'>
          <thead className='thead-dark'>
            <tr>
              <th scope='col'>Sr no</th>
              <th scope='col'>Name</th>
              <th scope='col'>Category</th>
              <th scope='col'>Price</th>
              <th scope='col'>Status</th>
              <th scope='col'>Edit</th>
              <th scope='col'>Delete</th>
            </tr>
          </thead>
          <tbody>
            {foodItems.map((foodItem, index) => (
              <tr key={foodItem._id}>
                <td>{index + 1}</td>
                <td>{foodItem.name}</td>
                <td>{foodItem.category}</td>
                <td>{foodItem.price}</td>
                <td>
                  <button
                    className={`btn ${
                      foodItem.status === 'Active'
                        ? 'btn-success'
                        : 'btn-danger'
                    }`}
                    onClick={() => toggleStatus(foodItem._id)}>
                    {foodItem.status}
                  </button>
                </td>
                <td>
                  <button
                    className='btn btn-primary'
                    onClick={() => handleEdit(foodItem)}>
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className='btn btn-danger'
                    onClick={() => handleDelete(foodItem._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editModalShow && (
        <EditFoodItemModal
          show={editModalShow}
          onHide={closeModal}
          foodItem={selectedFoodItem}
          saveFoodItem={saveFoodItem}
          categories={categories.map((category) => category.categoryname)}
        />
      )}
    </div>
  )
}

export default FoodItem
