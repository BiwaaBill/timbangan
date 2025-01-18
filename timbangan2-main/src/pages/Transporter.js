import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';

export default function Transporter(props) {
  const [formData, setFormData] = useState({ kode_transporter: '', nama_transporter: '' });
  const [transports, setTransports] = useState([]);
  const [editingTransport, setEditingTransport] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTransporters();
  }, []);

  const fetchTransporters = async () => {
    try {
      const response = await fetch('http://localhost:3002/transports');
      const data = await response.json();
      setTransports(data);
    } catch (error) {
      console.error('Error fetching transporters:', error);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingTransport) {
      await editTransporter();
    } else {
      await addTransporter();
    }

    setFormData({ kode_transporter: '', nama_transporter: '' });
    setEditingTransport(null);
    fetchTransporters();
    setIsModalOpen(false);
  };

  const addTransporter = async () => {
    try {
      const response = await fetch('http://localhost:3002/transports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showNotification('Transporter berhasil ditambahkan!', 'success');
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Transporter tidak berhasil ditambahkan', 'error');
      }
    } catch (error) {
      console.error('Error adding transporter:', error);
      showNotification('Error adding transporter', 'error');
    }
  };

  const editTransporter = async () => {
    try {
      const response = await fetch(`http://localhost:3002/transports/${editingTransport.kode_transporter}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showNotification('Transporter updated successfully!', 'success');
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Error updating transporter', 'error');
      }
    } catch (error) {
      console.error('Error updating transporter:', error);
      showNotification('Error updating transporter', 'error');
    }
  };

  const handleEdit = (transport) => {
    setEditingTransport(transport);
    setFormData(transport);
    setIsModalOpen(true);
  };

  const handleDelete = async (kode_transporter) => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus data ini?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3002/transports/${kode_transporter}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTransports((prev) => prev.filter((transport) => transport.kode_transporter !== kode_transporter));
        showNotification('Data berhasil dihapus.', 'success');
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Terjadi kesalahan saat menghapus data.', 'error');
      }
    } catch (error) {
      console.error('Error deleting transporter:', error);
      showNotification('Terjadi kesalahan saat menghapus data.', 'error');
    }
  };

  const handlePrint = async (kode_transporter) => {
    try {
      const response = await fetch(`http://localhost:3002/print/transporter/${kode_transporter}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch PDF');
      }

      const blob = await response.blob();

      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);

      link.href = url;
      link.download = `transporter-${kode_transporter}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      showNotification('Error downloading PDF', 'error');
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-200 min-h-screen">
      {notification && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
        >
          {notification.message}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit Transporter</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-black font-bold mb-2">Kode</label>
                <input
                  type="text"
                  name="kode_transporter"
                  value={formData.kode_transporter}
                  onChange={handleInputChange}
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-black font-bold mb-2">Nama Transporter</label>
                <input
                  type="text"
                  name="nama_transporter"
                  value={formData.nama_transporter}
                  onChange={handleInputChange}
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData({ kode_transporter: '', nama_transporter: '' });
                  }}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black font-bold mb-2">Kode</label>
            <input
              type="text"
              name="kode_transporter"
              value={formData.kode_transporter}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full md:w-1/3"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black font-bold mb-2">Nama Transporter</label>
            <input
              type="text"
              name="nama_transporter"
              value={formData.nama_transporter}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full md:w-1/3"
              required
            />
          </div>
          <button type="submit" className="bg-orange-500 text-white font-bold py-2 px-4 rounded">
            Insert
          </button>
        </form>
      </div>

      <div className="mt-8">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-pink-700 text-white">
                <th className="py-3 px-4 rounded-tl-lg">Kode</th>
                <th className="py-3 px-4">Nama Transporter</th>
                <th className="py-3 px-4 rounded-tr-lg">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transports.map((transport) => (
                <tr key={transport.kode_transporter} className="bg-pink-100">
                  <td className="border-t py-3 px-4">{transport.kode_transporter}</td>
                  <td className="border-t py-3 px-4">{transport.nama_transporter}</td>
                  <td className="border-t py-3 px-4">
                    <button
                      onClick={() => handlePrint(transport.kode_transporter)}
                      className="bg-blue-400 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Print
                    </button>
                    <button
                      onClick={() => handleEdit(transport)}
                      className="bg-pink-400 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(transport.kode_transporter)}
                      className="bg-red-500 text-white font-bold py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
