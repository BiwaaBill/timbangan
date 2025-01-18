import React from 'react';

const ProductTable = ({ products, onPrint, onEdit, onDelete }) => {
    return (
        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-purple-700 text-white">
                    <th className="p-2">Kode</th>
                    <th className="p-2">Nama Produk</th>
                    <th className="p-2">Aksi</th>
                </tr>
            </thead>
            <tbody>
            {products.map((product) => (    
                <tr key={product.kode} className="border-b">
                    <td className="p-2">{product.kode}</td>
                    <td className="p-2">{product.nama_barang}</td>
                    <td className="p-2 flex justify-center">
                        <button
                            className="bg-blue-300 text-white px-2 py-1 rounded mr-2"
                            onClick={() => onPrint(product)}
                        >
                            Print
                        </button>
                        <button
                            className="bg-purple-500 text-white px-2 py-1 rounded mr-2"
                            onClick={() => onEdit(product)}
                        >
                            Edit
                        </button>
                        <button
                            className="bg-red-500 text-white px-2 py-1 rounded"
                            onClick={() => onDelete(product.kode)}
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};


export default ProductTable;
