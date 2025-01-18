import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import 'tailwindcss/tailwind.css';

export default function Keluar(props) {
    const [selectedTab, setSelectedTab] = useState("masuk");
    const [data, setData] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        no_record: "",
        waktu_masuk: "",
        waktu_keluar: "",
        berat_penimbangan1: "",
        berat_penimbangan2: "",
        netto: "",
        tara: "",
        no_kendaraan: "",
        nama_barang: "",
        nama_customer: "",
        transporter: "",
        do_po: "",
        sopir: "",
        petugas: "",
    });

    useEffect(() => {
        // Fetch data from your backend here (or mock data)
        const fetchData = async () => {
            const response = await fetch("http://localhost:3002/api/penimbangan");
            const result = await response.json();
            setData(result);
        };

        fetchData();
    }, []);

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            no_record: item.no_record,
            waktu_masuk: item.waktu_masuk,
            waktu_keluar: item.waktu_keluar,
            berat_penimbangan1: item.berat_penimbangan1,
            berat_penimbangan2: item.berat_penimbangan2,
            netto: item.netto,
            tara: item.tara,
            no_kendaraan: item.no_kendaraan,
            nama_barang: item.nama_barang,
            nama_customer: item.nama_customer,
            transporter: item.transporter,
            do_po: item.do_po,
            sopir: item.sopir,
            petugas: item.petugas,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => {
            const updatedData = { ...prevData, [name]: value };

            // Calculate netto and tara if the weight fields change
            if (name === "berat_penimbangan1" || name === "berat_penimbangan2") {
                const berat_penimbangan1 = parseFloat(updatedData.berat_penimbangan1) || 0;
                const berat_penimbangan2 = parseFloat(updatedData.berat_penimbangan2) || 0;
                updatedData.netto = berat_penimbangan1 - berat_penimbangan2; // Netto = weight in - weight out
                updatedData.tara = berat_penimbangan2; // Adjust tara calculation based on your business logic
            }

            return updatedData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // If waktu_keluar is empty, set it to the current date and time
        const validWaktu_keluar = formData.waktu_keluar && formData.waktu_keluar !== "" 
            ? formData.waktu_keluar 
            : new Date().toISOString(); // Get current date and time if empty

        const updatedData = {
            ...formData,
            waktu_keluar: validWaktu_keluar,
        };

        // Send data to backend
        await fetch(`http://localhost:3002/api/penimbangan/${editingItem.id}`, {
            method: "PUT",
            body: JSON.stringify(updatedData),
            headers: { "Content-Type": "application/json" },
        });

        // Update local state with new data
        setData(data.map(item => item.id === editingItem.id ? { ...item, ...updatedData } : item));
        setEditingItem(null);
    };

    const filterData = () => {
        if (selectedTab === "masuk") {
            return data.filter(item => item.berat_penimbangan2 === null);
        }
        if (selectedTab === "keluar") {
            return data.filter(item => item.berat_penimbangan2 !== null);
        }
        return data;
    };

    const formatDate = (date, type) => {
        if (!date) return ""; // If date or time is empty, return empty string

        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const optionsTime = { hour: '2-digit', minute: '2-digit' };

        const dateObject = new Date(date);

        if (type === "date") {
            return dateObject.toLocaleDateString('id-ID', optionsDate);
        } else if (type === "time") {
            return dateObject.toLocaleTimeString('id-ID', optionsTime);
        }

        return ""; // Default fallback
    };

    const filteredData = filterData();
    return (
        <div className="p-4">
            {/* Tab buttons */}
            <div className="flex justify-center space-x-4 mb-4">
                <button
                    className={`py-2 px-4 rounded-full ${selectedTab === 'masuk' ? 'bg-purple-300' : 'bg-gray-300'}`}
                    onClick={() => handleTabClick('masuk')}
                >
                    Timbangan Masuk
                </button>
                <button
                    className={`py-2 px-4 rounded-full ${selectedTab === 'keluar' ? 'bg-blue-300' : 'bg-gray-300'}`}
                    onClick={() => handleTabClick('keluar')}
                >
                    Timbangan Keluar
                </button>
                <button
                    className={`py-2 px-4 rounded-full ${selectedTab === 'gabungan' ? 'bg-green-300' : 'bg-gray-300'}`}
                    onClick={() => handleTabClick('gabungan')}
                >
                    Gabungan Timbangan
                </button>
            </div>

            {editingItem && (
                    <div className="bg-white p-4 rounded-lg mb-4">
                    <h3 className="text-xl mb-4">Edit Data</h3>
                    <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                            <label className="block">No.Record</label>
                            <input
                                type="text"
                                name="waktu_masuk"
                                value={formData.no_record}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">No. Kendaraan</label>
                            <input
                                type="text"
                                name="no_kendaraan"
                                value={formData.no_kendaraan}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Waktu Masuk</label>
                            <input
                                type="text"
                                name="waktu_masuk"
                                value={formatDate(formData.waktu_masuk)}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Berat Penimbangan 1</label>
                            <input
                                type="text"
                                name="berat_penimbangan1"
                                value={formData.berat_penimbangan1}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Waktu Keluar</label>
                            <input
                                type="text"
                                name="waktu_keluar"
                                value={formatDate(formData.waktu_keluar)}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Berat Penimbangan 2</label>
                            <input
                                type="text"
                                name="berat_penimbangan2"
                                value={formData.berat_penimbangan2}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Netto</label>
                            <input
                                type="text"
                                name="netto"
                                value={formData.netto}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Tara</label>
                            <input
                                type="text"
                                name="tara"
                                value={formData.tara}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
                            Update
                        </button>
                    </form>
                </div>
            )}

            {/* Data table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-blue-600 text-white">
                            <th className="py-2 px-4">Tanggal</th>
                            <th className="py-2 px-4">No. Record</th>
                            <th className="py-2 px-4">No. Kendaraan</th>
                            <th className="py-2 px-4">Timbang 1</th>
                            <th className="py-2 px-4">Tanggal</th>
                            <th className="py-2 px-4">Jam</th>
                            <th className="py-2 px-4">Operator</th>
                            <th className="py-2 px-4">Timbang II</th>
                            <th className="py-2 px-4">Tanggal</th>
                            <th className="py-2 px-4">Jam</th>
                            <th className="py-2 px-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr className={index % 2 === 0 ? "bg-blue-100" : "bg-white"} key={item.id}>
                                <td className="py-2 px-4">{formatDate(item.tanggal_input, "date")}</td>
                                <td className="py-2 px-4">{item.no_record}</td>
                                <td className="py-2 px-4">{item.no_kendaraan}</td>
                                <td className="py-2 px-4">{item.berat_penimbangan1}</td>
                                <td className="py-2 px-4">{formatDate(item.waktu_masuk, "date")}</td>
                                <td className="py-2 px-4">{formatDate(item.waktu_masuk, "time")}</td>
                                <td className="py-2 px-4">{item.petugas}</td>
                                <td className="py-2 px-4">{item.berat_penimbangan2}</td>
                                <td className="py-2 px-4">{formatDate(item.waktu_keluar, "date")}</td>
                                <td className="py-2 px-4">{formatDate(item.waktu_keluar, "time")}</td>
                                <td className="py-2 px-4">
                                    <button
                                        className="bg-purple-300 text-white py-1 px-3 rounded-full"
                                        onClick={() => handleEdit(item)}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
