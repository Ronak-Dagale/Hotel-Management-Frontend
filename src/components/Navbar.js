import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../store/auth'

const Navbar = () => {
  const { auth, setAuth } = useAuth()

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    setAuth({ isAuthenticated: false, user: null })
  }

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
      <div className='container-fluid'>
        <Link className='navbar-brand' to='/'>
          Hotel Name
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarSupportedContent'
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          {auth.isAuthenticated && (
            <ul className='navbar-nav me-auto mb-2 mb-lg-0 '>
              {auth.user && auth.user.role === 'owner' && (
                <>
                  <li className='nav-item'>
                    <Link className='nav-link' to='/owner/dashboard'>
                      Dashboard
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link className='nav-link' to='/owner/category'>
                      Food Category
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link className='nav-link' to='/owner/FoodItem'>
                      Food Item
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link className='nav-link' to='/owner/Table'>
                      Table
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link className='nav-link' to='/owner/employee'>
                      Employee
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link className='nav-link' to='/owner/history'>
                      History
                    </Link>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
        {/* Move Logout button to the right */}
        <div className='d-flex'>
          {auth.isAuthenticated && (
            <button className='btn btn-danger ml-auto' onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
