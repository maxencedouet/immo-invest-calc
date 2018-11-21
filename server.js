require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');

const { scheduler, batch } = require('./src/scheduler');
const { getRentability, query } = require('./src/get-results')
const importProperties = require('./src/import-properties');
const calcPayback = require('./src/calc-payback');
const calcDuration = require('./src/calc-duration');

const DB_USER = process.env.DB_USER;
const DB_PWD = process.env.DB_PWD;
const ENV = process.env.ENV;

const PORT = 3000
const url = (ENV == 'local') ? 'mongodb://localhost:27017/immo-invest' : `mongodb://${DB_USER}:${DB_PWD}@ds151513.mlab.com:51513/immo-invest`
console.log('Server launched on port', PORT);

const app = express()
app.use(cors())
app.use(express.static('www'))
mongoose.connect(url, { useNewUrlParser: true });

// scheduler()

app.get('/', async function (req, res) {
  res.sendFile( __dirname + "/www/index.html" );
})

app.get('/q', async function (req, res) {
  const properties = await query(req.query.filters)
  res.json(properties)
})

app.get('/i', async function (req, res) {
  const createdAt = Date.now()
  batch('flat', createdAt)
})

const server = app.listen(PORT);
server.setTimeout(5000000)
