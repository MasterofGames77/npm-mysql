require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3007;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.use(session({
    secret: 'Sundancers17',
    resave: false,
    saveUninitialized: true,
}));

// Serve static files from the "public" directory
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

// Route to handle login
app.post('/login', (req, res) => {
    const { last_name, password } = req.body;

    if (!last_name || !password) {
        return res.status(400).json({ success: false, message: 'Last name and password are required' });
    }

    const query = 'SELECT * FROM employees WHERE last_name = ? AND password = ?';
    connection.query(query, [last_name, password], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ success: false, message: 'Error querying the database' });
        }

        if (results.length > 0) {
            req.session.user = results[0];
            res.json({ success: true, message: 'Login successful' , first_name: results[0].first_name});
            console.log(`User ${results[0].first_name} has logged in.`);
        } else {
            res.status(401).json({ success: false, message: 'Invalid last name or password' });
        }
    });
});

// Route to handle logout
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error logging out' });
        }
        res.json({ success: true, message: 'Logout successful' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});