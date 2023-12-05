const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.stwjmc7.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    let _db;
    const MongoConnect =  async () => {
      try {
        const Client =await client.connect();
        _db = Client.db("Ecommerce");
        console.log("successfully connected to MongoDB!");
      } catch(error){
        console.error(error);
      }
    }
    const getDb = ()=>{
      if(_db){
        return _db;
      }else{
        throw "No Database Connection";
      }
    }
   
    exports.MongoConnect = MongoConnect;
    exports.getDb = getDb;
