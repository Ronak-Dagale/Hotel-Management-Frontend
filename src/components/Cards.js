import React from 'react';
import { Link } from 'react-router-dom';

const Cards = (props) => {
  return (
    <div className="card" style={{ width: '18rem', margin: '10px' }}>
      <div className="card-body" style={{ minHeight: '200px' }}>
        {!props.isFree && (
          <div className="text-center mb-3">
            <span className="badge bg-danger fs-5">Running</span>
          </div>
        )}
        <h5 className="card-title text-center fs-1">{props.tableNo}</h5>
        <div className="d-flex justify-content-center">
          <Link to={`/vieworder/${props.tabelId}`} className="btn btn-primary">
            Book Order
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cards;
