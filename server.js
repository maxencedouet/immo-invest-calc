require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');

const scheduler = require('./src/scheduler');
const { getRentability } = require('./src/get-results')

const DB_USER = process.env.DB_USER;
const DB_PWD = process.env.DB_PWD;

const PORT = 3000
const url = `mongodb://${DB_USER}:${DB_PWD}@ds151513.mlab.com:51513/immo-invest`

console.log('server launched on port', PORT)

const app = express()
app.use(cors())
mongoose.connect(url, { useNewUrlParser: true });


scheduler();


app.get('/', async function (req, res) {
  const result = {}
  result.parking = await getRentability('parking')
  result.flat = await getRentability('flat')
  res.json(result)
})


const server = app.listen(PORT);
server.setTimeout(5000000)
