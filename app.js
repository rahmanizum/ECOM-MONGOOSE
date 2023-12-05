
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.stwjmc7.mongodb.net/EcomMongoose?retryWrites=true&w=majority`;


const AdminRouter = require('./routes/admin');
const customerRouter = require('./routes/customer');
const paymentRouter = require('./routes/payment');
const passwordRouter = require('./routes/password')
const mainPagecontroler = require('./controllers/mainPage');

const {MongoConnect} = require('./util/database')

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cookieParser());

app.use('/admin', AdminRouter);
app.use('/customer', customerRouter);
app.use('/payment',paymentRouter);
app.use('/password',passwordRouter);
app.get('/', mainPagecontroler.getHomepage);
app.use(mainPagecontroler.getErrorPage)




PORT = process.env.PORT;
async function initiate() {
  try {
   await mongoose.connect(uri);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} `);
    })
  } catch (err) {
    console.log(err);
  }
}
initiate();
