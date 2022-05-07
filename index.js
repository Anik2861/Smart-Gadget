const express = require('express');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middlewhare
app.use(cors())
app.use(express.json())




const uri = "mongodb+srv://smartGadget:RDSrZffkbFEDBiTZ@cluster0.41lov.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const ProductCollection = client.db("smartGadget").collection("products");
        app.get('/products', async (req, res) => {
            const query = {}
            const cursor = ProductCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await ProductCollection.findOne(query);
            res.send(result)
        })
        // post database
        app.post('/products', async (req, res) => {
            const newService = req.body
            const result = await ProductCollection.insertOne(newService)
            res.send(result)
        })
        // delete item
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await ProductCollection.findOne(query)
            res.send(result)
        })
        // update item
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateUser.name,
                    email: updateUser.email,
                }
            }
            const result = await ProductCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })



    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('hellow there i am warehouse')
})

app.listen(port, () => {
    console.log('smart gadget listening port', port)
})