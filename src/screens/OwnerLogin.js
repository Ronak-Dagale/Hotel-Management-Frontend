import React from 'react'
import Login from '../components/Login'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../store/auth'
const OwnerLogin = () => {
  const navigate = useNavigate()
  const { storeTokenInLs, setAuth } = useAuth()

  const handleSubmit = async (mobileNumber, password) => {
    // console.log('Base URL:', process.env.REACT_APP_BASE_URL)
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/loginUser`,
        {
          phone: mobileNumber,
          password,
          role: 'owner',
        }
      )
      if (response.data.success) {
        storeTokenInLs(response.data.authToken)
        // localStorage.setItem('authToken', response.data.authToken)
        // console.log(response.data)
        setAuth({ isAuthenticated: true, user: response.data.user })
        navigate('/Owner/dashboard')
      } else {
        return { success: false, message: response.data.errors[0].msg }
      }
    } catch (error) {
      console.error('Error during login:', error)
      return { success: false, message: 'An error occurred. Please try again.' }
    }
  }

  return (
    <div>
      <Login handleSubmit={handleSubmit} />
    </div>
  )
}

export default OwnerLogin
