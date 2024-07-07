import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../store/auth'

const Home = () => {
  const { clearAuth } = useAuth()

  useEffect(() => {
    const fun = async () => {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      // console.log(response.status)
    }
    fun()
    clearAuth()
  }, [])

  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='col-md-12 text-center mb-3 mt-3'>
            <Link className='btn btn-primary' to='/ownerlogin'>
              Manager
            </Link>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6 text-center mb-3'>
            <Link className='btn btn-secondary' to='/waiterlogin'>
              Service Person
            </Link>
          </div>
          <div className='col-md-6 text-center mb-3'>
            <Link className='btn btn-warning' to='/cooklogin'>
              Cook
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
