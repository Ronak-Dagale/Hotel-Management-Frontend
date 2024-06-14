import React, { useState, useEffect } from 'react'
import axios from 'axios'
import EditEmployeeModal from './EditEmployeeModal'
import { useAuth } from '../../store/auth'
const Employee = () => {
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [editModalShow, setEditModalShow] = useState(false)
  const { auth } = useAuth()
  useEffect(() => {
    const fetchEmployees = async () => {
      // const token = localStorage.getItem('authToken')
      const { token } = auth
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/getEmployees`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setEmployees(response.data)
      } catch (error) {
        console.error('Error fetching employees:', error)
      }
    }

    fetchEmployees()
  }, [])

  const handleEdit = (employee) => {
    setSelectedEmployee(employee)
    setEditModalShow(true)
  }

  const handleDelete = async (id) => {
    // const token = localStorage.getItem('authToken')
    const { token } = auth
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/deleteEmployee/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setEmployees(employees.filter((emp) => emp._id !== id))
    } catch (error) {
      console.error('Error deleting employee:', error)
    }
  }

  const handleAddEmployee = () => {
    setSelectedEmployee(null)
    setEditModalShow(true)
  }

  const closeModal = () => {
    setSelectedEmployee(null)
    setEditModalShow(false)
  }

  const saveEmployee = async (updatedEmployee) => {
    // console.log(updatedEmployee)
    // const token = localStorage.getItem('authToken')
    const { token } = auth
    try {
      if (selectedEmployee) {
        // Update existing employee
        await axios.put(
          `${process.env.REACT_APP_BASE_URL}/api/updateEmployee/${updatedEmployee.id}`,
          updatedEmployee,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setEmployees(
          employees.map((emp) =>
            emp.id === updatedEmployee.id ? updatedEmployee : emp
          )
        )
      } else {
        // Add new employee
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/createUser`,
          {
            name: updatedEmployee.name,
            email: updatedEmployee.email,
            password: updatedEmployee.secretPin, // You might want to handle password differently
            phone: updatedEmployee.phone,
            role: updatedEmployee.role,

            // secretPin: updatedEmployee.secretPin
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setEmployees([
          ...employees,
          { ...updatedEmployee, id: response.data.id },
        ])
      }
    } catch (error) {
      console.error('Error saving employee:', error)
    }
    closeModal()
  }

  return (
    <div className='container'>
      <h2 className='text-center mt-5'>Employee Information</h2>
      <div className='table-responsive'>
        <table className='table table-bordered'>
          <thead className='thead-dark'>
            <tr>
              <th scope='col'>Sr. No</th>
              <th scope='col'>Name</th>
              <th scope='col'>Department</th>
              <th scope='col'>phone No</th>

              <th scope='col'>Edit</th>
              <th scope='col'>Delete</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={employee._id}>
                <td>{index + 1}</td>
                <td>{employee.name}</td>
                <td>{employee.role}</td>
                <td>{employee.phone}</td>
                <td>
                  <button
                    className='btn btn-primary'
                    onClick={() => handleEdit(employee)}>
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className='btn btn-danger'
                    onClick={() => handleDelete(employee._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className='btn btn-success mt-3' onClick={handleAddEmployee}>
        Add Employee
      </button>

      {editModalShow && (
        <EditEmployeeModal
          show={editModalShow}
          onHide={closeModal}
          employee={selectedEmployee}
          saveEmployee={saveEmployee}
        />
      )}
    </div>
  )
}

export default Employee
