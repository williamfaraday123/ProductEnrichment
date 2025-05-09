const cors = require('cors');
const express = require('express');
const { initializeDatabase } = require('./database/dbSetup');
const { enrich } = require('./api/enrich');
const { fetch } = require('./api/fetch');
require("dotenv").config();

const app = express();
const port = process.env['PORT'] || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const startServer = async () => {
    try {
        //initialize database
        await initializeDatabase();
        console.log('Database initialized in server');
        
        //start express server
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

app.get('/', (req, res) => {
    res.send('Welcome to the Product Enrichment Backend!');
});

  
//get all products endpoint
app.get('/fetch', fetch);
// Enrich product endpoint
app.post('/enrich', enrich);


startServer();