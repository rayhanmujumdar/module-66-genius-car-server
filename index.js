const express = require('express')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

// middlewire
const cors = require('cors')
app.use(cors())
app.use(express.json())

app.get('/',(req,res) => {
    res.send('Running Genius server')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bnf0w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  console.log('connected')
  client.close();
});


app.listen(port,() => {
    console.log('Listening to port' + port)
})