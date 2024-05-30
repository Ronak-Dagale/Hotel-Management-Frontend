// EditCategoryModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const EditCategoryModal = ({ show, onHide, category, saveCategory }) => {
  const [formData, setFormData] = useState({
    id: category ? category._id : null,
    categoryname: category ? category.categoryname : '',
    status: category ? category.status : 'Active'
  });

  useEffect(() => {
    setFormData({
      id: category ? category._id : null,
      categoryname: category ? category.categoryname : '',
      status: category ? category.status : 'Active'
    });
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    saveCategory(formData);
    onHide(); // Close modal after submission
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{formData.id ? 'Edit Category' : 'Add Category'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            className="form-control"
            name="categoryname"
            value={formData.categoryname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-control"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
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

export default EditCategoryModal;
