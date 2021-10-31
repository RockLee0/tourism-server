const { MongoClient } = require('mongodb');

const express=require('express');
const ObjectId=require('mongodb').ObjectId;
const cors=require('cors');
require('dotenv').config();


const app=express();
const port=process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



///////////////-----///////////
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wjow1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

///////////////---------///////////////////

/////////async funtion to connect to database //////////
async function run(){
try{
    await client.connect();
    console.log('connected to database'); //checked the connection
     
    const database=client.db('TourPlan');
    const serviceCollection=database.collection('services');
    const orderCollection=database.collection('orders');
    //GET API 
    app.get('/services',async(req,res)=>{
        const cursor=serviceCollection.find({});
        const services=await cursor.toArray();
        res.send(services);
    });

    //GET SINGLE SERVICE
    app.get('/services/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};
        const service=await serviceCollection.findOne(query);
        res.json(service);
    })



    //POST API
    app.post('/services',async(req,res)=>{
        const service =req.body;
        const result=await serviceCollection.insertOne(service);
        res.json(result);
        
        
    });


    //POST FOR BOOKING 
    app.post('/booking',async(req,res)=>{
        const order=req.body;
        const result=await orderCollection.insertOne(order);
        res.json(result);
        
    });
}
finally{
    // await client.close();
}

};

run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Running TourBhai Server');
});

app.listen(port,()=>{
    console.log('Server is on port',port);
});
