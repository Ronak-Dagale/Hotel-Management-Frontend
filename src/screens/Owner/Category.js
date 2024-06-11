// CategoryManagement.js
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import EditCategoryModal from './EditCategoryModal'

const CategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [modalShow, setModalShow] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const token = localStorage.getItem('authToken')

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
      //<ErrorDisplay err={err} />
    }
  }

  const saveCategory = async (category) => {
    const token = localStorage.getItem('authToken')
    try {
      if (category.id) {
        await axios.put(
          `${process.env.REACT_APP_BASE_URL}/api/foodcategory/update/${category.id}`,
          category,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
      } else {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/foodcategory/add`,
          category,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
      }
      fetchCategories()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteCategory = async (id) => {
    const token = localStorage.getItem('authToken')
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/foodcategory/delete/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      fetchCategories()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (category) => {
    setSelectedCategory(category)
    setModalShow(true)
  }

  const handleAdd = () => {
    setSelectedCategory(null)
    setModalShow(true)
  }

  return (
    <div className='container'>
      <h2 className='text-center mt-5'>Category Management</h2>
      <button className='btn btn-success mt-3 mb-3' onClick={handleAdd}>
        Add Category
      </button>
      <div className='table-responsive'>
        <table className='table table-bordered'>
          <thead className='thead-dark'>
            <tr>
              <th scope='col'>Sr. No</th>
              <th scope='col'>Category Name</th>
              <th scope='col'>Status</th>
              <th scope='col'>Edit</th>
              <th scope='col'>Delete</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category._id}>
                <td>{index + 1}</td>
                <td>{category.categoryname}</td>
                <td>{category.status}</td>
                <td>
                  <button
                    className='btn btn-primary'
                    onClick={() => handleEdit(category)}>
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className='btn btn-danger'
                    onClick={() => deleteCategory(category._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalShow && (
        <EditCategoryModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          category={selectedCategory}
          saveCategory={saveCategory}
        />
      )}
    </div>
  )
}

export default CategoryManagement
