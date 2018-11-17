require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');

const scheduler = require('./src/scheduler');
const { getRentability, query } = require('./src/get-results')
const importProperties = require('./src/import-properties');

const DB_USER = process.env.DB_USER;
const DB_PWD = process.env.DB_PWD;

const PORT = 3000
const url = `mongodb://${DB_USER}:${DB_PWD}@ds151513.mlab.com:51513/immo-invest`

const app = express()
app.use(cors())
app.use(express.static('www'))
mongoose.connect(url, { useNewUrlParser: true });


app.get('/', async function (req, res) {
  res.sendFile( __dirname + "/www/index.html" );
})

app.get('/q', async function (req, res) {
  console.log(req.query)
  const properties = await query(req.query.filters)

  res.json(properties)
})

console.log('server launched on port', PORT)
const server = app.listen(PORT);
server.setTimeout(5000000)
