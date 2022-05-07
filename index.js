const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iaanr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itemCollection = client.db("sportsMansWarehouse").collection("item");
        // const orderCollection = client.db("sportsMansWarehouse").collection("item");

        // AUTH
        
        // app.post('/login', async (req, res) => {
        //     const user = req.body;
        //     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        //         expiresIn: '1d'
        //     })
        //     res.send({ accessToken })
        // })

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
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result)
        })

        // //DELETE
        // app.delete('/service/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await serviceCollection.deleteOne(query);
        //     res.send(result)
        // })

        // //order collection API
        // app.get('/order', verifyJWT, async (req, res) => {
        //     const decocedEmail = req.decoded.email;
        //     const email = req.query.email;
        //     if (email === decocedEmail) {
        //         const query = { email: email }
        //         const cursor = orderCollection.find(query);
        //         const order = await cursor.toArray()
        //         res.send(order)
        //     }
        //     else{
        //         res.status(403).send({message: 'forbidden access'})
        //     }
        // })

        // app.post('/order', async (req, res) => {
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