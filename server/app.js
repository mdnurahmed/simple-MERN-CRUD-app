require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');

const app = express();


//parsing json request
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/myposts', postRoutes);


app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

const connectionString = "mongodb://mongo:27017/myblog" ;
mongoose
  .connect(connectionString , { useNewUrlParser: true })
  .then(result => {
    app.listen(5000);
  })
  .catch(err => console.log(err));