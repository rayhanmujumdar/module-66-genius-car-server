const express = require('express')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000
const jwt = require('jsonwebtoken');
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

// middleware
const verifyToken = (req, res, next) => {
    const AuthHeader = req?.headers?.authorization
    if(!AuthHeader){
        return res.send({message: 'unauthorized access'})
    }
    const token = AuthHeader?.split(' ')[1]
    jwt.verify(token,process.env.DB_ACCESS_TOKEN,(err,decoded) => {
        if(err){
            return res.status(403).send({message: 'forbidden access'});
        }
        req.decoded = decoded
        next()
    })
}

const run = async () => {
    try {
        await client.connect()
        const serviceCollection = client.db('GeniusCar').collection('services')
        const orderCollection = client.db('GeniusCar').collection('order')

        // Auth
        app.post('/login', async (req, res) => {
            const email = req.body
            const accessToken = jwt.sign(email, process.env.DB_ACCESS_TOKEN, {
                expiresIn: '1d'
            })
            res.send({
                accessToken
            })
        })

        //services api
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
        app.post('/service', async (req, res) => {
            const service = req.body
            const result = await serviceCollection.insertOne(service)
            res.send(result)
        })

        //delete service
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id
            const query = {
                _id: ObjectId(id)
            }
            console.log(query)
            const result = await serviceCollection.deleteOne(query)
            res.send(result);
        })

        //order collection insert api
        app.post('/order', async (req, res) => {
            const order = req.body
            const result = await orderCollection.insertOne(order)
            res.send(result)
        })

        //get the order collection
        app.get('/order', verifyToken, async (req, res) => {
            const decoded = req?.decoded?.email
            const email = req.query.email
            if(decoded === email){
                const query = {email}
                const cursor = orderCollection.find(query)
                const result = await cursor.toArray()
                res.send(result)
            }
            else{
                res.status(403).send({message: 'forbidden access'})
            }
        })

    } finally {

    }
}

run().catch(console.dir)

app.get('/',(req,res) => {
    res.send('genius car service is starting')
})

app.listen(port, () => {
    console.log('Listening to port' + port)
})

