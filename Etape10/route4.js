var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://UsernameToken:MdpUsername@broker.shiftr.io')
var path= require('path')

const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
let db

//CONNEXION AU MQTT (Lire la température qui vient de l'arduino)
client.on('connect', function () {
    client.subscribe('temp')
    console.log("connected MQTT")
})

//Serveur qui écoute sur le port 8080
http.listen(8080, function(){
    console.log('listening on :8080')
})

//Connexion à la bdd
connectMOGO()

app.get('/temp2', function (req, res) {
    res.render('./temp2.ejs')
    //Lorsque l'on reçoit un message 
    client.on('message',function(topic, message, packet){
        var now = new Date();

        var vannee = now.getFullYear();
        var vmois = now.getMonth() + 1;
        var vjour = now.getDate();
        var vheure = now.getHours();
        var vminute = now.getMinutes();
        var vseconde = now.getSeconds();
        
        if (vmois < 10) {
            vmois = "0"+vmois.toString();
        }
        if (vjour < 10) {
            vjour = "0"+vjour.toString();
        }
        if (vheure < 10) {
            vheure = "0"+vheure.toString();
        }
        if (vminute < 10) {
            vminute = "0"+vminute.toString();
        }
        if (vseconde < 10) {
            vseconde = "0"+vseconde.toString();
        }

        var fdate = (vjour + "/" + vmois + "/" + vannee)
        var fheure = (vheure + "." + vminute + "." + vseconde)

        //Insert dans la bdd
        insertDb(message.toString(), fdate.toString(), fheure.toString())
    });
})

function insertDb(prmMsg, prmDate, prmHeure){
    const insertDocuments = function(callback=function(){}) {
        // Get the documents collection
        const collection = db.collection('temperatureDB');
        // Insert some documents
        collection.insertMany([
          {date : prmDate, heure : prmHeure,temperature : prmMsg }
        ], function(err, result) {
          assert.equal(err, null);
          console.log("Inserted 1 documents into the collection");
          io.emit('temperature', result)
          callback(result);
        });
    }
    const findDocuments= function(callback=function(){}) {
        // Get the documents collection
        const collection = db.collection('temperatureDB');
        // Find some documents
        collection.find({}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Found the following records");
            callback(JSON.stringify(docs))
        });
    
    }
    console.log("Test10")
    insertDocuments()
    console.log("Test5")
    findDocuments()
}



function connectMOGO(){
    // Connexion URL
    const url = 'mongodb://localhost:27017'
 
    // Database Name
    const dbName = 'IOT'
 
    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to BDD");

         db = client.db(dbName);
        
    });
}