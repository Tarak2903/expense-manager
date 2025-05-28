const express = require('express')
const app = express()
const port = 3000
const bodyparser=require('body-parser')
const { MongoClient } = require('mongodb');
const cors=require('cors')
require('dotenv').config()

app.use(cors())
app.use(bodyparser.json())
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'Expense-Manager';

client.connect();

app.post ('/signin', async (req, res) => {
  const detail=req.body
  const db = client.db(dbName);
  const collection = db.collection('UserSignins');
  const findResult = await collection.findOne({email:req.body.email , password:req.body.password});
  if(findResult){
   return  res.send({success:true})
  }
  res.send({success:false})
})
app.post ('/signup', async (req, res) => {
  const detail=req.body
  const db = client.db(dbName);
  const collection = db.collection('UserSignins');
  const existinguser=await collection.findOne({email: req.body.email})
  if(existinguser){
    return res.json({success:false , message: "User already registered"})
  }
  const findResult = await collection.insertOne(detail);
    res.send({success:true, result:findResult})
})
app.delete ('/dashboard/:user', async (req, res) => {
  const detail=req.body.id
  const user=req.params.user
  const db = client.db(dbName);
  const collection = db.collection(`UserExpense${user}`);
  const findResult = await collection.deleteOne({id: detail});
    res.send({success:true, result:findResult})
})
app.post ('/dashboard/:user', async (req, res) => {
  const newexpense=req.body
  const user =req.params.user    
  const db = client.db(dbName);
  const collection = db.collection(`UserExpense${user}`);
  const findResult = await collection.insertOne(newexpense);
    res.send({success:true, result:findResult})
})
app.get ('/dashboard/:user', async (req, res) => {
  const user =req.params.user    
  const db = client.db(dbName);
  const collection = db.collection(`UserExpense${user}`);
  const findResult = await collection.find({}).toArray();
    res.send({success:true, result:findResult})
})
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
