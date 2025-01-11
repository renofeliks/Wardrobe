const express = require('express');
const pool = require('./database');
const cors = require('cors')


const port = process.env.PORT || 3000;
const app = express();

app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
app.use(express.json());


app.get('/clothes', async(req, res) => {
    try {
        console.log("A get all request has arrived");
        const clothes = await pool.query(
            "SELECT * FROM clothes ORDER BY id"
        );
        res.json(clothes.rows);
    } catch (err) {
        console.error(err.message);
    }
});


app.listen(port, () => {
    console.log("Server is listening to port " + port)
});