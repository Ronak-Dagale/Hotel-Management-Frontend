import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const EditFoodItemModal = ({ show, onHide, foodItem, categories, saveFoodItem }) => {
  const [formData, setFormData] = useState({
    id: foodItem ? foodItem._id : null,
    name: foodItem ? foodItem.name : '',
    category: foodItem ? foodItem.category : '',
    price: foodItem ? foodItem.price : '',
    status: foodItem ? foodItem.status : 'Active'
  });

  useEffect(() => {
    if (foodItem) {
      setFormData({
        id: foodItem._id,
        name: foodItem.name,
        category: foodItem.category,
        price: foodItem.price,
        status: foodItem.status
      });
    } else {
      setFormData({
        id: null,
        name: '',
        category: '',
        price: '',
        status: 'Active'
      });
    }
  }, [foodItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    saveFoodItem(formData);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{foodItem ? 'Edit Food Item' : 'Add Food Item'}</Modal.Title>
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
          <label className="form-label">Category</label>
          <select
            className="form-control"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant="primary" onClick={handleSubmit}>Save changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditFoodItemModal;
