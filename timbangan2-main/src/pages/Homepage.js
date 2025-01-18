
import React, { useEffect, useState } from 'react';
import Card from '../components/Card';

export default function Homepage() {
  const [counts, setCounts] = useState({
    supplier: 0,
    products: 0,
    transports: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [supplierRes, productsRes, transportsRes] = await Promise.all([
          fetch('http://localhost:3002/count/supplier'),
          fetch('http://localhost:3002/count/products'),
          fetch('http://localhost:3002/count/transports'),
        ]);

        const supplierData = await supplierRes.json();
        const productsData = await productsRes.json();
        const transportsData = await transportsRes.json();

        setCounts({
          supplier: supplierData.count,
          products: productsData.count,
          transports: transportsData.count,
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="p-4 bg-gray-100">
      <div className="flex flex-wrap justify-center gap-4">
        <Card
          title="Total Pelanggan"
          count={counts.supplier}
          gradient="bg-gradient-to-r from-blue-500 to-blue-700"
        />
        <Card
          title="Total Produk"
          count={counts.products}
          gradient="bg-gradient-to-r from-green-400 to-teal-500"
        />
        <Card
          title="Total Transporter"
          count={counts.transports}
          gradient="bg-gradient-to-r from-purple-500 to-pink-500"
        />
        <Card title="Transaksi Hari Ini" 
        count="3" 
        gradient="bg-gradient-to-r from-yellow-400 to-orange-500" 
        />
      </div>
    </div>
  );
}
