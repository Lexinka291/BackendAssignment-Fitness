require('dotenv').config();
const { Client } = require("pg");

async function testConnection() {
  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();
    console.log("Connected to Postgres successfully!");
    const res = await client.query("SELECT NOW()");
    console.log(res.rows);
  } catch (err) {
    console.error("Error connecting to Postgres:", err);
  } finally {
    await client.end();
  }
}

testConnection();
