const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

//cors for remote get and post request handling start
const cors = require('cors');
app.use(cors());
//cors for remote get and post request handling ends


//Mongo DB code for DB connect Start
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const assert = require('assert');
//Mongo DB code for DB connect ends




//env config
require('dotenv').config();
//env config ends



// Mongo Connection URL
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jcglm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;




//body parse for getting body json data through API start
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//body parse for getting body json data through API ends







app.get('/', (req, res) => {
    res.send('Hello dear FOr testing');
})


// Mongo Use connect method to connect to the Server
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db("appsMakerBD").collection("services");
    const portfolioCollection = client.db("appsMakerBD").collection("portfolio");
    const adminUserCollection = client.db("appsMakerBD").collection("adminUser");
    const reviewCollection = client.db("appsMakerBD").collection("review");
    const orderCollection = client.db("appsMakerBD").collection("orders");

    console.log('Database connected new');

    //Product Add API
    app.post('/addService', (req, res) => {
        const services = req.body;
        console.log(services);
        serviceCollection.insertOne(services)
            .then(result => {
                console.log(services, 'service added');
                res.send(result.insertedCount > 0);
            })
    })


    //portfolio Add API
    app.post('/addPortfolio', (req, res) => {
        const portfolio = req.body;
        console.log(portfolio);
        portfolioCollection.insertOne(portfolio)
            .then(result => {
                console.log(portfolio, 'portfolio added');
                res.send(result.insertedCount > 0);
            })
    })


    //Showing All Portfolio API
    app.get('/portfolio', (req, res) => {
        portfolioCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    //Add Admin Add API
    app.post('/addAdmin', (req, res) => {
        const admin = req.body;
        console.log(admin);
        adminUserCollection.insertOne(admin)
            .then(result => {
                console.log(admin, 'admin added');
                res.send(result.insertedCount > 0);
            })
    })


    //Review  Add API
    app.post('/addReview', (req, res) => {
        const review = req.body;
        console.log(review);
        reviewCollection.insertOne(review)
            .then(result => {
                console.log(review, 'review added');
                res.send(result.insertedCount > 0);
            })
    })

    //Showing All Reviews API
    app.get('/clientReview', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })




    //Update Order Status  Add API
    app.post('/updateOrderStatus', (req, res) => {
        const updatedData = req.body;
        console.log(updatedData);
        orderCollection.updateOne(
            { orderNumber: updatedData.orderNumber }, { $set: { status: updatedData.status }})
          .then(function(result) {
            // process result
            if(result){
                res.send(true);
            }else{
                res.send(false);
            }
          })
        
    })


    //Order Submit/Checkout API
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        //console.log(order);
        orderCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })


    //Showing All Product API
    app.get('/services', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    //Showing Product By ID API
    app.get('/showServiceById/:id', (req, res) => {
        const id = req.params.id;
        serviceCollection.find({ _id: ObjectId(id) })
            .toArray((err, documents) => {
                //console.log(documents);
                res.send(documents[0]);

            })
    })


    //SHowing Order By email API
    app.get('/showOrders/:email', (req, res) => {
        const email = req.params.email;

        adminUserCollection.find({ email: email })
            .toArray((err, admin) => {
                let filter = { email: email }
                if (admin.length !== 0) {
                    filter = '';
                }
                console.log(admin.length);
                orderCollection.find(filter)
                    .toArray((err, documents) => {
                        console.log(documents)
                        res.send(documents);
                    })
            })

    })



    //Checking for Admin or User
    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminUserCollection.find({ email: email })
            .toArray((err, admin) => {
                //const response=doctors.length;
                //console.log(admin.length);
                res.send(admin.length !== 0)
            })
    })


    //Delete Service by ID API
    app.delete('/deleteService/:id', (req, res) => {
        const id = ObjectId(req.params.id);
        console.log('delete this', id);
        serviceCollection.findOneAndDelete({ _id: id })
            .then(documents => {
                res.send(documents);
            })
    })


    //client.close();
});


//last line of the code
app.listen(port);

