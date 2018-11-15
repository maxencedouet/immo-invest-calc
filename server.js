require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');

const scheduler = require('./src/scheduler');
const { getRentability } = require('./src/get-results')

const DB_USER = process.env.DB_USER;
const DB_PWD = process.env.DB_PWD;

const port = 3000
const url = `mongodb://${DB_USER}:${DB_PWD}@ds151513.mlab.com:51513/immo-invest`

console.log('server launched')

const app = express()
app.use(cors())
mongoose.connect(url, { useNewUrlParser: true });


scheduler();


async function getResults() {
  let screen = 'Importing'

  const loop = setInterval(()=>{
    screen += '.';
    process.stdout.write(screen+'\r');
  }, 500)

  const succ = await getRentability('parking');
  console.log(succ)
  clearInterval(loop);
}
// getResults();



app.get('/import', async function (req, res) {
  res.json('Wait a bit !')
})


const server = app.listen(port);
server.setTimeout(5000000)
