const express = require('express');
const cors = require('cors');
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://abudaud:ARbujSXI6PR26ic6@cluster0.bqqvk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("ProductManagementDB");
        const productsCollection = database.collection("products");
        // create a document to insert
        // POST API 
        app.post('/addProduct', async (req, res) => {
            const newProduct = req.body.newAddProduct;
            const result = await productsCollection.insertOne(newProduct);
            res.json(result);
        })

        // GET API
        app.get('/products', async (req, res) =>{
            const products = await productsCollection.find({}).toArray();

            res.send(products);
        })
        //GET API 
        app.get('/product/:id', async (req, res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            
            const result = await productsCollection.findOne(query);

            res.send(result);
        })
        //put api
        app.put("/update", async (req, res) =>{
            const id = req.params.id;
            const updatedProduct = req.body.product;
            console.log(updatedProduct)
            const query = {_id: ObjectId(id)};
            const result = await productsCollection.updateOne(query, updatedProduct);
            console.log(result)
 
 
             res.send(result);
        })

        //DELETE API 
        app.delete("/product/:id", async (req, res) =>{
            const id = req.params.id;
           const query = {_id: ObjectId(id)};
           const result = await productsCollection.deleteOne(query);
           console.log(result)


            res.send(result);
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send("This is ok");
})


app.listen(port, () => {
    console.log("listening on port: ", port)
})