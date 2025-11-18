const pkg = require("pg");
const { Pool } = pkg;

const psql = new Pool({
    host: 'localhost',
    database: 'power_check',
    user: process.env.USER_DB,
    password: process.env.PASSW_DB,
    port: '5432',
});

async function db(sql, params = []) {
    const client = await psql.connect();
    try {
        const result = await client.query(sql, params);
        return result;
    } finally {
        client.release();
    }
}

module.exports = db;