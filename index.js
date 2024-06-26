const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.port || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

//middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mfnurby.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //fashion collection create
    const brandCollection = client.db('FashionDB').collection('brand_collection')


    //send data and add data to the server side by using post method
    app.post('/fashion', async (req, res) => {
      const newBrand = req.body
      console.log(newBrand);
      const result = await brandCollection.insertOne(newBrand)
      res.send(result)
    })
    //get data and show in local host 5000 server and load
    app.get('/fashion', async (req, res) => {
      const data = brandCollection.find()
      const result = await data.toArray()
      res.send(result)
    })

    //my cart collection
    const cartCollection = client.db('FashionDB').collection('cart_collection')

    //send my cart data to the server
    app.post('/cart', async (req, res) => {
      const newItem = req.body
      console.log(newItem);
      const result = await cartCollection.insertOne(newItem)
      res.send(result);
    })
    app.get('/cart', async (req, res) => {
      const data = cartCollection.find()
      const result = await data.toArray()
      res.send(result)
    })
    //delete cart
    // DELETE route to remove an item from the cart
    app.delete('/cart/:id', async (req, res) => {
        const id = req.params.id;
        try {
            const result = await cartCollection.deleteOne({ _id: ObjectId(id) });
            if (result.deletedCount === 1) {
                res.status(200).json({ message: 'Item deleted successfully' });
            } else {
                res.status(404).json({ message: 'Item not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'An error occurred', error });
        }
    });

    // app.delete('/cart/:id', async (req, res) => {
    //   const id = req.params.id
    //   const query = { _id: new ObjectId(id) }
    //   const result = await cartCollection.deleteOne(query)
    //   res.send(result)
    // })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



//
app.get('/', (req, res) => {
  res.send('fashion is running in website')
})
app.listen(port, () => {
  console.log(`fashion server ${port}`);
})