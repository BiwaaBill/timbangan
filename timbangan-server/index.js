const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const PDFDocument = require('pdfkit');
const fs = require('fs');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

let db;

function handleDisconnect() {
    db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
    });

    db.connect(err => {
        if (err) {
            console.error('Error connecting to database:', err);
            setTimeout(handleDisconnect, 3600);
        } else {
            console.log('Connected to database');
        }
    });

    db.on('error', err => {
        console.error('Database error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Reconnecting to database...');
            handleDisconnect();
        } else {
            throw err;
        }
    });
}
handleDisconnect();

// API
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const validEmail = 'user_timbangan@gmail.com';
    const validPassword = 'timbangan12';

    if (email === validEmail && password === validPassword) {
        return res.json({ success: true });
    } else {
        return res.json({ success: false, message: 'Email atau password salah' });
    }
});

//-----------homepage-------------//
app.get('/count/supplier', (req, res) => {
    const query = 'SELECT COUNT(*) AS count FROM supplier';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error counting supplier:', err);
            res.status(500).json({ error: 'Error counting supplier' });
        } else {
            res.json({ count: results[0].count });
        }
    });
});

app.get('/count/products', (req, res) => {
    const query = 'SELECT COUNT(*) AS count FROM master_produk';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error counting products:', err);
            res.status(500).json({ error: 'Error counting products' });
        } else {
            res.json({ count: results[0].count });
        }
    });
});

app.get('/count/transports', (req, res) => {
    const query = 'SELECT COUNT(*) AS count FROM transporter';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error counting transports:', err);
            res.status(500).json({ error: 'Error counting transports' });
        } else {
            res.json({ count: results[0].count });
        }
    });
});

//------------------suplier--------------------//
app.get('/supplier', (req, res) => {
    const query = 'SELECT * FROM supplier';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching supplier:', err);
            res.status(500).send('Error fetching supplier');
        } else {
            res.json(results);
        }
    });
});

app.get('/supplier/:kode', (req, res) => {
    const query = 'SELECT * FROM supplier WHERE kode = ?';
    db.query(query, [req.params.kode], (err, results) => {
        if (err) {
            console.error('Error fetching customer:', err);
            res.status(500).send('Error fetching customer');
        } else if (results.length === 0) {
            res.status(404).send('Customer not found');
        } else {
            res.json(results[0]);
        }
    });
});

app.put('/supplier/:kode', (req, res) => {
    const query = 'UPDATE supplier SET ? WHERE kode = ?';
    db.query(query, [req.body, req.params.kode], (err) => {
        if (err) {
            console.error('Error updating customer:', err);
            res.status(500).json({ error: 'Error updating customer' });
        } else {
            res.status(200).json({ message: 'Customer updated successfully' });
        }
    });
});

app.post('/supplier', (req, res) => {
    const query = 'INSERT INTO supplier SET ?';
    db.query(query, req.body, (err, results) => {
        if (err) {
            console.error('Error adding customer:', err);
            res.status(500).send('Error adding customer');
        } else {
            res.status(201).json({ kode: results.insertId, ...req.body });
        }
    });
});


app.delete('/supplier/:kode', (req, res) => {
    const query = 'DELETE FROM supplier WHERE kode = ?';
    db.query(query, [req.params.kode], (err) => {
        if (err) {
            console.error('Error deleting customer:', err);
            res.status(500).send('Error deleting customer');
        } else {
            res.status(200).send('Customer deleted successfully');
        }
    });
});

