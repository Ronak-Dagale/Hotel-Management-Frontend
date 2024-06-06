import React from 'react'

const PrintBill = React.forwardRef(({ tableDetails, totalAmount }, ref) => {
  return (
    <div ref={ref} className='print-container p-4'>
      <div className='text-center mb-4'>
        <h1 className='display-4 font-weight-bold'>Hotel Name</h1>
        <p className='lead'>Hotel Address</p>
      </div>
      <table className='table table-bordered'>
        <thead className='thead-light'>
          <tr>
            <th scope='col'>Item Name</th>
            <th scope='col'>Qty</th>
            <th scope='col'>Price</th>
            <th scope='col'>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {tableDetails.order.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>{item.price}</td>
              <td>{item.qty * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className='text-center my-4'>Total Amount: Rs. {totalAmount}</h2>
      <div className='text-center mt-4'>
        <p className='font-italic'>Thank you! Visit again!</p>
      </div>
    </div>
  )
})

export default PrintBill
