const express = require('express')
const path = require('path')
var MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
var ObjectID = require('mongodb').ObjectID; 



var url = "mongodb+srv://hrcadmin:Zuhry123@hrc.mhvrm.mongodb.net/myFirstDatabase?authSource=admin&replicaSet=atlas-qypj1x-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";

const PORT = process.env.PORT || 3000
const app = express()

var urlencodedParser = bodyParser.urlencoded({
  extended: true
});
app.use(urlencodedParser);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use((req, res, next) => { //doesn't send response just adjusts it
    res.header("Access-Control-Allow-Origin", "*") //* to give access to any origin
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization" //to give access to all the headers provided
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); //to give access to all the methods provided
        return res.status(200).json({});
    }
    next(); //so that other routes can take over
});

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))


MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {

    const db = client.db('insta-db')

    app.get('/insta-api/get-all-posts', ( _ , res) => {
      db.collection('post').find().toArray()
        .then(results => {
          console.log(results)
          res.json({ messages: results })
        })
        .catch(error => console.error(error))
    })

    app.get('/insta-api/get-all-liked-posts', ( _ , res) => {
      var query = { is_liked: 1 };
      db.collection('post').find(query).toArray()
        .then(results => {
          console.log(results)
          res.json({ messages: results })
        })
        .catch(error => console.error(error))
    })

    app.post('/insta-api/toggle-like', (req, res) => {
      var id     = req.body.id;
      var status = req.body.status;
      var count = req.body.count;
      let new_like;
      let new_status;

      if (parseInt(status) == 1) {
        new_like = parseInt(count) + 1;
      } else {
        new_like = parseInt(count) - 1;
      }

      console.log("id : ", req.body.id )
      console.log("status : ", req.body.status )
      console.log("like : ", req.body.status )


      db.collection('post').findOneAndUpdate(
        { '_id' : ObjectID(id) },
        { $set: { is_liked: parseInt(status), post_like_count: new_like }},
        { upsert: true })
        .then(result => {
          console.log(result)
          res.json({ messages: "Update success" })
         })
        .catch(error => console.error(error))
    })

  })
  .catch(console.error)

app.listen(PORT, () => console.log(`Listning to the post ${PORT}`))
