// EditEmployeeModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const EditEmployeeModal = ({ show, onHide, employee, saveEmployee }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: '',
   
    phone: '',
    secretPin: '',
    role: 'cook', // Default role
    email: '' // Add email field
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        id: employee._id,
        name: employee.name,
       
        phone: employee.phone,
        secretPin: '',
        role: employee.role,
        email: employee.email
      });
    } else {
      setFormData({
        id: null,
        name: '',
        
        phone: '',
        secretPin: '',
        role: 'cook', // Default role
        email: ''
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    saveEmployee(formData);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{employee ? 'Edit Employee' : 'Add Employee'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">phone</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Secret Pin</label>
          <input
            type="text"
            className="form-control"
            name="secretPin"
            value={formData.secretPin}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            className="form-control"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="cook">Cook</option>
            <option value="server">Server</option>
          </select>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant="primary" onClick={handleSubmit}>Save changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditEmployeeModal;
