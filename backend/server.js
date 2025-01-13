const express = require('express');
const pool = require('./database');
const cors = require('cors')


const port = process.env.PORT || 3000;
const app = express();

app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
app.use(express.json({ limit: '10mb' })); // Allow payloads up to 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true })); // For form submissions


app.get('/clothes', async (req, res) => {
    try {
      const clothes = await pool.query("SELECT * FROM clothes ORDER BY id");
      const clothesWithBase64Images = clothes.rows.map(item => ({
        ...item,
        image: item.image ? item.image.toString('base64') : null, // Convert binary image to base64
      }));
      res.json(clothesWithBase64Images);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Internal server error' });
    }
});

const multer = require('multer');
const upload = multer();

app.post('/clothes', upload.single('image'), async (req, res) => {
    const { name, type, tags } = req.body;
    const image = req.file.buffer; // Binary image data
    const id = Date.now();

    try {
        const result = await pool.query(
        `INSERT INTO "clothes" (id, name, type, tags, image) VALUES ($1, $2, $3, $4, $5)`,
        [id, name, type, tags, image]
        );
        res.status(201).json({ message: 'Clothing item added successfully', id });
    } catch (error) {
        console.error('Error inserting into database:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/clothes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM "clothes" WHERE id = $1', [id]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Clothing item deleted successfully' });
        } else {
            res.status(404).json({ message: 'Clothing item not found' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log("Server is listening to port " + port)
});