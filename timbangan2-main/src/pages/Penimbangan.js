import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

export default function Penimbangan(props) {
    const [weights, setWeights] = useState({
        noRecord: '',
        weightIn: null,
        weightOut: null,
        netto: null,
        tara: null,
        dateIn: null,
        dateOut: null,
    });

    const [formData, setFormData] = useState({
        vehicleNumber: '',
        productName: '',
        customerName: '',
        transporter: '',
        doPoNumber: '',
        sopir: '',
        petugas: '',
    });

    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [transporters, setTransporters] = useState([]);
    const [isConnected, setIsConnected] = useState(false); // Simulasi koneksi ke hardware

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productRes = await fetch('http://localhost:3002/penimbangan/products');
                if (!productRes.ok) {
                    throw new Error('Failed to fetch product data');
                }
                const productData = await productRes.json();
                setProducts(productData);

                const customerRes = await fetch('http://localhost:3002/penimbangan/supplier');
                if (!customerRes.ok) {
                    throw new Error('Failed to fetch customer data');
                }
                const customerData = await customerRes.json();
                setCustomers(customerData);

                const transporterRes = await fetch('http://localhost:3002/penimbangan/transports');
                if (!transporterRes.ok) {
                    throw new Error('Failed to fetch transporter data');
                }
                const transporterData = await transporterRes.json();
                setTransporters(transporterData);

                // Assume you fetch weights or similar data
                const weightRes = await fetch('http://localhost:3002/penimbangan/weights');
                if (weightRes.ok) {
                    const weightData = await weightRes.json();
                    // Set the dateIn and dateOut from fetched data
                    setWeights((prev) => ({
                        ...prev,
                        dateIn: weightData.dateIn || prev.dateIn,
                        dateOut: weightData.dateOut || prev.dateOut,
                    }));
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    const handleNoRecordChange = (e) => {
        setWeights({ ...weights, noRecord: e.target.value });
    };

    // Fungsi untuk menghitung Netto dan Tara secara dinamis
    const calculateNettoAndTara = (weightIn, weightOut) => {
        // Netto dihitung hanya jika kedua nilai ada
        const netto = weightOut !== null && weightIn !== null ? weightOut - weightIn : null;
        const tara = weightIn !== null && netto !== null ? weightIn - netto : null;

        return { netto: netto ?? 0, tara: tara ?? 0 };
    };

    const handleWeigh = async (type) => {
        const currentDateTime = new Date();
        const formattedDateTime = `${currentDateTime.toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' })} ${currentDateTime.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' })}`;

        if (isConnected) {
            try {
                const response = await fetch('/api/weight');
                const data = await response.json();

                if (type === 'in') {
                    const { netto, tara } = calculateNettoAndTara(data.weight, weights.weightOut);
                    setWeights((prev) => ({
                        ...prev,
                        weightIn: data.weight,
                        dateIn: formattedDateTime,
                        netto,
                        tara,
                    }));
                } else if (type === 'out') {
                    const { netto, tara } = calculateNettoAndTara(weights.weightIn, data.weight);
                    setWeights((prev) => ({
                        ...prev,
                        weightOut: data.weight,
                        dateOut: formattedDateTime,
                        netto,
                        tara,
                    }));
                }
            } catch (error) {
                console.error('Error fetching weight:', error);
            }
        } else {
            alert('Web tidak terhubung ke hardware. Harap isi berat secara manual.');
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleWeightInput = (type, value) => {
        const currentDateTime = new Date();
        const formattedDateTime = `${currentDateTime.toLocaleDateString()} ${currentDateTime.toLocaleTimeString()}`;

        if (type === 'in') {
            const { netto, tara } = calculateNettoAndTara(parseFloat(value), weights.weightOut);
            setWeights((prev) => ({
                ...prev,
                weightIn: parseFloat(value),
                dateIn: formattedDateTime,
                netto,
                tara,
            }));
        } else if (type === 'out') {
            const { netto, tara } = calculateNettoAndTara(weights.weightIn, parseFloat(value));
            setWeights((prev) => ({
                ...prev,
                weightOut: parseFloat(value),
                dateOut: formattedDateTime,
                netto,
                tara,
            }));
        }
    };

    const handleSave = async () => {
        const formatDate = (date, type) => {
            const dateObject = new Date(date);
            const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Jakarta' };
            const optionsTime = { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' };

            if (type === "date") {
                return dateObject.toLocaleDateString('id-ID', optionsDate).split('/').reverse().join('-');
            } else if (type === "time") {
                return dateObject.toLocaleTimeString('id-ID', optionsTime);
            }

            return "";
        };

        const waktuKeluar = (weights.dateOut && !isNaN(new Date(weights.dateOut).getTime())) ?
            formatDate(weights.dateOut, "date") + " " + formatDate(weights.dateOut, "time") :
            null;
        const beratPenimbangan2 = weights.weightOut ? weights.weightOut : null;

        const payload = {
            no_record: weights.noRecord,
            waktu_masuk: formatDate(weights.dateIn, "date") + " " + formatDate(weights.dateIn, "time"),
            waktu_keluar: waktuKeluar,
            berat_penimbangan1: weights.weightIn,
            berat_penimbangan2: beratPenimbangan2,
            netto: weights.netto,
            tara: weights.tara,
            no_kendaraan: formData.vehicleNumber,
            nama_barang: formData.productName,
            nama_customer: formData.customerName,
            transporter: formData.transporter,
            do_po: formData.doPoNumber,
            sopir: formData.sopir,
            petugas: formData.petugas,
        };



        try {
            const response = await fetch('http://localhost:3002/api/penimbangan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert('Data berhasil disimpan ke database!');
            } else {
                alert('Terjadi kesalahan saat menyimpan data.');
            }
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Terjadi kesalahan jaringan.');
        }
    };


    const handlePrint = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text('Laporan Penimbangan', 20, 20);

        doc.setFontSize(12);
        doc.text(`No. Record: ${weights.noRecord}`, 20, 30);
        doc.text(`Tanggal Masuk: ${weights.dateIn || 'Belum disimpan'}`, 20, 40);
        doc.text(`Tanggal Keluar: ${weights.dateOut || 'Belum disimpan'}`, 20, 50);
        doc.text(`Berat Masuk: ${weights.weightIn || 0} kg`, 20, 60);
        doc.text(`Berat Keluar: ${weights.weightOut || 0} kg`, 20, 70);
        doc.text(`Netto: ${weights.netto || 0} kg`, 20, 80);
        doc.text(`Tara: ${weights.tara || 0} kg`, 20, 90);

        doc.text(`Nomor Kendaraan: ${formData.vehicleNumber}`, 20, 100);
        doc.text(`Nama Barang: ${formData.productName}`, 20, 110);
        doc.text(`Nama Customer: ${formData.customerName}`, 20, 120);
        doc.text(`Transporter: ${formData.transporter}`, 20, 130);
        doc.text(`DO/PO Number: ${formData.doPoNumber}`, 20, 140);
        doc.text(`Sopir: ${formData.sopir}`, 20, 150);
        doc.text(`Petugas: ${formData.petugas}`, 20, 160);

        // Save the PDF
        doc.save('laporan_penimbangan.pdf');
    };

    // Reset data timbangan berat masuk
    const handleResetIn = () => {
        const { netto, tara } = calculateNettoAndTara(null, weights.weightOut);
        setWeights((prev) => ({
            ...prev,
            weightIn: null,
            dateIn: null,
            netto, // Pastikan netto dan tara dihitung ulang
            tara,  // Meski berat masuk direset, netto dan tara tetap dihitung
        }));
        alert('Data timbangan berat masuk telah direset.');
    };

    // Reset data timbangan berat keluar
    const handleResetOut = () => {
        const { netto, tara } = calculateNettoAndTara(weights.weightIn, null);
        setWeights((prev) => ({
            ...prev,
            weightOut: null,
            dateOut: null,
            netto, // Pastikan netto dan tara dihitung ulang
            tara,  // Meski berat keluar direset, netto dan tara tetap dihitung
        }));
        alert('Data timbangan berat keluar telah direset.');
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-start">
                <div className="bg-gray-300 w-1/2 h-64 flex items-center justify-center">
                    <span className="text-6xl font-bold">{weights.weightIn || weights.weightOut || 0} kg</span>
                </div>
                <div className="w-1/2 ml-4">
                    <div className="flex justify-end mb-2">
                        <div className="flex items-center">
                            <span className="mr-2">No. Record</span>
                            <input
                                type="text"
                                value={weights.noRecord}
                                onChange={handleNoRecordChange}
                                className="border border-gray-400 rounded px-2 py-1"
                            />
                        </div>
                    </div>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-pink-500 text-white">
                                <th className="border border-gray-300 p-2">Tanggal & Jam</th>
                                <th className="border border-gray-300 p-2">Penimbangan</th>
                                <th className="border border-gray-300 p-2">Berat</th>
                                <th className="border border-gray-300 p-2">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-blue-100">
                                <td className="border border-gray-300 p-2">{weights.dateIn || 'Belum disimpan'}</td>
                                <td className="border border-gray-300 p-2">Penimbangan 1</td>
                                <td className="border border-gray-300 p-2">
                                    <input
                                        type="number"
                                        value={weights.weightIn || ''}
                                        onChange={(e) => handleWeightInput('in', e.target.value)}
                                        disabled={isConnected}
                                        className="border border-gray-400 rounded px-2 py-1 w-full"
                                    />
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <button
                                        onClick={() => handleWeigh('in')}
                                        className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
                                    >
                                        Timbang
                                    </button>
                                    <button
                                        onClick={handleResetIn}
                                        className="bg-red-500 text-white px-4 py-1 rounded"
                                    >
                                        Ulang
                                    </button>
                                </td>
                            </tr>
                            <tr className="bg-green-100">
                                <td className="border border-gray-300 p-2">{weights.dateOut || 'Belum disimpan'}</td>
                                <td className="border border-gray-300 p-2">Penimbangan 2</td>
                                <td className="border border-gray-300 p-2">
                                    <input
                                        type="number"
                                        value={weights.weightOut || ''}
                                        onChange={(e) => handleWeightInput('out', e.target.value)}
                                        disabled={isConnected}
                                        className="border border-gray-400 rounded px-2 py-1 w-full"
                                    />
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <button
                                        onClick={() => handleWeigh('out')}
                                        className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
                                    >
                                        Timbang
                                    </button>
                                    <button
                                        onClick={handleResetOut}
                                        className="bg-red-500 text-white px-4 py-1 rounded"
                                    >
                                        Ulang
                                    </button>
                                </td>
                            </tr>

                            <tr className='bg-purple-200'>
                                <td className="p-2">-</td>
                                <td className="p-2">Netto</td>
                                <td className="p-2">
                                    <input
                                        type="text"
                                        value={weights.netto || ''}
                                        readOnly
                                        className="border rounded-md p-1 w-full bg-gray-100"
                                    />
                                    <td className="p-2"></td>
                                </td>
                            </tr>
                            <tr className='bg-orange-200'>
                                <td className="p-2">-</td>
                                <td className="p-2">Tara</td>
                                <td className="p-2">
                                    <input
                                        type="text"
                                        value={weights.tara || ''}
                                        readOnly
                                        className="border rounded-md p-1 w-full bg-gray-100"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mt-8">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <div className="mb-4">
                            <label className="block font-bold mb-1">No. Kendaraan</label>
                            <input
                                type="text"
                                name="vehicleNumber"
                                value={formData.vehicleNumber}
                                onChange={handleInputChange}
                                className="border border-gray-400 rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Nama Barang</label>
                            <select
                                name="productName"
                                value={formData.productName}
                                onChange={handleInputChange}
                                className="border border-gray-400 rounded px-2 py-1 w-full"
                            >
                                <option value="">Pilih Produk</option>
                                {products.map((product, index) => (
                                    <option key={index} value={product.nama_barang}>
                                        {product.nama_barang}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2">Nama Customer</label>
                            <select
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleInputChange}
                                className="border border-gray-400 rounded px-2 py-1 w-full"
                            >
                                <option value="">Pilih Customer</option>
                                {customers.map((customer, index) => (
                                    <option key={index} value={customer.nama}>
                                        {customer.nama}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2">Transporter</label>
                            <select
                                name="transporter"
                                value={formData.transporter}
                                onChange={handleInputChange}
                                className="border border-gray-400 rounded px-2 py-1 w-full"
                            >
                                <option value="">Pilih Transporter</option>
                                {transporters.map((transporter, index) => (
                                    <option key={index} value={transporter.nama_transporter}>
                                        {transporter.nama_transporter}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block font-bold mb-1">Nomor DO/PO</label>
                            <input
                                type="text"
                                name="doPoNumber"
                                value={formData.doPoNumber}
                                onChange={handleInputChange}
                                className="border border-gray-400 rounded px-2 py-1 w-full"
                            />
                        </div>
                    </div>
                    <div className="col-span-2 flex justify-between items-end">
                        <div className="text-center">
                            <label className="block font-bold mb-1">Sopir</label>
                            <input
                                type="text"
                                name="sopir"
                                value={formData.sopir}
                                onChange={handleInputChange} className="border-t border-gray-400 w-48 mx-auto" />
                        </div>
                        <div className="text-center">
                            <label className="block font-bold mb-1">Petugas</label>
                            <input
                                type="text"
                                name="petugas"
                                value={formData.petugas}
                                onChange={handleInputChange}
                                className="border-t border-gray-400 w-48 mx-auto" />
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex justify-end gap-4">
                    <button
                        onClick={handleSave}
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                        Simpan
                    </button>
                    <button
                        onClick={handlePrint}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                    >
                        Cetak
                    </button>
                </div>
            </div>
        </div>
    );
}