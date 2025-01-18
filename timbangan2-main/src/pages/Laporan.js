import React, { useState } from 'react';

export default function Laporan(props) {
  const [selectedReport, setSelectedReport] = useState('');
  const [formTitle, setFormTitle] = useState('');

  const handleReportChange = (event) => {
    const selectedReport = event.target.id;
    setSelectedReport(selectedReport);
    setFormTitle(getFormTitle(selectedReport));
  };

  const getFormTitle = (reportType) => {
    switch (reportType) {
      case 'laporanHarian':
        return 'Laporan Harian';
      case 'laporanKendaraan':
        return 'Laporan Per No. Kendaraan';
      case 'laporanProduk':
        return 'Laporan per Produk';
      case 'laporanCustomer':
        return 'Laporan per Customer';
      case 'laporanNomorDOPO':
        return 'Laporan per Nomor DO/PO';
      case 'laporanTransporter':
        return 'Laporan per Transporter';
      case 'daftarProduct':
        return 'Daftar Produk';
      case 'daftarCustomerSupplier':
        return 'Daftar Customer / Supplier';
      case 'daftarTransporter':
        return 'Daftar Transporter';
      default:
        return '';
    }
  };

  const handlePrint = () => {
    alert('Print functionality not implemented');
  };

  const handleSave = () => {
    alert('Save functionality not implemented');
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
      <div className="text-xl font-bold mb-4">{formTitle}</div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div>
          <div className="mb-2">
            <input
              type="radio"
              id="laporanHarian"
              name="reportType"
              className="mr-2"
              onChange={handleReportChange}
            />
            <label htmlFor="laporanHarian">Laporan Harian</label>
          </div>
          <div className="mb-2">
            <input
              type="radio"
              id="laporanKendaraan"
              name="reportType"
              className="mr-2"
              onChange={handleReportChange}
            />
            <label htmlFor="laporanKendaraan">Laporan Per No. Kendaraan</label>
          </div>
          <div className="mb-2">
            <input
              type="radio"
              id="laporanProduk"
              name="reportType"
              className="mr-2"
              onChange={handleReportChange}
            />
            <label htmlFor="laporanProduk">Laporan per Produk</label>
          </div>
        </div>
        <div>
          <div className="mb-2">
            <input
              type="radio"
              id="laporanCustomer"
              name="reportType"
              className="mr-2"
              onChange={handleReportChange}
            />
            <label htmlFor="laporanCustomer">Laporan per Customer</label>
          </div>
          <div className="mb-2">
            <input
              type="radio"
              id="laporanNomorDOPO"
              name="reportType"
              className="mr-2"
              onChange={handleReportChange}
            />
            <label htmlFor="laporanNomorDOPO">Laporan per Nomor DO/PO</label>
          </div>
          <div className="mb-2">
            <input
              type="radio"
              id="laporanTransporter"
              name="reportType"
              className="mr-2"
              onChange={handleReportChange}
            />
            <label htmlFor="laporanTransporter">Laporan per Transporter</label>
          </div>
        </div>
        <div>
          <div className="mb-2">
            <input
              type="radio"
              id="daftarProduct"
              name="reportType"
              className="mr-2"
              onChange={handleReportChange}
            />
            <label htmlFor="daftarProduct">Daftar Product</label>
          </div>
          <div className="mb-2">
            <input
              type="radio"
              id="daftarCustomerSupplier"
              name="reportType"
              className="mr-2"
              onChange={handleReportChange}
            />
            <label htmlFor="daftarCustomerSupplier">Daftar Customer / Supplier</label>
          </div>
          <div className="mb-2">
            <input
              type="radio"
              id="daftarTransporter"
              name="reportType"
              className="mr-2"
              onChange={handleReportChange}
            />
            <label htmlFor="daftarTransporter">Daftar Transporter</label>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-4 mb-4 items-center">
        <label htmlFor="tanggal" className="col-span-1">Tanggal</label>
        <input type="text" id="tanggal" className="col-span-1 border rounded px-2 py-1 w-full" />
        <span className="col-span-1 text-center">s/d</span>
        <input type="text" id="tanggal2" className="col-span-1 border rounded px-2 py-1 w-full" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <label htmlFor="customer" className="col-span-1">Customer</label>
        <input type="text" id="customer" className="col-span-2 border rounded px-2 py-1 w-full" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <label htmlFor="product" className="col-span-1">Product</label>
        <input type="text" id="product" className="col-span-2 border rounded px-2 py-1 w-full" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <label htmlFor="noKendaraan" className="col-span-1">No. Kendaraan</label>
        <input type="text" id="noKendaraan" className="col-span-2 border rounded px-2 py-1 w-full" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <label htmlFor="nomorDOPO" className="col-span-1">Nomor DO/PO</label>
        <input type="text" id="nomorDOPO" className="col-span-2 border rounded px-2 py-1 w-full" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <label htmlFor="transporter" className="col-span-1">Transporter</label>
        <input type="text" id="transporter" className="col-span-2 border rounded px-2 py-1 w-full" />
      </div>
      <div className="flex justify-center space-x-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handlePrint}>Print</button>
        <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={handleSave}>Simpan</button>
      </div>
    </div>
  );
};
