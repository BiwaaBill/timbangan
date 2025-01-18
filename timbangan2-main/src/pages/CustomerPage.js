import React, { useState, useEffect } from "react";

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    alamat: "",
    kota: "",
    telepon: "",
    facsimile: "",
    pic: "",
  });
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:3002/supplier");
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error.message);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitInsert = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3002/supplier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to insert customer: ${errorText}`);
      }

      const newCustomer = await response.json();
      setCustomers((prev) => [...prev, newCustomer]);

      setFormData({
        kode: "",
        nama: "",
        alamat: "",
        kota: "",
        telepon: "",
        facsimile: "",
        pic: "",
      });

      showNotification("Data berhasil disimpan.", "success");

    } catch (error) {
      console.error("Error inserting customer:", error.message);
      showNotification("Gagal menyimpan data.", "error");
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    if (!editingCustomer) return;

    try {
        const response = await fetch(
            `http://localhost:3002/supplier/${editingCustomer.kode}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();  // Capture error as text if not JSON
            throw new Error(`Failed to update customer: ${errorText}`);
        }

        const updatedCustomer = await response.json();  // Parse the response as JSON
        setCustomers((prev) =>
            prev.map((customer) =>
                customer.kode === editingCustomer.kode ? updatedCustomer : customer
            )
        );

        showNotification("Data berhasil diperbarui.", "success");

        setFormData({
            kode: "",
            nama: "",
            alamat: "",
            kota: "",
            telepon: "",
            facsimile: "",
            pic: "",
        });
        setEditingCustomer(null);
        setIsModalOpen(false);

    } catch (error) {
        console.error("Error updating customer:", error.message);
        showNotification("Gagal memperbarui data.", "error");
    }
};


  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setIsModalOpen(true);
  };

  const handleDelete = async (kode) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3002/supplier/${kode}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete customer with Code ${kode}`);
      }

      setCustomers((prev) => prev.filter((customer) => customer.kode !== kode));
      showNotification("Data berhasil dihapus.", "success");
    } catch (error) {
      console.error("Error deleting customer:", error.message);
      showNotification("Terjadi kesalahan saat menghapus data.", "error");
    }
  };

  const handlePrint = async (customer) => {
    try {
      const response = await fetch(`http://localhost:3002/supplier/${customer.kode}/print`);
      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `supplier-${customer.kode}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error printing customer:", error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {notification.message && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white ${notification.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
        >
          {notification.message}
        </div>
      )}
      <form onSubmit={handleSubmitInsert}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2">Kode</label>
            <input
              type="text"
              name="kode"
              value={formData.kode}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Telepon</label>
            <input
              type="text"
              name="telepon"
              value={formData.telepon}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Nama</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Facsimile</label>
            <input
              type="text"
              name="facsimile"
              value={formData.facsimile}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Alamat</label>
            <input
              type="text"
              name="alamat"
              value={formData.alamat}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">P.I.C</label>
            <input
              type="text"
              name="pic"
              value={formData.pic}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Kota</label>
            <input
              type="text"
              name="kota"
              value={formData.kota}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex items-end">
            {!editingCustomer ? (
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded"
              >
                Insert
              </button>
            ) : (
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            )}
          </div>
        </div>
      </form>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-lg font-semibold mb-4">
              {"Edit Supplier"}
            </h2>
            <form onSubmit={handleSubmitUpdate}>
              <div>
                <label className="block mb-2">Kode</label>
                <input
                  type="text"
                  name="kode"
                  value={formData.kode}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Telepon</label>
                <input
                  type="text"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Nama</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Facsimile</label>
                <input
                  type="text"
                  name="facsimile"
                  value={formData.facsimile}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Alamat</label>
                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">P.I.C</label>
                <input
                  type="text"
                  name="pic"
                  value={formData.pic}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Kota</label>
                <input
                  type="text"
                  name="kota"
                  value={formData.kota}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData({
                      kode: "",
                      nama: "",
                      alamat: "",
                      kota: "",
                      telepon: "",
                      facsimile: "",
                      pic: "",
                    });
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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-green-500 text-white">
              <th className="py-2 px-4">Kode</th>
              <th className="py-2 px-4">Nama</th>
              <th className="py-2 px-4">Alamat</th>
              <th className="py-2 px-4">Kota</th>
              <th className="py-2 px-4">Telepon</th>
              <th className="py-2 px-4">Facsimile</th>
              <th className="py-2 px-4">P.I.C</th>
              <th className="py-2 px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr
                key={customer.kode}
                className={index % 2 === 0 ? "bg-gray-100" : ""}
              >
                <td className="border px-4 py-2">{customer.kode}</td>
                <td className="border px-4 py-2">{customer.nama}</td>
                <td className="border px-4 py-2">{customer.alamat}</td>
                <td className="border px-4 py-2">{customer.kota}</td>
                <td className="border px-4 py-2">{customer.telepon}</td>
                <td className="border px-4 py-2">{customer.facsimile}</td>
                <td className="border px-4 py-2">{customer.pic}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handlePrint(customer)}
                    className="bg-blue-400 text-white px-2 py-1 rounded mr-2"
                  >
                    Print
                  </button>
                  <button
                    onClick={() => handleEdit(customer)}
                    className="bg-purple-400 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(customer.kode)}
                    className="bg-red-400 text-white px-2 py-1 rounded"
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
  );
}
