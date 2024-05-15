require('dotenv').config()
const express = require('express')
const app = express()

const mysql = require('mysql2')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'DriftingSoul81',
  database: 'hrdb'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database successfully!');

  function addUser(newUser) {
    const sql = `INSERT INTO employees (first_name, last_name, department, salary, job_title, hire_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      newUser.first_name,
      newUser.last_name,
      newUser.department,
      newUser.salary,
      newUser.job_title,
      newUser.hire_date,
      newUser.end_date
    ];

    connection.query(sql, values, (error, results) => {
      if (error) {
        console.error('Error adding user:', error);
      } else {
        console.log('User added successfully!');
      }
    });
  }

  const newUser = {
    first_name: 'James',
    last_name: 'Cook',
    department: 'Engineering',
    salary: 70000,
    job_title: 'Software Engineer',
    hire_date: '2023-04-18',
    end_date: null
  };

  addUser(newUser);

  connection.end((err) => {
    if (err) {
      console.error('Error closing database connection:', err);
    } else {
      console.log('Database connection closed successfully!');
    }
  });
}); 