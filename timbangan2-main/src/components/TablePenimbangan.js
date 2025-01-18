import React from 'react';

const TablePenimbangan = ({ item, handleWeigh, handleReset }) => {
  return (
    <tr key={item.id} className={item.saved ? "bg-green-100" : "bg-blue-100"}>
      <td className="p-2">{item.date}</td>
      <td className="p-2">Penimbangan {item.id}</td>
      <td className="p-2">
        <input
          type="text"
          value={item.weight}
          readOnly
          className="border rounded-md p-1 w-full"
        />
      </td>
      <td className="p-2">
        <button
          onClick={() => handleWeigh(item.id)}
          className="bg-blue-500 text-white p-1 rounded-md mr-2"
        >
          Timbang
        </button>
        <button
          onClick={() => handleReset(item.id)}
          className="bg-red-500 text-white p-1 rounded-md"
        >
          Ulang
        </button>
      </td>
    </tr>
  );
};

export default TablePenimbangan;
