import React from 'react'

const ErrorDisplay = ({ error }) => {
  return (
    <div
      className='alert alert-danger alert-dismissible fade show'
      role='alert'>
      <strong>Error:</strong> {error}
      <button
        type='button'
        className='btn-close'
        data-bs-dismiss='alert'
        aria-label='Close'></button>
    </div>
  )
}

export default ErrorDisplay
