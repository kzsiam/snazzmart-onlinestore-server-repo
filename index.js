const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())


const port = process.env.PORT || 5000



const uri = "mongodb+srv://SnazzMartnlineStore:yy23MJiWg0rlEqYM@cluster0.pzjaifg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    const categoriesCollection = client.db('MartStore').collection("martCategories")
    const userCollection = client.db('MartStore').collection("userCollection")
    const productCollection = client.db('MartStore').collection("productCollection")
    const cartCollection = client.db('MartStore').collection("cartCollection")
    const favouritesCollection = client.db('MartStore').collection("favouritesCollection")
    const ordersCollection = client.db('MartStore').collection("ordersCollection")



    app.get('/categories', async (req, res) => {
      const query = {}
      const result = await categoriesCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/allProducts/:category', async (req, res) => {
      const category = req.params.category;
      const query = {
        categories: category
      }
      const result = await productCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/similarProduct/:category', async (req, res) => {
      const category = req.params.category;
      const query = {
        categories: category
      }
      const result = await productCollection.find(query).limit(4).toArray()
      res.send(result)
    })

    app.post('/allUsers', async (req, res) => {
      
      
      const query = req.body;
      const result = await userCollection.insertOne(query)
      res.send(result)
    })
    app.get('/allUsers', async (req, res) => {

      const query = {};
      const result = await userCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/allUsers/:email', async (req, res) => {
      const query = req.query.email;
      const result = await userCollection.findOne(query)
      res.send(result)
    })
    // app.get('/sellers/:email', async (req, res) => {
    //   const query = req.query.email;
    //   const result = await userCollection.findOne(query)
    //   res.send(result)
    // })

    app.put('/allUsers/:email', async (req, res) => {
      const email = req.params.email;

      const userInfo = req.body;
      
      const filter = { email };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          shopName: userInfo.shopName,
          phoneNumber: userInfo.phoneNumber,
          location: userInfo.shopLocation,
          accountType: "seller",
        }
      }

      const result = await userCollection.updateOne(filter, updateDoc, option)
      res.send(result)
    })


    app.post('/allProducts', async (req, res) => {
      
      const query = req.body;
      const result = await productCollection.insertOne(query)
      res.send(result)
    })

    app.get('/allProducts', async (req, res) => {
      let query = {}
      if (req.query.email) {
        query = {
          email: req.query.email
        }
      }

      const result = await productCollection.find(query).toArray();
      res.send(result)
    })
    app.get('/allProductsOfSnazzMart', async (req, res) => {
      let query = {}
      const filter = req.query;
      
      // convert price to number
      
      const options = {
        sort:{
          price: filter.sort === 'asc'? 1 : -1
        }
      };
      
      // const search = req.query.search;
      // if (search.length) {
      //   query = {
      //     $text: {
      //       $search: search,
      //       $language: "english",
      //       $caseSensitive: true,
      //       $diacriticSensitive: true
      //     }
      //   }
      // }
      if (req.query.email) {
        query = {
          email: req.query.email
        }
      }

      const cursor =  productCollection.find(query,options)
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const productDetails = await productCollection.findOne(query);
      
      res.send(productDetails)
    })
    app.get('/myProduct/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const productDetails = await productCollection.findOne(query);
      
      res.send(productDetails)
    })
    app.delete('/product/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const productDetails = await productCollection.deleteOne(query);
      res.send(productDetails)
    })

    app.patch('/product/:id', async(req, res) =>{
      const id = req.params.id;
      const updatedInfo = req.body;
      
      const filter = { _id: new ObjectId(id) }
      const option = {upsert: true}
      const updateDoc ={
        $set:{
          color:updatedInfo.color,
          stock:updatedInfo.stock,
          price:updatedInfo.price,
          discount:updatedInfo.discount
        }
      }

      const result = await productCollection.updateOne(filter,updateDoc,option)
      res.send(result)

    })

    app.get('/flashSale', async (req, res) => {
      const query = {}

      const result = await productCollection.find(query).limit(6).toArray();
      res.send(result)
    })
    app.get('/justForYou', async (req, res) => {
      const query = {}

      const result = await productCollection.find(query).limit(24).toArray();
      res.send(result)
    })

    app.get('/allUsers/seller/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email }
      const user = await userCollection.findOne(query);
      res.send({ isSeller: user?.accountType === 'seller' })
    })
    app.get('/allUsers/admin/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email }
      const user = await userCollection.findOne(query);
      res.send({ isAdmin: user?.role === 'admin' })
    })

    app.patch('/allUsers/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const option = { upsert: true }
      const updateDoc = {
        $set: {
          role: 'admin'
        }

      }
      const result = await userCollection.updateOne(filter, updateDoc, option)
      res.send(result)
    })

    app.delete('/allUsers/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })



    app.post('/addToCart', async(req,res) =>{
      const cartDetails = req.body;
      const query = {
        productId: (cartDetails.productId),
        email:cartDetails.email
      }
      const alreadyAdded = await cartCollection.find(query).toArray()
      
      if(alreadyAdded.length){
        const message = 'This item is already added in cart'
        return res.send({ acknowledged: false, message })
      }
      const result = await cartCollection.insertOne(cartDetails)
      res.send(result)
    })
    app.post('/addToFavourites', async(req,res) =>{
      const favouritesData = req.body;
      const query = {
        productId: (favouritesData.productId),
        email:favouritesData.email
      }
      const alreadyAdded = await favouritesCollection.find(query).toArray()
      
      if(alreadyAdded.length){
        const message = 'This item is already added in wishlist'
        return res.send({ acknowledged: false, message })
      }
      const result = await favouritesCollection.insertOne(favouritesData)
      res.send(result)
    })



    app.get('/addToCarts', async(req,res) =>{
      let query = {}
      if (req.query.email) {
        query = {
            email: req.query.email
        }
    }
      const result = await cartCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/addToCarts/:id', async(req,res) =>{
      const id = req.params.id
      const email = req.query.email

      console.log(id,email)

      const query = {
        email: email,
        productId:id
      }
      
      const result = await cartCollection.findOne(query)
      res.send(result)
    })

    app.get('/addToFavourites', async(req,res) =>{
      let query = {}
      if (req.query.email) {
        query = {
            email: req.query.email
        }
    }
      const result = await favouritesCollection.find(query).toArray()
      res.send(result)
    })

    app.delete('/addToCarts/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })
    app.delete('/addToFavourites/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await favouritesCollection.deleteOne(query)
      res.send(result)
    })

    app.get('/checkout/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result)
    })
    app.post('/orders', async(req,res) =>{
      const orderedData = req.body
      
      const result = await ordersCollection.insertOne(orderedData)
      res.send(result)
    })
    app.get('/orders/:email', async(req,res) =>{
      const orderedEmail = req.params.email
      const query = {orderedEmail: orderedEmail }
      const result = await ordersCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/orders', async(req,res) =>{
      
      const query = { }
      const result = await ordersCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/sellerOrders/:email', async(req,res) =>{
      const sellerEmail = req.params.email
      const query = {email: sellerEmail }
      const result = await ordersCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/sellerOrderDetails/:id', async(req,res) =>{
      const id = req.params.id
      const query = {_id: new ObjectId(id) }
      const result = await ordersCollection.findOne(query)
      res.send(result)
    })

    app.patch('/orders/:id', async(req,res) =>{
      const status = req.body
      const id = req.params.id
      const query = {_id: new ObjectId(id) }
      const option = {upsert: true}
      const updateStatus = {
        $set:{
          orderStatus: status.orderStatus
        }
      }
      const result = await ordersCollection.updateOne(query, updateStatus,option)
      res.send(result)
    })

  }
  finally {


  }
}
run().catch(console.dir);


// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('snazzmart is running')
})

app.listen(port, () => {
  console.log('snazzmartr is running')
})