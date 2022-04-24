const express = require('express')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');

// middlewire
const cors = require('cors')
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bnf0w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});


const run = async () => {
    try {
        await client.connect()
        const serviceCollection = client.db('GeniusCar').collection('services')
        app.get('/service', async (req, res) => {
            const query = req.query
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })

        //find a single user
        app.get('/service/:id', async (req, res) => {
            const id = req.params
            const query = {
                _id: ObjectId(id)
            }
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })

        //post services
        app.post('/service',async (req,res) => {
            const service = req.body
            const result = await serviceCollection.insertOne(service)
            res.send(result)
        })

        //delete service
        app.delete('/service/:id',async (req,res) => {
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            console.log(query)
            const result = await serviceCollection.deleteOne(query)
            res.send(result);
        })

    } finally {

    }
}

run().catch(console.dir)

app.listen(port, () => {
    console.log('Listening to port' + port)
})