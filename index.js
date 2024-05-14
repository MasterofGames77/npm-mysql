//const dotenv = require('dotenv')
require('dotenv').config()
const doxname = process.env.SECRET_USER
const PORT = process.env.PORT
console.log(doxname);

const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World') // Change this to index.html
})

app.listen(PORT)