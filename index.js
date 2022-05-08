const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json())

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        console.log('decoced', decoded);
        req.decoded = decoded;
        next()
    })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iaanr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itemCollection = client.db("sportsMansWarehouse").collection("item");
        const productCollection = client.db("sportsMansWarehouse").collection("item");


        // AUTH
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            })
            res.send({ accessToken });
        })

        // item api

        app.get('/item', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const item = await cursor.toArray();
            res.send(item)
        })

        app.get('/item/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const item = await itemCollection.findOne(query);
            res.send(item)
        })

        //POST
        app.post('/item', async (req, res) => {
            const newitem = req.body;
            const result = await itemCollection.insertOne(newitem);
            res.send(result)
        })

        //DELETE
        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.deleteOne(query);
            res.send(result)
        })

        // //order collection API
        app.get('/item', verifyJWT, async (req, res) => {
            const decocedEmail = req.decoded.email;
            const email = req.query.email;
            if (email === decocedEmail) {
                const query = {email:email}
                const cursor = productCollection.find(query);
                const products = await cursor.toArray();
                res.send(products)
            }
            else{
                res.status(403).send({message: 'forbidden access'})
            }
        })

        // app.post('/item', async (req, res) => {
        //     const order = req.body;
        //     const result = await orderCollection.insertOne(order);
        //     res.send(result)
        // })


    }

    finally {
        //   await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running my node curd server')
})
app.listen(port, () => {
    console.log('curd server is running', port);
})