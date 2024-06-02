import React, { useState } from 'react'

const Login = (props) => {
  const [mobileNumber, setMobileNumber] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleMobileNumberChange = (e) => {
    setMobileNumber(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await props.handleSubmit(mobileNumber, password)
      if (!response.success) {
        setError(response.message)
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <div className='card p-4' style={{ minWidth: '300px' }}>
        <h3 className='text-center mb-3'>Login</h3>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='mobileNumber' className='form-label'>
              Enter Mobile Number
            </label>
            <input
              type='number'
              className='form-control'
              id='mobileNumber'
              value={mobileNumber}
              onChange={handleMobileNumberChange}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='password' className='form-label'>
              Passkey
            </label>
            <input
              type='password'
              className='form-control'
              id='password'
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          {error && <div className='alert alert-danger'>{error}</div>}
          <button type='submit' className='btn btn-primary w-100'>
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
