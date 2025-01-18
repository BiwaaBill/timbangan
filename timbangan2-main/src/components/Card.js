import React from 'react';

const Card = ({ title, count, gradient }) => {
  return (
    <div className={`flex flex-col items-center justify-center w-64 h-32 rounded-lg shadow-lg text-white ${gradient}`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-4xl font-bold">{count}</p>
    </div>
  );
};

export default Card;
