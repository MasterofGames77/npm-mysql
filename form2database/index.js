require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const path = require('path');
const app = express();
const port = process.env.PORT || 3005;

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// Serve static files (like the HTML form)
app.use(express.static(path.join(__dirname, 'public')));

// Create a MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL Server:', err);
        process.exit(1); // Exit the process with an error code
    }
    console.log('Connected to MySQL Server!');
});

// Endpoint to handle form submission
app.post('/adduser', (req, res) => {
    const { first_name, last_name, department, salary, job_title, hire_date, end_date } = req.body;

    if (!first_name || !last_name || !department || !salary || !job_title || !hire_date) {
        return res.status(400).send('All fields except EndDate are required');
    }

    const query = 'INSERT INTO employees SET ?';
    const user = { first_name, last_name, department, salary, job_title, hire_date, end_date };

    connection.query(query, user, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Error inserting data');
        }
        console.log('1 record inserted');
        res.send('Employee added successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});