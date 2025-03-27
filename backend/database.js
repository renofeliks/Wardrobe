const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "",
    database: "Wardrobe",
    host: "localhost",
    port: "5433"
});

const execute = async(createTblQuery) => {
    try {
        await pool.connect();
        await pool.query(createTblQuery);
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    }
};

const createTblQuery = `
  CREATE TABLE IF NOT EXISTS "clothes" (
    "id" BIGINT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "image" BYTEA,
    "tags" TEXT
  );
`;

const insertDataQuery = `
  INSERT INTO "clothes" ("id", "name", "type", "image", "tags")
  VALUES
    (1, 'T-Shirt', 'Tops', '@/assets/images/tshirt.jpg', '[black, short-sleeved]'),
    (2, 'Jeans', 'Bottoms', '@/assets/images/jeans.jpg', '[blue, casual]'),
    (3, 'Sneakers', 'Shoes', '@/assets/images/sneakers.jpg', '[white, casual]'),
    (4, 'Sweater', 'Tops', '@/assets/images/sweater.jpg', '[orange, cozy]'),
    (5, 'Shorts', 'Bottoms', '@/assets/images/shorts.jpg', '[blue, casual]');
`;

execute(createTblQuery).then(result => {
    if (result) {
        console.log('If does not exists, table "clothes" is created');
    }
});

module.exports = pool;