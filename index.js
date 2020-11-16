const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
require('dotenv').config();
const port = 5000;
const app = express();



//middlewear
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());
//database 

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8acpe.mongodb.net/${process.env.DB_PASS}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get("/",(req,res)=>{
  res.send("yaya app running");
})

client.connect(err => {
    const homeCollection = client.db("apartment-hunt").collection("home");
    const bookingCollection = client.db("apartment-hunt").collection("booking");
    
    //to add house to mongo db
    app.post("/addhome",(req,res) => {
      const file = req.files.file;
      const title = req.body.title;
      const address = req.body.address;
      const bedroom = req.body.bedroom;
      const bathroom = req.body.bathroom;
      const price = req.body.price;
      const newimg = file.data;
      const encImg = newimg.toString('base64');
      const image =  {
        img : Buffer(encImg,'base64')
      }
      homeCollection.insertOne({title,address,bedroom,bathroom,price,image})
      .then(result =>{
        res.send(result.insertedCount>0);
      })
    })


    //to get all house from database
  app.get("/home",(req,res) => {
    homeCollection.find({})
    .toArray((err,document)=>{
      res.send(document);
    })
  })

  //to post booking to dababase
  app.post("/addbooking",(req,res) =>{
    const bookingInfo = req.body;
    bookingCollection.insertOne(bookingInfo)
    .then(result => {
      res.send(result.insertedCount>0)
    })
  })

  //to get all booking
  app.get("/getbooking",(req,res) =>{
    bookingCollection.find({})
    .toArray((err,document)=>{
      res.send(document)
    })
  })

  //to get booking based on user email
  app.get("/singlebooking",(req,res) =>{
    const email = req.query.email;
    bookingCollection.find({email: email})
    .toArray((err,document) => {
      res.send(document);
    })
  })
  
    
  });



app.listen(port);