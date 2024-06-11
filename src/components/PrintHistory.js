import React from 'react'

const PrintHistory = React.forwardRef(({ completedOrders }, ref) => {
  // Calculate the total sum of all bills
  const totalSum = completedOrders.reduce(
    (sum, order) => sum + order.total_bill,
    0
  )

  return (
    <div ref={ref} className='print-container p-4'>
      <div className='text-center mb-4'>
        <h1 className='display-4 font-weight-bold'>Hotel Name</h1>
        <p className='lead'>Hotel Address</p>
      </div>
      <table className='table table-bordered'>
        <thead className='thead-light'>
          <tr>
            <th scope='col'>Sr. No</th>
            <th scope='col'>Table Number</th>
            <th scope='col'>Total Bill</th>
          </tr>
        </thead>
        <tbody>
          {completedOrders.map((order, index) => (
            <tr key={order._id}>
              <td>{index + 1}</td>
              <td>{order.table_number}</td>
              <td>Rs {order.total_bill}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className='text-center my-4'>
        Total Sum of All Bills: Rs. {totalSum}
      </h2>
    </div>
  )
})

export default PrintHistory