app.get('/supplier/:kode/print', (req, res) => {
    const { kode } = req.params;
    const query = 'SELECT * FROM supplier WHERE kode = ?';

    db.query(query, [kode], (err, results) => {
        if (err) {
            console.error('Error fetching supplier data:', err);
            return res.status(500).send('Failed to fetch supplier data.');
        }

        if (results.length === 0) {
            return res.status(404).send('Supplier not found.');
        }

        const supplier = results[0];
        const doc = new PDFDocument();
        const filename = `supplier-${supplier.kode}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

        doc.text(`Supplier Report`);
        doc.text(`Kode: ${supplier.kode}`);
        doc.text(`Nama: ${supplier.nama}`);
        doc.text(`Alamat: ${supplier.alamat}`);
        doc.text(`Kota: ${supplier.kota}`);
        doc.text(`Telepon: ${supplier.telepon}`);
        doc.text(`Facsimile: ${supplier.facsimile}`);
        doc.text(`PIC: ${supplier.pic}`);

        doc.pipe(res);
        doc.end();
    });
});

//--------------------masterproduct--------------------//
app.get('/products', (req, res) => {
    const query = 'SELECT * FROM master_produk';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch products' });
        }
        res.json(results);
    });
});

app.post('/products', (req, res) => {
    const { kode, nama_barang } = req.body;
    if (!kode || !nama_barang) {
        return res.status(400).json({ error: 'Kode and nama_barang are required' });
    }

    const query = 'INSERT INTO master_produk (kode, nama_barang) VALUES (?, ?)';
    db.query(query, [kode, nama_barang], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to insert product' });
        }
        res.json({ message: 'Product added successfully', id: results.insertId });
    });
});

app.put('/products/:kode', (req, res) => {
    const { kode, nama_barang } = req.body;
    if (!kode || !nama_barang) {
        return res.status(400).json({ error: 'Kode and nama_barang are required' });
    }

    const query = 'UPDATE master_produk SET kode = ?, nama_barang = ? WHERE kode = ?';
    db.query(query, [kode, nama_barang, req.params.kode], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update product' });
        }
        res.json({ message: 'Product updated successfully' });
    });
});



app.delete('/products/:kode', (req, res) => {
    const { kode } = req.params;

    const query = 'DELETE FROM master_produk WHERE kode = ?';
    db.query(query, [kode], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete product' });
        }
        res.json({ message: 'Product deleted successfully' });
    });
});

app.get("/products/:kode/print", (req, res) => {
    const { kode } = req.params;

    const query = "SELECT * FROM master_produk WHERE kode = ?";
    db.query(query, [kode], (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ error: "Failed to fetch product" });
        }

        const product = results[0];
        const doc = new PDFDocument();
        const fileName = `product-${kode}.pdf`;

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

        doc.pipe(res);

        doc.fontSize(18).text("Product Details", { align: "center" });
        doc.moveDown();
        doc.fontSize(14).text(`Kode Produk: ${product.kode}`);
        doc.text(`Nama Barang: ${product.nama_barang}`);
        doc.moveDown();

        doc.end();
    });
});

//-----------transporter-----------------//

app.get('/transports', (req, res) => {
    const query = 'SELECT * FROM transporter';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching transports:', err);
            res.status(500).send('Error fetching transports');
        } else {
            res.json(results);
        }
    });
});

app.get('/transports/:kode_transporter', (req, res) => {
    const query = 'SELECT * FROM transporter WHERE kode_transporter = ?';
    db.query(query, [req.params.kode_transporter], (err, results) => {
        if (err) {
            console.error('Error fetching transporter:', err);
            return res.status(500).json({ error: 'Failed to fetch transporter' });
        }
        res.json(results[0]);
    });
});

app.post('/transports', (req, res) => {
    const { kode_transporter, nama_transporter } = req.body;
    if (!kode_transporter || !nama_transporter) {
        return res.status(400).json({ error: 'Kode and nama_transporter are required' });
    }

    const query = 'INSERT INTO transporter (kode_transporter, nama_transporter) VALUES (?, ?)';
    db.query(query, [kode_transporter, nama_transporter], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to add transporter' });
        }
        res.json({ message: 'Transporter added successfully', id: results.insertId });
    });
});

app.put('/transports/:kode_transporter', (req, res) => {
    const { kode_transporter, nama_transporter } = req.body;
    const query = 'UPDATE transporter SET nama_transporter = ?, kode_transporter = ?  WHERE kode_transporter = ?';
    db.query(query, [nama_transporter, kode_transporter, req.params.kode_transporter], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update transporter' });
        }
        res.json({ message: 'Transporter updated successfully' });
    });
});


app.delete('/transports/:kode_transporter', (req, res) => {
    const query = 'DELETE FROM transporter WHERE kode_transporter = ?';
    db.query(query, [req.params.kode_transporter], (err) => {
        if (err) {
            console.error('Error deleting transporter:', err);
            return res.status(500).json({ error: 'Failed to delete transporter' });
        }
        res.json({ message: 'Transporter deleted successfully' });
    });
});

app.get('/print/transporter/:kode_transporter', (req, res) => {
    const { kode_transporter } = req.params;

    const query = 'SELECT * FROM transporter WHERE kode_transporter = ?';

    db.query(query, [kode_transporter], (err, results) => {
        if (err) {
            console.error('Error fetching transporter data:', err);
            return res.status(500).send('Failed to fetch transporter data.');
        }

        if (results.length === 0) {
            return res.status(404).send('Transporter not found.');
        }

        const transporter = results[0];

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');

        doc.text(`Transporter Report`, { align: 'center', fontSize: 18 });
        doc.text(`Kode: ${transporter.kode_transporter}`);
        doc.text(`Nama: ${transporter.nama_transporter}`);

        doc.pipe(res);
        doc.end();
    });
});

//----------penimbangan------------//
app.post('/api/penimbangan', (req, res) => {
    const {
        no_record,
        waktu_masuk,
        waktu_keluar,
        berat_penimbangan1,
        berat_penimbangan2,
        netto,
        tara,
        no_kendaraan,
        nama_barang,
        nama_customer,
        transporter,
        do_po,
        sopir,
        petugas,
    } = req.body;

    const query = `
      INSERT INTO penimbangan (
        no_record, waktu_masuk, waktu_keluar, berat_penimbangan1, berat_penimbangan2, netto, tara, 
        no_kendaraan, nama_barang, nama_customer, transporter, do_po, sopir, petugas
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [
            no_record,
            waktu_masuk,
            waktu_keluar,
            berat_penimbangan1,
            berat_penimbangan2,
            netto,
            tara,
            no_kendaraan,
            nama_barang,
            nama_customer,
            transporter,
            do_po,
            sopir,
            petugas,
        ],
        (err, result) => {
            if (err) {
                console.error('Error saving data:', err);
                return res.status(500).send('Error saving data');
            }
            res.status(200).send('Data saved successfully');
        }
    );
});

app.get('/api/penimbangan', (req, res) => {
    const query = `SELECT * FROM penimbangan`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Error fetching data');
        }
        res.status(200).json(results);
    });
});

