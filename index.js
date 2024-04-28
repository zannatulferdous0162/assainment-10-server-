const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port =process.env.PORT|| 3000

app.use(express.json())
app.use(cors())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.User}:${process.env.password}@cluster0.hwuf8vx.mongodb.net/?retryWrites=true&w=majority`;

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
    // Send a ping to confirm a successful connection
    const database = client.db("craftDB");
    const Products = database.collection("products");



    app.post('/products',async(req,res)=>{
         const createData=req.body;
         const result=await Products.insertOne(createData)
         res.send(result)
    })
    app.get('/products',async(req,res)=>{
         const result= await Products.find().toArray()
         res.send(result)
    })
    app.delete('/products/:id', async (req, res) => {
        const id = req.params.id
        const query = { _id: new ObjectId(id) };
        const result = await Products.deleteOne(query)
        res.send(result)
      })
    app.get('/products/:id', async (req, res) => {
        const id = req.params.id
        const query = { _id: new ObjectId(id) };
        const result = await Products.findOne(query)
        res.send(result)
      })
    app.get('/product', async (req, res) => {
        const email = req.query.email;

        if (!email) {
          res.send([]);
        }
        const query = { email: email };
       
        const result = await Products.find(query).toArray()
        res.send(result)
      })

      app.patch('/products/:id', async (req, res) => {
        const id = req.params.id;
        const updateDoc = req.body;
        const filter = { _id: new ObjectId(id) };
  
        const result = await Products.updateOne(filter, { $set: updateDoc })
  
        res.send(result)
  
      })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})