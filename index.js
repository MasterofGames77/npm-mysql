require('dotenv').config()
const express = require('express')
const app = express()

const mysql = require('mysql2')

const dbHost = process.env.DB_HOST
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbName = process.env.DB_NAME
const dbTableName = process.env.DB_TABLE_NAME
const dbPort = process.env.PORT

const connection = mysql.createConnection({
  host: dbHost, // or your database host
  user: dbUser, // your MySQL username
  password: dbPassword, // your MySQL password
  database: dbName // the name of your database
});

// Connects to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database successfully!');

  // Define the data to be inserted
  function addUser(newUser) {
    const sql = `INSERT INTO ${process.env.DB_TABLE_NAME} (first_name, last_name, department, salary, job_title, hire_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      newUser.first_name,
      newUser.last_name,
      newUser.department,
      newUser.salary,
      newUser.job_title,
      newUser.hire_date,
      newUser.end_date
    ];

    // Execute the query
    connection.query(sql, values, (error, results) => {
      if (error) {
        console.error('Error adding user:', error);
      } else {
        console.log('User added successfully!');
      }
    });
  }

  const newUser = {
    first_name: 'Alexa',
    last_name: 'Rhodes',
    department: 'Development',
    salary: 65000,
    job_title: 'Software Developer',
    hire_date: '2023-02-21',
    end_date: null
  };

  addUser(newUser);

  // Close the connection
  connection.end((err) => {
    if (err) {
      console.error('Error closing database connection:', err);
    } else {
      console.log('Database connection closed successfully!');
    }
  });
}); 