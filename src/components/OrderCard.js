import React, { useState } from 'react';

const OrderCard = ({ item, updateOrderQuantity, confirmOrder,deleteItem }) => {
    const [quantity, setQuantity] = useState(item.qty);
    const [note, setNote] = useState(item.note || '');

    const handleIncrease = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        updateOrderQuantity(item._id, 1);
    };

    const handleDecrease = () => {
        if (quantity > 0) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            updateOrderQuantity(item._id, -1);
        }
    };

    const handleNoteChange = (e) => {
        setNote(e.target.value);
        item.note = e.target.value; // Update the note in the item object
    };

    const handleConfirm = () => {
        confirmOrder(item._id);
        setQuantity(0); // Reset quantity to zero
    };

    const handleDelete = () => {
        deleteItem(item._id);
    };

    return (
        <div className="order-card card h-100">
            <div className="card-body">
                <div className="row">
                    <div className="col text-center">
                        <h5 className="card-title">{item.name}</h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col d-flex justify-content-between align-items-center">
                        <p className="card-text mb-0">Price: Rs {item.price}</p>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            style={{ width: '100px' }}
                            placeholder="Add note"
                            value={note}
                            onChange={handleNoteChange}
                        />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col d-flex justify-content-between align-items-center">
                        <div>
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={handleDecrease}
                            >
                                -
                            </button>
                            <span className="mx-2">{quantity}</span>
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={handleIncrease}
                            >
                                +
                            </button>
                        </div>
                        {item.status === 'pending' && ( // Conditionally render delete button
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        )}
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={handleConfirm}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default OrderCard;
