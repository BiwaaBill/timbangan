import React, { useState, useEffect } from "react";
import ProductTable from "../components/ProductTable";

export default function MasterProduct() {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        kode: "",
        nama_barang: "",
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:3002/products");
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error.message);
            }
        };

        fetchProducts();
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.kode || !formData.nama_barang) {
            showNotification("Kode and Nama Barang are required.", "error");
            return;
        }

        const url = editingProduct
            ? `http://localhost:3002/products/${editingProduct.kode}`
            : "http://localhost:3002/products";

        const method = editingProduct ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to save product");
            }

            const savedProduct = await response.json();

            if (editingProduct) {
                setProducts((prev) =>
                    prev.map((product) =>
                        product.kode === editingProduct.kode ? savedProduct : product
                    )
                );
                setEditingProduct(null);
                showNotification("Data berhasil diperbarui.", "success");
            } else {
                setProducts((prev) => [...prev, savedProduct]);
                showNotification("Data berhasil ditambahkan.", "success");
            }

            setFormData({
                kode: "",
                nama_barang: "",
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving product:", error.message);
            showNotification("Gagal menyimpan data.", "error");
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (kode) => {
        const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus data ini?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:3002/products/${kode}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`Failed to delete product with kode ${kode}`);
            }

            setProducts((prev) => prev.filter((product) => product.kode !== kode));
            showNotification("Data berhasil dihapus.", "success");
        } catch (error) {
            console.error("Error deleting product:", error.message);
            showNotification("Terjadi kesalahan saat menghapus data.", "error");
        }
    };

    const handlePrint = async (product) => {
        try {
            const response = await fetch(
                `http://localhost:3002/products/${product.kode}/print`
            );
            if (!response.ok) {
                throw new Error("Failed to download PDF");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `product-${product.kode}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error printing product:", error.message);
            alert("Gagal mencetak PDF.");
        }
    };

    return (
        <div className="flex">
            {notification.message && (
                <div
                    className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white ${notification.type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                >
                    {notification.message}
                </div>
            )}

            <main className="flex-1 p-6">
                <div className="bg-white p-6 rounded shadow">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-3 gap-4 mb-6">
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
                                <label className="block mb-2">Nama Barang</label>
                                <input
                                    type="text"
                                    name="nama_barang"
                                    value={formData.nama_barang}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="bg-orange-500 text-white px-4 py-2 rounded"
                                >
                                    Insert
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="overflow-x-auto">
                        <ProductTable
                            products={products}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onPrint={handlePrint}
                        />
                    </div>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded shadow w-96">
                            <h2 className="text-lg font-semibold mb-4">
                                {editingProduct ? "Edit Data" : "Tambah Data"}
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
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
                                <div className="mb-4">
                                    <label className="block mb-2">Nama Barang</label>
                                    <input
                                        type="text"
                                        name="nama_barang"
                                        value={formData.nama_barang}
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
                                            setFormData({ kode: "", nama_barang: "" });
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
            </main>
        </div>
    );
}
