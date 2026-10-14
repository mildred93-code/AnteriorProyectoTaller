const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'farmacia_db',
    password: 'Caine042667',
    port: 5432,
});

pool.on('connect', () => {
    console.log('Base de datos conectada exitosamente');
});

module.exports = pool;