const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();

// middlewhare
app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://smartGadget:RDSrZffkbFEDBiTZ@cluster0.41lov.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const ProductCollection = client.db("smartGadget").collection("products");
        const ReviesCollection = client.db("smartGadget").collection("reviews");

        // ALL Products
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

        // Reviews
        app.get('/reviews', async (req, res) => {
            const query = {}
            const cursor = ReviesCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

        // delete item
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await ProductCollection.deleteOne(query)
            res.send(result)
        })


        // find my item
        app.get('/product', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = ProductCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

        // update item
        // app.put('/products/:id', async (req, res) => {
        //     const id = req.params.id;
        //     console.log(id)
        //     const updateUser = req.body;
        //     const filter = { _id: ObjectId(id) }
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             Quantity: updateUser?.Quantity
        //         }
        //     }
        //     const result = await ProductCollection.updateOne(filter, updateDoc, options)
        //     res.send(result)
        // })

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


