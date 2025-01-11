const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "HarmoRenoRon",
    database: "Wardrobe",
    host: "localhost",
    port: "5433"
});

const execute = async(dropTblQuery, createTblQuery, insertDataQuery) => {
    try {
        await pool.connect();
        await pool.query(dropTblQuery); // Drop table if it exists
        await pool.query(createTblQuery);
        await pool.query(insertDataQuery);
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    }
};

const createTblQuery = `
  CREATE TABLE IF NOT EXISTS "clothes" (
    "id" INTEGER PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "tags" TEXT
  );
`;

const insertDataQuery = `
  INSERT INTO "clothes" ("id", "name", "type", "image", "tags")
  VALUES
    (1, 'T-Shirt', 'Tops', '@/assets/images/tshirt.jpg', '[]'),
    (2, 'Jeans', 'Bottoms', '@/assets/images/jeans.jpg', '[]'),
    (3, 'Sneakers', 'Shoes', '@/assets/images/sneakers.jpg', '[]'),
    (4, 'Sweater', 'Tops', '@/assets/images/sweater.jpg', '[]'),
    (5, 'Shorts', 'Bottoms', '@/assets/images/shorts.jpg', '[]');
`;

const dropTblQuery = `
  DROP TABLE IF EXISTS "clothes";
`;

execute(dropTblQuery, createTblQuery, insertDataQuery).then(result => {
    if (result) {
        console.log('If does not exists, table "clothes" is created');
    }
});

module.exports = pool;