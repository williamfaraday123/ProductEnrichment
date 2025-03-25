const { pool } = require('./db');
const fs = require('fs');
const path = require('path');

const schemaFilePath = path.join(__dirname, 'schema.sql');;

const initializeDatabase = async () => {
    let client;
    try {
        client = await pool.connect();
        const schema = fs.readFileSync(schemaFilePath, 'utf-8');
        await client.query(schema);
        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Error initializeing database:', err);
        throw err;
    } finally {
        if (client)
            client.release();
    }
};

module.exports = {
    initializeDatabase,
};