app.put('/api/penimbangan/:id', (req, res) => {
    const { id } = req.params;
    const data = req.body;

    // Filter out keys with null or undefined values
    const updates = Object.entries(data)
        .filter(([key, value]) => value !== null && value !== undefined)
        .map(([key]) => `${key} = ?`);

    if (updates.length === 0) {
        return res.status(400).send('No valid data to update');
    }

    const query = `
        UPDATE penimbangan
        SET ${updates.join(', ')}
        WHERE id = ?
    `;

    const values = [
        ...Object.values(data).filter(value => value !== null && value !== undefined),
        id,
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            return res.status(500).send('Error updating data');
        }
        res.status(200).send('Data updated successfully');
    });
});



//penimbangan suplier
app.get('/penimbangan/supplier', (req, res) => {
    const query = 'SELECT nama FROM supplier';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching supplier:', err);
            res.status(500).send('Error fetching supplier');
        } else {
            res.json(results);
        }
    });
});

//penimbangan produk
app.get('/penimbangan/products', (req, res) => {
    db.query('SELECT nama_barang FROM master_produk', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results); // Send product data as JSON
    });
});

//penimbangan-transporter
app.get('/penimbangan/transports', (req, res) => {
    const query = 'SELECT nama_transporter FROM transporter';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching transporters:', err);
            res.status(500).send('Error fetching transporters');
        } else {
            res.json(results);
        }
    });
});



const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
