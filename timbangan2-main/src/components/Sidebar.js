// components/Sidebar.js
import React from 'react';
import { faHome, faUsers, faDolly, faScaleBalanced, faTruck, faClipboardList, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Sidebar = () => {
  return (
    <div className="bg-white text-white w-64 space-y-6 py-7 px-2">
      <nav className="space-y-1">
        <a className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-700 hover:text-white rounded-md" href="/homepage">
          <FontAwesomeIcon icon={faHome} className="w-6" />
          <span className="ml-3">Home</span>
        </a>
        <a className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-700 hover:text-white rounded-md" href="/Penimbangan">
          <FontAwesomeIcon icon={faScaleBalanced} className="w-6" />
          <span className="ml-3">Penimbangan</span>
        </a>
        <a className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-700 hover:text-white rounded-md" href="/master-product">
          <FontAwesomeIcon icon={faDolly} className="w-6" />
          <span className="ml-3">Master Product</span>
        </a>
        <a className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-700 hover:text-white rounded-md" href="/customer">
          <FontAwesomeIcon icon={faUsers} className="w-6" />
          <span className="ml-3">Suplier / Customer</span>
        </a>
        <a className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-700 hover:text-white rounded-md" href="/transporter">
          <FontAwesomeIcon icon={faList} className="w-6" />
          <span className="ml-3">Transporter</span>
        </a>
        <a className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-700 hover:text-white rounded-md" href="/kendaraan">
          <FontAwesomeIcon icon={faTruck} className="w-6" />
          <span className="ml-3">Check Kendaraan</span>
        </a>
        <a className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-700 hover:text-white rounded-md" href="/laporan">
          <FontAwesomeIcon icon={faClipboardList} className="w-6" />
          <span className="ml-3">Laporan</span>
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;